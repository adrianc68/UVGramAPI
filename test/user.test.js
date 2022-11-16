const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require("../src/database/connectionDatabaseSequelize");
const { redisClient } = require("../src/database/connectionRedis");
const { server } = require("../src/server");

async function delay() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 3000);
    });
};

beforeAll(async () => {
    await delay();
    await sequelize.truncate({ cascade: true, restartIdentity: true });
    await redisClient.flushAll("ASYNC");
});

afterAll(async () => {
    server.close();
    await sequelize.truncate({ cascade: true, restartIdentity: true });
    await redisClient.flushAll("ASYNC");
});

describe('POST /user/follow/', () => {
    test('POST /user/follow 404 Resource Not Found ', async () => {
        response = await request(server).post("/user/followsr/").set({ "authorization": "Bearer sadfasdfas" }).send();
        expect(response.statusCode).toBe(404);
    });

    describe('POST /user/follow After 2 new users', () => {
        let accessToken;

        afterAll(async () => {
            await redisClient.flushAll("ASYNC");
            await sequelize.truncate({ cascade: true, restartIdentity: true });
        });

        beforeAll(async () => {
            await redisClient.flushAll("ASYNC");
            await sequelize.truncate({ cascade: true, restartIdentity: true });

            let response = await request(server).post("/accounts/create/verification").send({ "username": "uvgram", "email": "admin@uvgram.com" });
            let { verificationCode } = response.body.message;
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
            let { verificationCode: vCode } = response.body.message;
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
            expect(response.body.message).toContain("user can not follow himself");
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
            await redisClient.flushAll("ASYNC");
            await sequelize.truncate({ cascade: true, restartIdentity: true });
        });

        beforeAll(async () => {
            await redisClient.flushAll("ASYNC");
            await sequelize.truncate({ cascade: true, restartIdentity: true });

            let response = await request(server).post("/accounts/create/verification").send({ "username": "uvgram", "email": "admin@uvgram.com" });
            let { verificationCode } = response.body.message;
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
            let { verificationCode: vCode } = response.body.message;
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
            expect(response.body.message).toContain("user can not unfollow himself");
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
            expect(response.body.message.error).toContain("accessToken does not exist");
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
