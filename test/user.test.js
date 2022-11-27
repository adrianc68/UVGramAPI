const request = require('supertest');
const { connetionToServers } = require('../src/app');
const { getVerificationCodeFromEmail } = require('../src/dataaccess/mailDataAccess');
const { sequelize } = require("../src/database/connectionDatabaseSequelize");
const { redisClient } = require("../src/database/connectionRedis");
const { logger } = require('../src/helpers/logger');
const { server, delayServerConnections, clearDatabase } = require("../src/server");

beforeAll(async () => {
    await delayServerConnections();
    await clearDatabase();
});

afterAll(async () => {
    server.close();
    await clearDatabase();
});

describe('POST /user/follow/', () => {
    test('POST /user/follow 404 Resource Not Found ', async () => {
        response = await request(server).post("/user/followsr/").set({ "authorization": "Bearer sadfasdfas" }).send();
        expect(response.statusCode).toBe(404);
    });

    describe('POST /user/follow After 2 new users', () => {
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

        test('POST /user/follow 403 Forbidden User can not follow himself', async () => {
            response = await request(server).post("/user/follow").set({ "authorization": `Bearer ${accessToken}` }).send({ "username": "uvgram" });
            expect(response.body.message).toContain("you can not follow yourself");
            expect(response.statusCode).toBe(403);
        });

        test('POST /user/follow 403 Forbidden username is required', async () => {
            response = await request(server).post("/user/follow").set({ "authorization": `Bearer ${accessToken}` }).send({ "username": "" });
            expect(response.body.errors[0].msg).toContain("username is required")
            expect(response.statusCode).toBe(400);
        });

        test('POST /user/follow 403 Forbidden username is required', async () => {
            response = await request(server).post("/user/follow").set({ "authorization": `Bearer ${accessToken}` }).send({ "username": null });
            expect(response.body.errors[0].msg).toContain("username is required")
            expect(response.statusCode).toBe(400);
        });

        test('POST /user/follow 403 Forbidden username does not exist', async () => {
            response = await request(server).post("/user/follow").set({ "authorization": `Bearer ${accessToken}` }).send({ "username": "uvgram99" });
            expect(response.body.message).toContain("username does not exist")
            expect(response.statusCode).toBe(403);
        });

        test('POST /user/follow 200 OK username is following other user', async () => {
            response = await request(server).post("/user/follow").set({ "authorization": `Bearer ${accessToken}` }).send({ "username": "uvgram2" });
            expect(response.body.message).toContain("user is now following to");
            expect(response.statusCode).toBe(200);
        });
    });
});

describe('DEL /user/unfollow/', () => {
    test('DEL /user/unfollow 404 Resource Not Found ', async () => {
        response = await request(server).post("/user/unfollowsd/").set({ "authorization": "Bearer sadfasdfas" }).send();
        expect(response.statusCode).toBe(404);
    });

    describe('DEL /user/unfollow After 2 new users', () => {
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

        test('DEL /user/unfollow 403 Forbidden User can not unfollow himself', async () => {
            response = await request(server).delete("/user/unfollow").set({ "authorization": `Bearer ${accessToken}` }).send({ "username": "uvgram" });
            expect(response.body.message).toContain("you can not unfollow yourself");
            expect(response.statusCode).toBe(403);
        });

        test('DEL /user/unfollow 403 Forbidden username is empty (username is required)', async () => {
            response = await request(server).delete("/user/unfollow").set({ "authorization": `Bearer ${accessToken}` }).send({ "username": "" });
            expect(response.body.errors[0].msg).toContain("username is required")
            expect(response.statusCode).toBe(400);
        });

        test('DEL /user/unfollow 403 Forbidden username is null (username is required)', async () => {
            response = await request(server).delete("/user/unfollow").set({ "authorization": `Bearer ${accessToken}` }).send({ "username": null });
            expect(response.body.errors[0].msg).toContain("username is required")
            expect(response.statusCode).toBe(400);
        });

        test('DEL /user/unfollow 403 Forbidden username is undefined (username is required)', async () => {
            response = await request(server).delete("/user/unfollow").set({ "authorization": `Bearer ${accessToken}` }).send({ "username": undefined });
            expect(response.body.errors[0].msg).toContain("username is require");
            expect(response.statusCode).toBe(400);
        });

        test('DEL /user/unfollow 403 Forbidden username does not exist', async () => {
            response = await request(server).delete("/user/unfollow").set({ "authorization": `Bearer ${accessToken}` }).send({ "username": "uvgram99" });
            expect(response.body.message).toContain("username does not exist")
            expect(response.statusCode).toBe(403);
        });

        test('DEL /user/unfollow 400 Bad Request Bearer Token invalid', async () => {
            response = await request(server).delete("/user/unfollow").set({ "authorization": `${accessToken}` }).send({ "username": "uvgram99" });
            expect(response.body.errors[0].msg).toContain("Bearer token is not valid");
            expect(response.statusCode).toBe(400);
        });

        test('DEL /user/unfollow 403 Bad Token invalid', async () => {
            response = await request(server).delete("/user/unfollow").set({ "authorization": `Bearer ${accessToken}s` }).send({ "username": "uvgram99" });
            expect(response.body.message.error).toContain("JsonWebTokenError: invalid signature");
            expect(response.statusCode).toBe(403);
        });

        test('DEL /user/unfollow 200 OK username is following other user', async () => {
            response = await request(server).post("/user/follow").set({ "authorization": `Bearer ${accessToken}` }).send({ "username": "uvgram2" });
            response = await request(server).delete("/user/unfollow").set({ "authorization": `Bearer ${accessToken}` }).send({ "username": "uvgram2" });
            expect(response.body.message).toContain("user has unfollow to");
            expect(response.statusCode).toBe(200);
        });
    });
});

describe('GET /user/followed-by/:username', () => {
    test('GET /user/followed-by/test/ 404 Resource Not Found ', async () => {
        response = await request(server).get("/user/followed-bys/test/").set({ "authorization": "Bearer sadfasdfas" }).send();
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
            response = await request(server).get("/user/followed-by/uvgram1").set({ "authorization": `Bearer ${accessTokenUser5}` }).send();
            const EXPECTED_USERS_FOLLOWED = 4;
            expect(response.body.message.length).toBe(EXPECTED_USERS_FOLLOWED);
            expect(response.statusCode).toBe(200);
        });

        test('GET /user/followed-by/:username 200 OK uvgram2 is following 1 user', async () => {
            response = await request(server).get("/user/followed-by/uvgram2").set({ "authorization": `Bearer ${accessTokenUser2}` }).send();
            const EXPECTED_USERS_FOLLOWED = 1;
            expect(response.body.message.length).toBe(EXPECTED_USERS_FOLLOWED);
            expect(response.statusCode).toBe(200);
        });

        test('GET /user/followed-by/:username 200 OK uvgram3 is following 1 user', async () => {
            response = await request(server).get("/user/followed-by/uvgram3").set({ "authorization": `Bearer ${accessTokenUser3}` }).send();
            const EXPECTED_USERS_FOLLOWED = 1;
            expect(response.body.message.length).toBe(EXPECTED_USERS_FOLLOWED);
            expect(response.statusCode).toBe(200);
        });

        test('GET /user/followed-by/:username 200 OK uvgram4 is following 1 user', async () => {
            response = await request(server).get("/user/followed-by/uvgram4").set({ "authorization": `Bearer ${accessTokenUser3}` }).send();
            const EXPECTED_USERS_FOLLOWED = 1;
            expect(response.body.message.length).toBe(EXPECTED_USERS_FOLLOWED);
            expect(response.statusCode).toBe(200);
        });

        test('GET /user/followed-by/:username 200 OK uvgram5 is following 1 user', async () => {
            response = await request(server).get("/user/followed-by/uvgram5").set({ "authorization": `Bearer ${accessTokenUser3}` }).send();
            const EXPECTED_USERS_FOLLOWED = 1;
            expect(response.body.message.length).toBe(EXPECTED_USERS_FOLLOWED);
            expect(response.statusCode).toBe(200);
        });

        test('GET /user/followed-by/:username 403 Forbidden uvgram6 does not exist', async () => {
            response = await request(server).get("/user/followed-by/uvgram6").set({ "authorization": `Bearer ${accessTokenUser3}` }).send();
            expect(response.body.message).toContain("username does not exist");
            expect(response.statusCode).toBe(403);
        });

        test('GET /user/followed-by/:username 400 Bad Request bearer token is required', async () => {
            response = await request(server).get("/user/followed-by/uvgram6").send();
            expect(response.body.errors[0].msg).toContain("authorization header is required");
            expect(response.statusCode).toBe(400);
        });

        test('GET /user/followed-by/:username 403 Forbidden uvgram6 token does not exist', async () => {
            response = await request(server).get("/user/followed-by/uvgram6").set({ "authorization": `Bearer ${accessTokenUser3}s` }).send();
            expect(response.body.message.error).toContain("JsonWebTokenError: invalid signature");
            expect(response.statusCode).toBe(403);
        });
    });
});

describe('GET /user/followers-of/:username', () => {
    test('GET /user/followers-ofs/:username 404 Resource Not Found ', async () => {
        response = await request(server).get("/user/followed-bys/test/").set({ "authorization": "Bearer sadfasdfas" }).send();
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
            response = await request(server).get("/user/followers-of/uvgram1").set({ "authorization": `Bearer ${accessTokenUser5}` }).send();
            const EXPECTED_USERS_FOLLOWED = 1;
            expect(response.body.message.length).toBe(EXPECTED_USERS_FOLLOWED);
            expect(response.statusCode).toBe(200);
        });

        test('GET /user/followers-of/:username 200 OK uvgram2 is followed by 0 user', async () => {
            response = await request(server).get("/user/followers-of/uvgram2").set({ "authorization": `Bearer ${accessTokenUser2}` }).send();
            const EXPECTED_USERS_FOLLOWED = 2;
            expect(response.body.message.length).toBe(EXPECTED_USERS_FOLLOWED);
            expect(response.statusCode).toBe(200);
        });

        test('GET /user/followers-of/:username 200 OK uvgram3 is followed by 4 user', async () => {
            response = await request(server).get("/user/followers-of/uvgram3").set({ "authorization": `Bearer ${accessTokenUser3}` }).send();
            const EXPECTED_USERS_FOLLOWED = 1;
            expect(response.body.message.length).toBe(EXPECTED_USERS_FOLLOWED);
            expect(response.statusCode).toBe(200);
        });

        test('GET /user/followers-of/:username 200 OK uvgram4 is followed by 1 user', async () => {
            response = await request(server).get("/user/followers-of/uvgram4").set({ "authorization": `Bearer ${accessTokenUser3}` }).send();
            const EXPECTED_USERS_FOLLOWED = 1;
            expect(response.body.message.length).toBe(EXPECTED_USERS_FOLLOWED);
            expect(response.statusCode).toBe(200);
        });

        test('GET /user/followers-of/:username 200 OK uvgram5 is followed by 0 user', async () => {
            response = await request(server).get("/user/followers-of/uvgram5").set({ "authorization": `Bearer ${accessTokenUser3}` }).send();
            const EXPECTED_USERS_FOLLOWED = 2;
            expect(response.body.message.length).toBe(EXPECTED_USERS_FOLLOWED);
            expect(response.statusCode).toBe(200);
        });

        test('GET /user/followers-of/:username 403 Forbidden uvgram6 does not exist', async () => {
            response = await request(server).get("/user/followers-of/uvgram6").set({ "authorization": `Bearer ${accessTokenUser3}` }).send();
            expect(response.body.message).toContain("username does not exist");
            expect(response.statusCode).toBe(403);
        });

        test('GET /user/followers-of/:username 400 Bad Request bearer token is required', async () => {
            response = await request(server).get("/user/followers-of/uvgram6").send();
            expect(response.body.errors[0].msg).toContain("authorization header is required");
            expect(response.statusCode).toBe(400);
        });

        test('GET /user/followers-of/:username 403 Forbidden uvgram6 token does not exist', async () => {
            response = await request(server).get("/user/followers-of/uvgram6").set({ "authorization": `Bearer ${accessTokenUser3}s` }).send();
            expect(response.body.message.error).toContain("JsonWebTokenError: invalid signature");
            expect(response.statusCode).toBe(403);
        });
    });
});

describe('POST /user/block/', () => {
    test('POST /user/block/ 404 Resource Not Found ', async () => {
        response = await request(server).post("/user/blocsk/").set({ "authorization": "Bearer sadfasdfas" }).send();
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
            response = await request(server).post("/user/block").set({ "authorization": `Bearer ${accessToken}` }).send({ "username": "uvgram" });
            expect(response.body.message).toContain("you can not block yourself");
            expect(response.statusCode).toBe(403);
        });

        test('POST /user/block/ 403 Forbidden username is required', async () => {
            response = await request(server).post("/user/block/").set({ "authorization": `Bearer ${accessToken}` }).send({ "username": "" });
            expect(response.body.errors[0].msg).toContain("username is required")
            expect(response.statusCode).toBe(400);
        });

        test('POST /user/block/ 403 Forbidden username is required', async () => {
            response = await request(server).post("/user/block/").set({ "authorization": `Bearer ${accessToken}` }).send({ "username": null });
            expect(response.body.errors[0].msg).toContain("username is required")
            expect(response.statusCode).toBe(400);
        });

        test('POST /user/block/ 403 Forbidden username does not exist', async () => {
            response = await request(server).post("/user/block/").set({ "authorization": `Bearer ${accessToken}` }).send({ "username": "uvgram99" });
            expect(response.body.message).toContain("username does not exist")
            expect(response.statusCode).toBe(403);
        });

        test('POST /user/block/ 200 OK username is now blocked', async () => {
            response = await request(server).post("/user/block/").set({ "authorization": `Bearer ${accessToken}` }).send({ "username": "uvgram2" });
            expect(response.body.message).toContain("user has blocked to");
            expect(response.statusCode).toBe(200);
        });
    });
});

describe('POST /user/unblock/', () => {
    test('POST /user/unblock/ 404 Resource Not Found ', async () => {
        response = await request(server).post("/user/unblocsk/").set({ "authorization": "Bearer sadfasdfas" }).send();
        expect(response.statusCode).toBe(404);
    });

    describe('POST /user/unblock/ After 2 new users', () => {
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
            response = await request(server).post("/user/block").set({ "authorization": `Bearer ${accessToken}` }).send({ "username": "uvgram2" });
        });

        test('POST /user/unblock/ 403 Forbidden User can not block himself', async () => {
            response = await request(server).post("/user/unblock/").set({ "authorization": `Bearer ${accessToken}` }).send({ "username": "uvgram" });
            expect(response.body.message).toContain("you can not unblock yourself");
            expect(response.statusCode).toBe(403);
        });

        test('POST /user/unblock/ 403 Forbidden username is required', async () => {
            response = await request(server).post("/user/unblock/").set({ "authorization": `Bearer ${accessToken}` }).send({ "username": "" });
            expect(response.body.errors[0].msg).toContain("username is required")
            expect(response.statusCode).toBe(400);
        });

        test('POST /user/unblock/ 403 Forbidden username is required', async () => {
            response = await request(server).post("/user/unblock/").set({ "authorization": `Bearer ${accessToken}` }).send({ "username": null });
            expect(response.body.errors[0].msg).toContain("username is required")
            expect(response.statusCode).toBe(400);
        });

        test('POST /user/unblock/ 403 Forbidden username does not exist', async () => {
            response = await request(server).post("/user/unblock/").set({ "authorization": `Bearer ${accessToken}` }).send({ "username": "uvgram99" });
            expect(response.body.message).toContain("username does not exist")
            expect(response.statusCode).toBe(403);
        });

        test('POST /user/unblock/ 200 OK username is now blocked', async () => {
            response = await request(server).post("/user/unblock/").set({ "authorization": `Bearer ${accessToken}` }).send({ "username": "uvgram2" });
            expect(response.body.message).toContain("user has unblocked to");
            expect(response.statusCode).toBe(200);
        });
    });
});