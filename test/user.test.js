const request = require('supertest');
const { connetionToServers } = require('../src/app');
const { getVerificationCodeFromEmail } = require('../src/dataaccess/mailDataAccess');
const { server, delayServerConnections, clearDatabase } = require("../src/server");

beforeAll(async () => {
    await delayServerConnections();
    await clearDatabase();
});

afterAll(async () => {
    server.close();
    await clearDatabase();
});

describe('4 users creation', () => {
    let adminToken;
    let moderatorToken;
    let businessToken;
    let personalToken;

    afterAll(async () => {
        await clearDatabase();
    });

    beforeAll(async () => {
        await clearDatabase();

        let response = await request(server).post("/data/region/").send({ "region": "XALAPA" });
        response = await request(server).post("/data/faculty/").send({ "idRegion": "1", "faculty": "FACULTAD_DE_ARQUITECTURA" });
        response = await request(server).post("/data/educationalProgram/").send({ "educationalProgram": "NUTRICION", "idFaculty": "1" });
        response = await request(server).post("/data/educationalProgram/").send({ "educationalProgram": "DERECHO", "idFaculty": "1" });

        response = await request(server).post("/accounts/create/verification").send({ "username": "admin", "email": "admin@uvgram.com" });
        let verificationCode = await getVerificationCodeFromEmail("admin@uvgram.com");
        const admin = {
            name: "Administrator",
            presentation: "Welcome to UVGram.",
            username: "admin",
            password: "hola1234",
            phoneNumber: "2212345678",
            email: "admin@uvgram.com",
            birthdate: "2000-01-01",
            verificationCode
        }
        response = await request(server).post("/accounts/create").send(admin);
        response = await request(server).post("/accounts/users/roles/change").send({ "key": "+jWfhIusDKBwUN6IhnPeAkAFur+5DRzS99GJknMMeS19YpNNCO9Ycfo28tG+XcG4", "emailOrUsername": "admin", "newRoleType": "administrador" });
        response = await request(server).post("/authentication/login").send({ "emailOrUsername": "admin", "password": "hola1234" });
        adminToken = response.body.message.accessToken;

        response = await request(server).post("/accounts/create/verification").send({ "username": "moderator", "email": "moderator@uvgram.com" });
        verificationCode = await getVerificationCodeFromEmail("moderator@uvgram.com");
        const moderator = {
            name: "Moderator",
            presentation: "Welcome to UVGram.",
            username: "moderator",
            password: "hola1234",
            phoneNumber: "2212345678",
            email: "moderator@uvgram.com",
            birthdate: "2000-01-01",
            verificationCode
        }
        response = await request(server).post("/accounts/create").send(moderator);
        response = await request(server).post("/accounts/users/roles/change").send({ "key": "+jWfhIusDKBwUN6IhnPeAkAFur+5DRzS99GJknMMeS19YpNNCO9Ycfo28tG+XcG4", "emailOrUsername": "moderator", "newRoleType": "moderador" });
        response = await request(server).post("/authentication/login").send({ "emailOrUsername": "moderator", "password": "hola1234" });
        moderatorToken = response.body.message.accessToken;


        response = await request(server).post("/accounts/create/verification").send({ "username": "business", "email": "business@uvgram.com" });
        verificationCode = await getVerificationCodeFromEmail("business@uvgram.com");
        const business = {
            name: "business",
            presentation: "Welcome to UVGram.",
            username: "business",
            password: "hola1234",
            phoneNumber: "2212345678",
            email: "business@uvgram.com",
            birthdate: "2000-01-01",
            verificationCode
        }
        response = await request(server).post("/accounts/create").send(business);
        response = await request(server).post("/accounts/users/roles/change").send({ "key": "+jWfhIusDKBwUN6IhnPeAkAFur+5DRzS99GJknMMeS19YpNNCO9Ycfo28tG+XcG4", "emailOrUsername": "business", "newRoleType": "empresarial" });
        response = await request(server).post("/authentication/login").send({ "emailOrUsername": "business", "password": "hola1234" });
        businessToken = response.body.message.accessToken;


        response = await request(server).post("/accounts/create/verification").send({ "username": "personal", "email": "personal@uvgram.com" });
        verificationCode = await getVerificationCodeFromEmail("personal@uvgram.com");
        const personal = {
            name: "personal",
            presentation: "Welcome to UVGram.",
            username: "personal",
            password: "hola1234",
            phoneNumber: "2212345678",
            email: "personal@uvgram.com",
            birthdate: "2000-01-01",
            verificationCode
        }
        response = await request(server).post("/accounts/create").send(personal);
        response = await request(server).post("/accounts/users/roles/change").send({ "key": "+jWfhIusDKBwUN6IhnPeAkAFur+5DRzS99GJknMMeS19YpNNCO9Ycfo28tG+XcG4", "emailOrUsername": "personal", "newRoleType": "personal" });
        response = await request(server).post("/authentication/login").send({ "emailOrUsername": "personal", "password": "hola1234" });
        personalToken = response.body.message.accessToken;
    });

    test('POST /user/follow 404 Resource Not Found ', async () => {
        let response = await request(server).post("/user/followsr/").set({ "authorization": "Bearer sadfasdfas" }).send();
        expect(response.statusCode).toBe(404);
    });

    test('POST /user/follow 403 Forbidden User can not follow himself', async () => {
        let response = await request(server).post("/user/follow").set({ "authorization": `Bearer ${personalToken}` }).send({ "username": "personal" });
        expect(response.body.message).toContain("you can not follow yourself");
        expect(response.statusCode).toBe(403);
    });

    test('POST /user/follow 403 Forbidden username is required on empty string', async () => {
        let response = await request(server).post("/user/follow").set({ "authorization": `Bearer ${personalToken}` }).send({ "username": "" });
        expect(response.body.errors[0].msg).toContain("username is required")
        expect(response.statusCode).toBe(400);
    });

    test('POST /user/follow 403 Forbidden username is required on null', async () => {
        let response = await request(server).post("/user/follow").set({ "authorization": `Bearer ${personalToken}` }).send({ "username": null });
        expect(response.body.errors[0].msg).toContain("username is required")
        expect(response.statusCode).toBe(400);
    });

    test('POST /user/follow 403 Forbidden username does not exist', async () => {
        let response = await request(server).post("/user/follow").set({ "authorization": `Bearer ${personalToken}` }).send({ "username": "uvgram99" });
        expect(response.body.message).toContain("username does not exist")
        expect(response.statusCode).toBe(403);
    });

    test('POST /user/follow 200 OK personal is following to admin', async () => {
        let response = await request(server).post("/user/follow").set({ "authorization": `Bearer ${personalToken}` }).send({ "username": "admin" });
        expect(response.body.message).toContain("you are now following to");
        expect(response.statusCode).toBe(200);
    });

    test('POST /user/follow 200 OK personal is following to business', async () => {
        let response = await request(server).post("/user/follow").set({ "authorization": `Bearer ${personalToken}` }).send({ "username": "business" });
        expect(response.body.message).toContain("you are now following to");
        expect(response.statusCode).toBe(200);
    });

    test('POST /user/follow 200 OK personal is following to moderator', async () => {
        let response = await request(server).post("/user/follow").set({ "authorization": `Bearer ${personalToken}` }).send({ "username": "moderator" });
        expect(response.body.message).toContain("you are now following to");
        expect(response.statusCode).toBe(200);
    });

    test('POST /user/follow 200 OK business is following to personal', async () => {
        let response = await request(server).post("/user/follow").set({ "authorization": `Bearer ${businessToken}` }).send({ "username": "personal" });
        expect(response.body.message).toContain("you are now following to");
        expect(response.statusCode).toBe(200);
    });

    test('POST /user/follow 200 OK business is following to moderator', async () => {
        let response = await request(server).post("/user/follow").set({ "authorization": `Bearer ${businessToken}` }).send({ "username": "moderator" });
        expect(response.body.message).toContain("you are now following to");
        expect(response.statusCode).toBe(200);
    });

    test('POST /user/follow 200 OK business is following to admin', async () => {
        let response = await request(server).post("/user/follow").set({ "authorization": `Bearer ${businessToken}` }).send({ "username": "admin" });
        expect(response.body.message).toContain("you are now following to");
        expect(response.statusCode).toBe(200);
    });

    test('POST /user/follow 200 OK moderator is following to personal', async () => {
        let response = await request(server).post("/user/follow").set({ "authorization": `Bearer ${moderatorToken}` }).send({ "username": "personal" });
        expect(response.body.message).toContain("you are now following to");
        expect(response.statusCode).toBe(200);
    });

    test('POST /user/follow 200 OK moderator is following to business', async () => {
        let response = await request(server).post("/user/follow").set({ "authorization": `Bearer ${moderatorToken}` }).send({ "username": "business" });
        expect(response.body.message).toContain("you are now following to");
        expect(response.statusCode).toBe(200);
    });

    test('POST /user/follow 200 OK moderator is following to admin', async () => {
        let response = await request(server).post("/user/follow").set({ "authorization": `Bearer ${moderatorToken}` }).send({ "username": "admin" });
        expect(response.body.message).toContain("you are now following to");
        expect(response.statusCode).toBe(200);
    });

    test('POST /user/follow 200 OK admin is following to moderator', async () => {
        let response = await request(server).post("/user/follow").set({ "authorization": `Bearer ${adminToken}` }).send({ "username": "moderator" });
        expect(response.body.message).toContain("you are now following to");
        expect(response.statusCode).toBe(200);
    });

    test('POST /user/follow 200 OK admin is following to business', async () => {
        let response = await request(server).post("/user/follow").set({ "authorization": `Bearer ${adminToken}` }).send({ "username": "business" });
        expect(response.body.message).toContain("you are now following to");
        expect(response.statusCode).toBe(200);
    });

    test('POST /user/follow 200 OK admin is following to personal', async () => {
        let response = await request(server).post("/user/follow").set({ "authorization": `Bearer ${adminToken}` }).send({ "username": "personal" });
        expect(response.body.message).toContain("you are now following to");
        expect(response.statusCode).toBe(200);
    });

    test('DEL /user/unfollow 404 Resource Not Found ', async () => {
        let response = await request(server).del("/user/unfollowsd/").set({ "authorization": "Bearer sadfasdfas" }).send();
        expect(response.statusCode).toBe(404);
    });

    test('DEL /user/unfollow 403 Forbidden User can not unfollow himself', async () => {
        let response = await request(server).delete("/user/unfollow").set({ "authorization": `Bearer ${personalToken}` }).send({ "username": "personal" });
        expect(response.body.message).toContain("you can not unfollow yourself");
        expect(response.statusCode).toBe(403);
    });

    test('DEL /user/unfollow 403 Forbidden username is empty (username is required)', async () => {
        let response = await request(server).delete("/user/unfollow").set({ "authorization": `Bearer ${personalToken}` }).send({ "username": "" });
        expect(response.body.errors[0].msg).toContain("username is required")
        expect(response.statusCode).toBe(400);
    });

    test('DEL /user/unfollow 403 Forbidden username is null (username is required)', async () => {
        let response = await request(server).delete("/user/unfollow").set({ "authorization": `Bearer ${personalToken}` }).send({ "username": null });
        expect(response.body.errors[0].msg).toContain("username is required")
        expect(response.statusCode).toBe(400);
    });

    test('DEL /user/unfollow 403 Forbidden username is undefined (username is required)', async () => {
        let response = await request(server).delete("/user/unfollow").set({ "authorization": `Bearer ${personalToken}` }).send({ "username": undefined });
        expect(response.body.errors[0].msg).toContain("username is require");
        expect(response.statusCode).toBe(400);
    });

    test('DEL /user/unfollow 403 Forbidden username does not exist', async () => {
        let response = await request(server).delete("/user/unfollow").set({ "authorization": `Bearer ${personalToken}` }).send({ "username": "uvgram99" });
        expect(response.body.message).toContain("username does not exist")
        expect(response.statusCode).toBe(403);
    });

    test('DEL /user/unfollow 200 OK personal unfollowed to admin', async () => {
        let response = await request(server).delete("/user/unfollow").set({ "authorization": `Bearer ${personalToken}` }).send({ "username": "admin" });
        expect(response.body.message).toContain("you have unfollowed to");
        expect(response.statusCode).toBe(200);
    });

    test('DEL /user/unfollow 200 OK personal unfollowed to business', async () => {
        let response = await request(server).delete("/user/unfollow").set({ "authorization": `Bearer ${personalToken}` }).send({ "username": "business" });
        expect(response.body.message).toContain("you have unfollowed to");
        expect(response.statusCode).toBe(200);
    });

    test('DEL /user/unfollow 200 OK personal unfollowed to moderator', async () => {
        let response = await request(server).delete("/user/unfollow").set({ "authorization": `Bearer ${personalToken}` }).send({ "username": "moderator" });
        expect(response.body.message).toContain("you have unfollowed to");
        expect(response.statusCode).toBe(200);
    });

    test('DEL /user/unfollow 200 OK business unfollowed to admin', async () => {
        let response = await request(server).delete("/user/unfollow").set({ "authorization": `Bearer ${businessToken}` }).send({ "username": "admin" });
        expect(response.body.message).toContain("you have unfollowed to");
        expect(response.statusCode).toBe(200);
    });

    test('DEL /user/unfollow 200 OK business unfollowed to moderator', async () => {
        let response = await request(server).delete("/user/unfollow").set({ "authorization": `Bearer ${businessToken}` }).send({ "username": "moderator" });
        expect(response.body.message).toContain("you have unfollowed to");
        expect(response.statusCode).toBe(200);
    });

    test('DEL /user/unfollow 200 OK business unfollowed to personal', async () => {
        let response = await request(server).delete("/user/unfollow").set({ "authorization": `Bearer ${businessToken}` }).send({ "username": "personal" });
        expect(response.body.message).toContain("you have unfollowed to");
        expect(response.statusCode).toBe(200);
    });

    test('DEL /user/unfollow 200 OK moderator unfollowed to personal', async () => {
        let response = await request(server).delete("/user/unfollow").set({ "authorization": `Bearer ${moderatorToken}` }).send({ "username": "personal" });
        expect(response.body.message).toContain("you have unfollowed to");
        expect(response.statusCode).toBe(200);
    });

    test('DEL /user/unfollow 200 OK moderator unfollowed to business', async () => {
        let response = await request(server).delete("/user/unfollow").set({ "authorization": `Bearer ${moderatorToken}` }).send({ "username": "business" });
        expect(response.body.message).toContain("you have unfollowed to");
        expect(response.statusCode).toBe(200);
    });

    test('DEL /user/unfollow 200 OK moderator unfollowed to admin', async () => {
        let response = await request(server).delete("/user/unfollow").set({ "authorization": `Bearer ${moderatorToken}` }).send({ "username": "admin" });
        expect(response.body.message).toContain("you have unfollowed to");
        expect(response.statusCode).toBe(200);
    });

    test('DEL /user/unfollow 200 OK admin unfollowed to moderator', async () => {
        let response = await request(server).delete("/user/unfollow").set({ "authorization": `Bearer ${adminToken}` }).send({ "username": "moderator" });
        expect(response.body.message).toContain("you have unfollowed to");
        expect(response.statusCode).toBe(200);
    });

    test('DEL /user/unfollow 200 OK admin unfollowed to business', async () => {
        let response = await request(server).delete("/user/unfollow").set({ "authorization": `Bearer ${adminToken}` }).send({ "username": "business" });
        expect(response.body.message).toContain("you have unfollowed to");
        expect(response.statusCode).toBe(200);
    });

    test('DEL /user/unfollow 200 OK admin unfollowed to personal', async () => {
        let response = await request(server).delete("/user/unfollow").set({ "authorization": `Bearer ${adminToken}` }).send({ "username": "personal" });
        expect(response.body.message).toContain("you have unfollowed to");
        expect(response.statusCode).toBe(200);
    });

    describe("Follow on personal private user", () => {
        beforeAll(async () => {
            await request(server).post("/accounts/users/change-privacy").set("authorization", `Bearer ${personalToken}`).send({ "privacy": "privado" });
            await request(server).post("/accounts/users/change-privacy").set("authorization", `Bearer ${moderatorToken}`).send({ "privacy": "privado" });
        });

        test('POST /user/follow 200 OK admin send following request to personal', async () => {
            let response = await request(server).post("/user/follow").set({ "authorization": `Bearer ${adminToken}` }).send({ "username": "personal" });
            expect(response.body.message).toContain("follower request sent");
            expect(response.statusCode).toBe(200);
        });

        test('POST /user/follow 200 OK moderator send following request to personal', async () => {
            let response = await request(server).post("/user/follow").set({ "authorization": `Bearer ${moderatorToken}` }).send({ "username": "personal" });
            expect(response.body.message).toContain("follower request sent");
            expect(response.statusCode).toBe(200);
        });

        test('POST /user/follow 200 OK business send following request to personal', async () => {
            let response = await request(server).post("/user/follow").set({ "authorization": `Bearer ${businessToken}` }).send({ "username": "personal" });
            expect(response.body.message).toContain("follower request sent");
            expect(response.statusCode).toBe(200);
        });

        test('POST /user/follow 200 OK personal send following request to moderator', async () => {
            let response = await request(server).post("/user/follow").set({ "authorization": `Bearer ${personalToken}` }).send({ "username": "moderator" });
            expect(response.body.message).toContain("follower request sent");
            expect(response.statusCode).toBe(200);
        });

        test('GET /user/followers-by/personal 200 OK 0 Followers of personal', async () => {
            let response = await request(server).get("/user/followers-of/personal").set({ "authorization": `Bearer ${personalToken}` });
            expect(response.body.message.length).toBe(0);
            expect(response.statusCode).toBe(200);
        });

        test('POST /user/followers/pending 200 OK 3 followers request sent to personal user', async () => {
            let response = await request(server).get("/user/followers/pending").set({ "authorization": `Bearer ${personalToken}` });
            expect(response.body.message.length).toBe(3);
            expect(response.statusCode).toBe(200);
        });

        test('POST /user/followers/pending 200 OK 1 follower request sent to moderator user', async () => {
            let response = await request(server).get("/user/followers/pending").set({ "authorization": `Bearer ${moderatorToken}` });
            expect(response.body.message.length).toBe(1);
            expect(response.statusCode).toBe(200);
        });

        test('DEL /user/followers/deny 200 OK personal deny admin request', async () => {
            let response = await request(server).del("/user/followers/deny").set({ "authorization": `Bearer ${personalToken}` }).send({ "username": "admin" });
            expect(response.body.message).toBe(true);
            expect(response.statusCode).toBe(200);
        });

        test('DEL /user/followers/deny 200 OK personal deny moderator request', async () => {
            let response = await request(server).del("/user/followers/deny").set({ "authorization": `Bearer ${personalToken}` }).send({ "username": "moderator" });
            expect(response.body.message).toBe(true);
            expect(response.statusCode).toBe(200);
        });

        test('DEL /user/followers/deny 200 OK personal deny business request', async () => {
            let response = await request(server).del("/user/followers/deny").set({ "authorization": `Bearer ${personalToken}` }).send({ "username": "business" });
            expect(response.body.message).toBe(true);
            expect(response.statusCode).toBe(200);
        });

        test('DEL /user/followers/deny 403 OK personal deny invalid request', async () => {
            let response = await request(server).del("/user/followers/deny").set({ "authorization": `Bearer ${personalToken}` }).send({ "username": "helloworld" });
            expect(response.body.message).toContain("username does not exist");
            expect(response.statusCode).toBe(403);
        });

        test('DEL /user/followers/deny 403 OK personal deny invalid request', async () => {
            let response = await request(server).del("/user/followers/deny").set({ "authorization": `Bearer ${personalToken}` }).send({ "username": "personal" });
            expect(response.body.message).toContain("you can not accept or deny follower request from yourself");
            expect(response.statusCode).toBe(403);
        });

        test('DEL /user/followers/deny 403 Forbidden personal deny no existing request', async () => {
            let response = await request(server).del("/user/followers/deny").set({ "authorization": `Bearer ${personalToken}` }).send({ "username": "admin" });
            expect(response.body.message).toContain("there is no follower request from");
            expect(response.statusCode).toBe(403);
        });

        test('POST /user/followers/pending 200 OK 0 followers request sent to personal user', async () => {
            let response = await request(server).get("/user/followers/pending").set({ "authorization": `Bearer ${personalToken}` });
            expect(response.body.message.length).toBe(0);
            expect(response.statusCode).toBe(200);
        });

        test('POST /user/followers/accept 200 OK personal accept admin request', async () => {
            let response = await request(server).post("/user/follow").set({ "authorization": `Bearer ${adminToken}` }).send({ "username": "personal" });
            response = await request(server).post("/user/followers/accept").set({ "authorization": `Bearer ${personalToken}` }).send({ "username": "admin" });
            expect(response.body.message).toBe(true);
            expect(response.statusCode).toBe(200);
        });

        test('POST /user/followers/accept 200 OK personal accept moderator request', async () => {
            let response = await request(server).post("/user/follow").set({ "authorization": `Bearer ${moderatorToken}` }).send({ "username": "personal" });
            response = await request(server).post("/user/followers/accept").set({ "authorization": `Bearer ${personalToken}` }).send({ "username": "moderator" });
            expect(response.body.message).toBe(true);
            expect(response.statusCode).toBe(200);
        });

        test('POST /user/followers/accept 200 OK personal accept business request', async () => {
            let response = await request(server).post("/user/follow").set({ "authorization": `Bearer ${businessToken}` }).send({ "username": "personal" });
            response = await request(server).post("/user/followers/accept").set({ "authorization": `Bearer ${personalToken}` }).send({ "username": "business" });
            expect(response.body.message).toBe(true);
            expect(response.statusCode).toBe(200);
        });

        test('GET /user/followers-of/personal 200 OK personal has 3 followers on accepted request', async () => {
            let response = await request(server).get("/user/followers-of/personal").set({ "authorization": `Bearer ${personalToken}` });
            expect(response.body.message.length).toBe(3);
            expect(response.statusCode).toBe(200);
        });

        test('GET /user/followed-by/personal 200 OK personal is following to 0 users', async () => {
            let response = await request(server).get("/user/followed-by/personal").set({ "authorization": `Bearer ${personalToken}` });
            expect(response.body.message.length).toBe(0);
            expect(response.statusCode).toBe(200);
        });

        test('GET /user/followers-of/business 200 OK personal has 0 followers on accepted request', async () => {
            let response = await request(server).get("/user/followers-of/business").set({ "authorization": `Bearer ${businessToken}` });
            expect(response.body.message.length).toBe(0);
            expect(response.statusCode).toBe(200);
        });

        test('GET /user/followers-of/business 200 OK personal block user and get 0 followers request', async () => {
            let response = await request(server).post("/user/follow").set({ "authorization": `Bearer ${moderatorToken}` }).send({ "username": "personal" });
            response = await request(server).post("/user/block/").set({ "authorization": `Bearer ${personalToken}` }).send({ "username": "moderator" });
            response = await request(server).get("/user/followers/pending").set({ "authorization": `Bearer ${personalToken}` });
            expect(response.body.message.length).toBe(0);
            expect(response.statusCode).toBe(200);
        });

    });
});

describe('GET /user/followed-by/:username', () => {
    test('GET /user/followed-by/test/ 404 Resource Not Found ', async () => {
        let response = await request(server).get("/user/followed-bys/test/").set({ "authorization": "Bearer sadfasdfas" }).send();
        expect(response.statusCode).toBe(404);
    });

    describe('GET /user/followed-by/:username After 5 new users', () => {
        let accessTokenUser1;
        let accessTokenUser2;
        let accessTokenUser3;
        let accessTokenUser4;
        let accessTokenUser5;

        afterAll(async () => {
            await clearDatabase();

        });

        beforeAll(async () => {
            await clearDatabase();


            let response = await request(server).post("/accounts/create/verification").send({ "username": "uvgram1", "email": "uvgram1@uvgram.com" });
            let verificationCode = await getVerificationCodeFromEmail("uvgram1@uvgram.com");
            const newUser = {
                name: "uvgram",
                presentation: "Welcome to UVGram.",
                username: "uvgram1",
                password: "hola1234",
                phoneNumber: "2212345678",
                email: "uvgram1@uvgram.com",
                birthdate: "2000-01-01",
                verificationCode
            }
            response = await request(server).post("/accounts/create").send(newUser);
            response = await request(server).post("/authentication/login").send({ "emailOrUsername": "uvgram1", "password": "hola1234" });
            accessTokenUser1 = response.body.message.accessToken;

            response = await request(server).post("/accounts/create/verification").send({ "username": "uvgram2", "email": "uvgram2@uvgram.com" });
            let vCode = await getVerificationCodeFromEmail("uvgram2@uvgram.com");
            const newUser2 = {
                name: "uvgram second user",
                presentation: "Welcome to UVGram.",
                username: "uvgram2",
                password: "hola1234",
                phoneNumber: "2212345678",
                email: "uvgram2@uvgram.com",
                birthdate: "2000-01-01",
                verificationCode: vCode
            }
            response = await request(server).post("/accounts/create").send(newUser2);
            response = await request(server).post("/authentication/login").send({ "emailOrUsername": "uvgram2", "password": "hola1234" });
            accessTokenUser2 = response.body.message.accessToken;

            response = await request(server).post("/accounts/create/verification").send({ "username": "uvgram3", "email": "uvgram3@uvgram.com" });
            let vCode2 = await getVerificationCodeFromEmail("uvgram3@uvgram.com");
            const newUser3 = {
                name: "uvgram third user",
                presentation: "Welcome to UVGram.",
                username: "uvgram3",
                password: "hola1234",
                phoneNumber: "2212345678",
                email: "uvgram3@uvgram.com",
                birthdate: "2000-01-01",
                verificationCode: vCode2
            }
            response = await request(server).post("/accounts/create").send(newUser3);
            response = await request(server).post("/authentication/login").send({ "emailOrUsername": "uvgram3", "password": "hola1234" });
            accessTokenUser3 = response.body.message.accessToken;

            response = await request(server).post("/accounts/create/verification").send({ "username": "uvgram4", "email": "uvgram4@uvgram.com" });
            let vCode3 = await getVerificationCodeFromEmail("uvgram4@uvgram.com");
            const newUser4 = {
                name: "uvgram fourth user",
                presentation: "Welcome to UVGram.",
                username: "uvgram4",
                password: "hola1234",
                phoneNumber: "2212345678",
                email: "uvgram4@uvgram.com",
                birthdate: "2000-01-01",
                verificationCode: vCode3
            }
            response = await request(server).post("/accounts/create").send(newUser4);
            response = await request(server).post("/authentication/login").send({ "emailOrUsername": "uvgram4", "password": "hola1234" });
            accessTokenUser4 = response.body.message.accessToken;

            response = await request(server).post("/accounts/create/verification").send({ "username": "uvgram5", "email": "uvgram5@uvgram.com" });
            let vCode4 = await getVerificationCodeFromEmail("uvgram5@uvgram.com");
            const newUser5 = {
                name: "uvgram fiveth user",
                presentation: "Welcome to UVGram.",
                username: "uvgram5",
                password: "hola1234",
                phoneNumber: "2212345678",
                email: "uvgram5@uvgram.com",
                birthdate: "2000-01-01",
                verificationCode: vCode4
            }
            response = await request(server).post("/accounts/create").send(newUser5);
            response = await request(server).post("/authentication/login").send({ "emailOrUsername": "uvgram5", "password": "hola1234" });
            accessTokenUser5 = response.body.message.accessToken;

            response = await request(server).post("/user/follow").set({ "authorization": `Bearer ${accessTokenUser1}` }).send({ "username": "uvgram2" });
            response = await request(server).post("/user/follow").set({ "authorization": `Bearer ${accessTokenUser1}` }).send({ "username": "uvgram3" });
            response = await request(server).post("/user/follow").set({ "authorization": `Bearer ${accessTokenUser1}` }).send({ "username": "uvgram3" });
            response = await request(server).post("/user/follow").set({ "authorization": `Bearer ${accessTokenUser1}` }).send({ "username": "uvgram4" });
            response = await request(server).post("/user/follow").set({ "authorization": `Bearer ${accessTokenUser1}` }).send({ "username": "uvgram5" });
            response = await request(server).post("/user/follow").set({ "authorization": `Bearer ${accessTokenUser2}` }).send({ "username": "uvgram5" });
            response = await request(server).post("/user/follow").set({ "authorization": `Bearer ${accessTokenUser3}` }).send({ "username": "uvgram5" });
            response = await request(server).post("/user/follow").set({ "authorization": `Bearer ${accessTokenUser4}` }).send({ "username": "uvgram5" });
            response = await request(server).post("/user/follow").set({ "authorization": `Bearer ${accessTokenUser5}` }).send({ "username": "uvgram1" });
        });

        test('GET /user/followed-by/:username 200 OK uvgram1 is following 4 users', async () => {
            let response = await request(server).get("/user/followed-by/uvgram1").set({ "authorization": `Bearer ${accessTokenUser5}` }).send();
            const EXPECTED_USERS_FOLLOWED = 4;
            expect(response.body.message.length).toBe(EXPECTED_USERS_FOLLOWED);
            expect(response.statusCode).toBe(200);
        });

        test('GET /user/followed-by/:username 200 OK uvgram2 is following 1 user', async () => {
            let response = await request(server).get("/user/followed-by/uvgram2").set({ "authorization": `Bearer ${accessTokenUser2}` }).send();
            const EXPECTED_USERS_FOLLOWED = 1;
            expect(response.body.message.length).toBe(EXPECTED_USERS_FOLLOWED);
            expect(response.statusCode).toBe(200);
        });

        test('GET /user/followed-by/:username 200 OK uvgram3 is following 1 user', async () => {
            let response = await request(server).get("/user/followed-by/uvgram3").set({ "authorization": `Bearer ${accessTokenUser3}` }).send();
            const EXPECTED_USERS_FOLLOWED = 1;
            expect(response.body.message.length).toBe(EXPECTED_USERS_FOLLOWED);
            expect(response.statusCode).toBe(200);
        });

        test('GET /user/followed-by/:username 200 OK uvgram4 is following 1 user', async () => {
            let response = await request(server).get("/user/followed-by/uvgram4").set({ "authorization": `Bearer ${accessTokenUser3}` }).send();
            const EXPECTED_USERS_FOLLOWED = 1;
            expect(response.body.message.length).toBe(EXPECTED_USERS_FOLLOWED);
            expect(response.statusCode).toBe(200);
        });

        test('GET /user/followed-by/:username 200 OK uvgram5 is following 1 user', async () => {
            let response = await request(server).get("/user/followed-by/uvgram5").set({ "authorization": `Bearer ${accessTokenUser3}` }).send();
            const EXPECTED_USERS_FOLLOWED = 1;
            expect(response.body.message.length).toBe(EXPECTED_USERS_FOLLOWED);
            expect(response.statusCode).toBe(200);
        });

        test('GET /user/followed-by/:username 403 Forbidden uvgram6 does not exist', async () => {
            let response = await request(server).get("/user/followed-by/uvgram6").set({ "authorization": `Bearer ${accessTokenUser3}` }).send();
            expect(response.body.message).toContain("username does not exist");
            expect(response.statusCode).toBe(403);
        });

        test('GET /user/followed-by/:username 400 Bad Request bearer token is required', async () => {
            let response = await request(server).get("/user/followed-by/uvgram6").send();
            expect(response.body.errors[0].msg).toContain("authorization header is required");
            expect(response.statusCode).toBe(400);
        });

        test('GET /user/followed-by/:username 401 Unauthorized uvgram6 token does not exist', async () => {
            let response = await request(server).get("/user/followed-by/uvgram6").set({ "authorization": `Bearer ${accessTokenUser3}s` }).send();
            expect(response.body.message).toContain("You don't have permissions to perform this action!");
            expect(response.statusCode).toBe(401);
        });
    });
});

describe('GET /user/followers-of/:username', () => {
    test('GET /user/followers-ofs/:username 404 Resource Not Found ', async () => {
        let response = await request(server).get("/user/followed-bys/test/").set({ "authorization": "Bearer sadfasdfas" }).send();
        expect(response.statusCode).toBe(404);
    });

    describe('GET /user/followers-of/:username After 5 new users', () => {
        let accessTokenUser1;
        let accessTokenUser2;
        let accessTokenUser3;
        let accessTokenUser4;
        let accessTokenUser5;

        afterAll(async () => {
            await clearDatabase();

        });

        beforeAll(async () => {
            await clearDatabase();


            let response = await request(server).post("/accounts/create/verification").send({ "username": "uvgram1", "email": "uvgram1@uvgram.com" });
            let verificationCode = await getVerificationCodeFromEmail("uvgram1@uvgram.com");
            const newUser = {
                name: "uvgram",
                presentation: "Welcome to UVGram.",
                username: "uvgram1",
                password: "hola1234",
                phoneNumber: "2212345678",
                email: "uvgram1@uvgram.com",
                birthdate: "2000-01-01",
                verificationCode
            }
            response = await request(server).post("/accounts/create").send(newUser);
            response = await request(server).post("/authentication/login").send({ "emailOrUsername": "uvgram1", "password": "hola1234" });
            accessTokenUser1 = response.body.message.accessToken;

            response = await request(server).post("/accounts/create/verification").send({ "username": "uvgram2", "email": "uvgram2@uvgram.com" });
            let vCode = await getVerificationCodeFromEmail("uvgram2@uvgram.com");
            const newUser2 = {
                name: "uvgram second user",
                presentation: "Welcome to UVGram.",
                username: "uvgram2",
                password: "hola1234",
                phoneNumber: "2212345678",
                email: "uvgram2@uvgram.com",
                birthdate: "2000-01-01",
                verificationCode: vCode
            }
            response = await request(server).post("/accounts/create").send(newUser2);
            response = await request(server).post("/authentication/login").send({ "emailOrUsername": "uvgram2", "password": "hola1234" });
            accessTokenUser2 = response.body.message.accessToken;

            response = await request(server).post("/accounts/create/verification").send({ "username": "uvgram3", "email": "uvgram3@uvgram.com" });
            let vCode2 = await getVerificationCodeFromEmail("uvgram3@uvgram.com");
            const newUser3 = {
                name: "uvgram third user",
                presentation: "Welcome to UVGram.",
                username: "uvgram3",
                password: "hola1234",
                phoneNumber: "2212345678",
                email: "uvgram3@uvgram.com",
                birthdate: "2000-01-01",
                verificationCode: vCode2
            }
            response = await request(server).post("/accounts/create").send(newUser3);
            response = await request(server).post("/authentication/login").send({ "emailOrUsername": "uvgram3", "password": "hola1234" });
            accessTokenUser3 = response.body.message.accessToken;

            response = await request(server).post("/accounts/create/verification").send({ "username": "uvgram4", "email": "uvgram4@uvgram.com" });
            let vCode3 = await getVerificationCodeFromEmail("uvgram4@uvgram.com");
            const newUser4 = {
                name: "uvgram fourth user",
                presentation: "Welcome to UVGram.",
                username: "uvgram4",
                password: "hola1234",
                phoneNumber: "2212345678",
                email: "uvgram4@uvgram.com",
                birthdate: "2000-01-01",
                verificationCode: vCode3
            }
            response = await request(server).post("/accounts/create").send(newUser4);
            response = await request(server).post("/authentication/login").send({ "emailOrUsername": "uvgram4", "password": "hola1234" });
            accessTokenUser4 = response.body.message.accessToken;

            response = await request(server).post("/accounts/create/verification").send({ "username": "uvgram5", "email": "uvgram5@uvgram.com" });
            let vCode4 = await getVerificationCodeFromEmail("uvgram5@uvgram.com");
            const newUser5 = {
                name: "uvgram fiveth user",
                presentation: "Welcome to UVGram.",
                username: "uvgram5",
                password: "hola1234",
                phoneNumber: "2212345678",
                email: "uvgram5@uvgram.com",
                birthdate: "2000-01-01",
                verificationCode: vCode4
            }
            response = await request(server).post("/accounts/create").send(newUser5);
            response = await request(server).post("/authentication/login").send({ "emailOrUsername": "uvgram5", "password": "hola1234" });
            accessTokenUser5 = response.body.message.accessToken;

            response = await request(server).post("/user/follow").set({ "authorization": `Bearer ${accessTokenUser1}` }).send({ "username": "uvgram1" });
            response = await request(server).post("/user/follow").set({ "authorization": `Bearer ${accessTokenUser1}` }).send({ "username": "uvgram3" });
            response = await request(server).post("/user/follow").set({ "authorization": `Bearer ${accessTokenUser1}` }).send({ "username": "uvgram5" });
            response = await request(server).post("/user/follow").set({ "authorization": `Bearer ${accessTokenUser3}` }).send({ "username": "uvgram1" });
            response = await request(server).post("/user/follow").set({ "authorization": `Bearer ${accessTokenUser3}` }).send({ "username": "uvgram2" });
            response = await request(server).post("/user/follow").set({ "authorization": `Bearer ${accessTokenUser3}` }).send({ "username": "uvgram4" });
            response = await request(server).post("/user/follow").set({ "authorization": `Bearer ${accessTokenUser3}` }).send({ "username": "uvgram5" });
            response = await request(server).post("/user/follow").set({ "authorization": `Bearer ${accessTokenUser4}` }).send({ "username": "uvgram2" });
        });

        test('GET /user/followers-of/:username 200 OK uvgram1 is followed by 3 users', async () => {
            let response = await request(server).get("/user/followers-of/uvgram1").set({ "authorization": `Bearer ${accessTokenUser5}` }).send();
            const EXPECTED_USERS_FOLLOWED = 1;
            expect(response.body.message.length).toBe(EXPECTED_USERS_FOLLOWED);
            expect(response.statusCode).toBe(200);
        });

        test('GET /user/followers-of/:username 200 OK uvgram2 is followed by 0 user', async () => {
            let response = await request(server).get("/user/followers-of/uvgram2").set({ "authorization": `Bearer ${accessTokenUser2}` }).send();
            const EXPECTED_USERS_FOLLOWED = 2;
            expect(response.body.message.length).toBe(EXPECTED_USERS_FOLLOWED);
            expect(response.statusCode).toBe(200);
        });

        test('GET /user/followers-of/:username 200 OK uvgram3 is followed by 4 user', async () => {
            let response = await request(server).get("/user/followers-of/uvgram3").set({ "authorization": `Bearer ${accessTokenUser3}` }).send();
            const EXPECTED_USERS_FOLLOWED = 1;
            expect(response.body.message.length).toBe(EXPECTED_USERS_FOLLOWED);
            expect(response.statusCode).toBe(200);
        });

        test('GET /user/followers-of/:username 200 OK uvgram4 is followed by 1 user', async () => {
            let response = await request(server).get("/user/followers-of/uvgram4").set({ "authorization": `Bearer ${accessTokenUser3}` }).send();
            const EXPECTED_USERS_FOLLOWED = 1;
            expect(response.body.message.length).toBe(EXPECTED_USERS_FOLLOWED);
            expect(response.statusCode).toBe(200);
        });

        test('GET /user/followers-of/:username 200 OK uvgram5 is followed by 0 user', async () => {
            let response = await request(server).get("/user/followers-of/uvgram5").set({ "authorization": `Bearer ${accessTokenUser3}` }).send();
            const EXPECTED_USERS_FOLLOWED = 2;
            expect(response.body.message.length).toBe(EXPECTED_USERS_FOLLOWED);
            expect(response.statusCode).toBe(200);
        });

        test('GET /user/followers-of/:username 403 Forbidden uvgram6 does not exist', async () => {
            let response = await request(server).get("/user/followers-of/uvgram6").set({ "authorization": `Bearer ${accessTokenUser3}` }).send();
            expect(response.body.message).toContain("username does not exist");
            expect(response.statusCode).toBe(403);
        });

        test('GET /user/followers-of/:username 400 Bad Request bearer token is required', async () => {
            let response = await request(server).get("/user/followers-of/uvgram6").send();
            expect(response.body.errors[0].msg).toContain("authorization header is required");
            expect(response.statusCode).toBe(400);
        });

        test('GET /user/followers-of/:username 401 Unauthorized uvgram6 token does not exist', async () => {
            let response = await request(server).get("/user/followers-of/uvgram6").set({ "authorization": `Bearer ${accessTokenUser3}s` }).send();
            expect(response.body.message).toContain("You don't have permissions to perform this action!");
            expect(response.statusCode).toBe(401);
        });
    });
});


describe('POST /user/block/', () => {
    test('POST /user/block/ 404 Resource Not Found ', async () => {
        let response = await request(server).post("/user/blocsk/").set({ "authorization": "Bearer sadfasdfas" }).send();
        expect(response.statusCode).toBe(404);
    });

    describe('POST /user/block/ After 2 new users', () => {
        let accessToken;

        afterAll(async () => {
            await clearDatabase();

        });

        beforeAll(async () => {
            await clearDatabase();
            let response = await request(server).post("/accounts/create/verification").send({ "username": "uvgram", "email": "admin@uvgram.com" });
            let verificationCode = await getVerificationCodeFromEmail("admin@uvgram.com");
            const newUser = {
                name: "uvgram",
                presentation: "Welcome to UVGram.",
                username: "uvgram",
                password: "hola1234",
                phoneNumber: "2212345678",
                email: "admin@uvgram.com",
                birthdate: "2000-01-01",
                verificationCode
            }
            response = await request(server).post("/accounts/create").send(newUser);
            response = await request(server).post("/accounts/create/verification").send({ "username": "uvgram2", "email": "uvgram2@uvgram.com" });
            let vCode = await getVerificationCodeFromEmail("uvgram2@uvgram.com");
            const newUser2 = {
                name: "uvgram second user",
                presentation: "Welcome to UVGram.",
                username: "uvgram2",
                password: "hola1234",
                phoneNumber: "2212345678",
                email: "uvgram2@uvgram.com",
                birthdate: "2000-01-01",
                verificationCode: vCode
            }
            response = await request(server).post("/accounts/create").send(newUser2);
            response = await request(server).post("/authentication/login").send({ "emailOrUsername": "uvgram", "password": "hola1234" });
            accessToken = response.body.message.accessToken;
        });

        test('POST /user/block/ 403 Forbidden User can not block himself', async () => {
            let response = await request(server).post("/user/block").set({ "authorization": `Bearer ${accessToken}` }).send({ "username": "uvgram" });
            expect(response.body.message).toContain("you can not block yourself");
            expect(response.statusCode).toBe(403);
        });

        test('POST /user/block/ 403 Forbidden username is required', async () => {
            let response = await request(server).post("/user/block/").set({ "authorization": `Bearer ${accessToken}` }).send({ "username": "" });
            expect(response.body.errors[0].msg).toContain("username is required")
            expect(response.statusCode).toBe(400);
        });

        test('POST /user/block/ 403 Forbidden username is required', async () => {
            let response = await request(server).post("/user/block/").set({ "authorization": `Bearer ${accessToken}` }).send({ "username": null });
            expect(response.body.errors[0].msg).toContain("username is required")
            expect(response.statusCode).toBe(400);
        });

        test('POST /user/block/ 403 Forbidden username does not exist', async () => {
            let response = await request(server).post("/user/block/").set({ "authorization": `Bearer ${accessToken}` }).send({ "username": "uvgram99" });
            expect(response.body.message).toContain("username does not exist")
            expect(response.statusCode).toBe(403);
        });

        test('POST /user/block/ 200 OK username is now blocked', async () => {
            let response = await request(server).post("/user/block/").set({ "authorization": `Bearer ${accessToken}` }).send({ "username": "uvgram2" });
            expect(response.body.message).toContain("you have blocked to");
            expect(response.statusCode).toBe(200);
        });


        test('POST /user/unblock/ 403 Forbidden User can not block himself', async () => {
            let response = await request(server).delete("/user/unblock/").set({ "authorization": `Bearer ${accessToken}` }).send({ "username": "uvgram" });
            expect(response.body.message).toContain("you can not unblock yourself");
            expect(response.statusCode).toBe(403);
        });

        test('POST /user/unblock/ 403 Forbidden username is required', async () => {
            let response = await request(server).delete("/user/unblock/").set({ "authorization": `Bearer ${accessToken}` }).send({ "username": "" });
            expect(response.body.errors[0].msg).toContain("username is required")
            expect(response.statusCode).toBe(400);
        });

        test('POST /user/unblock/ 403 Forbidden username is required', async () => {
            let response = await request(server).delete("/user/unblock/").set({ "authorization": `Bearer ${accessToken}` }).send({ "username": null });
            expect(response.body.errors[0].msg).toContain("username is required")
            expect(response.statusCode).toBe(400);
        });

        test('POST /user/unblock/ 403 Forbidden username does not exist', async () => {
            let response = await request(server).delete("/user/unblock/").set({ "authorization": `Bearer ${accessToken}` }).send({ "username": "uvgram99" });
            expect(response.body.message).toContain("username does not exist")
            expect(response.statusCode).toBe(403);
        });

        test('POST /user/unblock/ 403 OK username is now blocked', async () => {
            let response = await request(server).delete("/user/unblock/").set({ "authorization": `Bearer ${accessToken}` }).send({ "username": "uvgram2" });
            expect(response.body.message).toContain("you have blocked the user");
            expect(response.statusCode).toBe(403);
        });
    });
});
