const request = require('supertest');
const { connetionToServers } = require('../src/app');
const { getVerificationCodeFromEmail } = require('../src/dataaccess/mailDataAccess');
const { server, delayServerConnections, clearMessagesMailHog, clearDatabase } = require("../src/server");

beforeAll(async () => {
    await delayServerConnections();
    await clearDatabase();
});

afterAll(async () => {
    server.close();
    await clearDatabase();
});

describe('POST /authentication/login', () => {
    test('POST /authentication/logins 404 Resource Not Found ', async () => {
        response = await request(server).post("/authentication/logins").send({ "password": "test234232", "emailOrUsername:": "uvgram" });
        expect(response.statusCode).toBe(404);
    });

    test('POST /authentication/login 400 Bad Request password is empty', async () => {
        response = await request(server).post("/authentication/login").send({ "emailOrUsername": "uvgram", "passsword": "" });
        expect(response.body.errors[0].msg).toContain("password is required")
        expect(response.statusCode).toBe(400);
    });

    test('POST /authentication/login 400 Bad Request password is null', async () => {
        response = await request(server).post("/authentication/login").send({ "emailOrUsername": "uvgram", "password": null });
        expect(response.body.errors[0].msg).toContain("password is required")
        expect(response.statusCode).toBe(400);
    });

    test('POST /authentication/login 400 Bad Request password is undefined', async () => {
        response = await request(server).post("/authentication/login").send({ "emailOrUsername": "uvgram", "password": undefined });
        expect(response.body.errors[0].msg).toContain("password is required")
        expect(response.statusCode).toBe(400);
    });

    test('POST /authentication/login 400 Bad Request password is required', async () => {
        response = await request(server).post("/authentication/login").send({ "emailOrUsername": "uvgram", "d": "" });
        expect(response.body.errors[0].msg).toContain("password is required")
        expect(response.statusCode).toBe(400);
    });

    test('POST /authentication/login 400 Bad Request email is empty', async () => {
        response = await request(server).post("/authentication/login").send({ "emailOrUsername": "", "password": "hola1234" });
        expect(response.body.errors[0].msg).toContain("emailOrUsername is required")
        expect(response.statusCode).toBe(400);
    });

    test('POST /authentication/login 400 Bad Request email is null', async () => {
        response = await request(server).post("/authentication/login").send({ "emailOrUsername": null, "password": "hola1234" });
        expect(response.body.errors[0].msg).toContain("emailOrUsername is required")
        expect(response.statusCode).toBe(400);
    });

    test('POST /authentication/login 400 Bad Request email is undefined', async () => {
        response = await request(server).post("/authentication/login").send({ "emailOrUsername": undefined, "password": "hola1234" });
        expect(response.body.errors[0].msg).toContain("emailOrUsername is required")
        expect(response.statusCode).toBe(400);
    });

    test('POST /authentication/login 400 Bad Request email is required', async () => {
        response = await request(server).post("/authentication/login").send({ "s": "uvgram", "password": "hola1234" });
        expect(response.body.errors[0].msg).toContain("emailOrUsername is required")
        expect(response.statusCode).toBe(400);
    });

    describe('POST /authentication/login and user creation', () => {
        beforeAll(async () => {
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
        });

        afterAll(async () => {
            await clearDatabase();
        });

        test('POST /authentication/login 200 OK', async () => {
            response = await request(server).post("/authentication/login").send({ "emailOrUsername": "uvgram", "password": "hola1234" });
            expect(response.body.message.refreshToken).not.toBeNull();
            expect(response.body.message.accessToken).not.toBeNull();
            expect(response.statusCode).toBe(200);
        });

        test('POST /authentication/login 403 Forbidden invalid password', async () => {
            response = await request(server).post("/authentication/login").send({ "password": "test54321", "emailOrUsername": "uvgram" });
            expect(response.body.message).toContain("password does not match");
            expect(response.statusCode).toBe(403);
        });

        test('POST /authentication/login 403 Forbidden invalid emailOrUsername', async () => {
            response = await request(server).post("/authentication/login").send({ "password": "hola1234", "emailOrUsername": "testing1234" });
            expect(response.body.message).toContain("user not found");
            expect(response.statusCode).toBe(403);
        });
    });
});

describe('POST /authentication/logout', () => {
    test('POST /authentication/logout 404 Resource Not Found ', async () => {
        response = await request(server).post("/authentication/logoutvvadf").set({ "authorization": "Bearer sadfasdfas" }).send();
        expect(response.statusCode).toBe(404);
    });

    test('POST /authentication/logout 400 Bad Request authorization is required ', async () => {
        response = await request(server).post("/authentication/logout").set({ "asdfa": "Bearer sadfasdfas" }).send();
        expect(response.body.errors[0].msg).toContain("authorization header is required")
        expect(response.statusCode).toBe(400);
    });

    test('POST /authentication/logout 400 Bad Request authorization is empty ', async () => {
        response = await request(server).post("/authentication/logout").set({ "authorization": "" }).send();
        expect(response.body.errors[0].msg).toContain("authorization header is required")
        expect(response.statusCode).toBe(400);
    });

    test('POST /authentication/logout 400 Bad Request authorization is null ', async () => {
        response = await request(server).post("/authentication/logout").set({ "authorization": null }).send();
        expect(response.body.errors[0].msg).toContain("Bearer token is not valid, you must provide a valid token format")
        expect(response.statusCode).toBe(400);
    });

    test('POST /authentication/logout 400 Bad Request autohrization is malformed ', async () => {
        response = await request(server).post("/authentication/logout").set({ "authorization": "Bearer test" }).send();
        expect(response.body.message.error).toContain("JsonWebTokenError: jwt malformed");
        expect(response.statusCode).toBe(403);
    });

    describe('POST /authentication/logout After user creation', () => {
        let accessToken;
        let refreshToken;
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
            response = await request(server).post("/authentication/login").send({ "emailOrUsername": "uvgram", "password": "hola1234" });
            refreshToken = response.body.message.refreshToken;
            accessToken = response.body.message.accessToken;
        });

        afterAll(async () => {
            await clearDatabase();

        });

        test('POST /authentication/logout 400 Bad Request AccessToken Bearer format invalid ', async () => {
            response = await request(server).post("/authentication/logout").set({ "authorization": `${accessToken}`, "refreshToken": `Bearer ${refreshToken}` }).send();
            expect(response.body.errors[0].param).toContain("authorization")
            expect(response.body.errors[0].msg).toContain('Bearer token is not valid, you must provide a valid token format');
            expect(response.statusCode).toBe(400);
        });

        test('POST /authentication/logout 400 Bad Request RefreshToken Bearer format invalid ', async () => {
            response = await request(server).post("/authentication/logout").set({ "authorization": `Bearer${accessToken}` }).send();
            expect(response.body.errors[0].msg).toContain('Bearer token is not valid, you must provide a valid token format');
            expect(response.statusCode).toBe(400);
        });

        test('POST /authentication/logout 200 Ok Logout successful ', async () => {
            response = await request(server).post("/authentication/logout").set({ "authorization": `Bearer ${accessToken}` }).send();
            expect(response.body.message).toContain("logout successful");
            expect(response.statusCode).toBe(200);
        });
    });
});

describe('POST /authentication/refresh', () => {
    describe('POST /authentication/refresh After user creation and login succesfull', () => {
        let accessToken;
        let refreshToken;
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
            response = await request(server).post("/authentication/login").send({ "emailOrUsername": "uvgram", "password": "hola1234" });
            refreshToken = response.body.message.refreshToken;
            accessToken = response.body.message.accessToken;
        });

        afterAll(async () => {
            await clearDatabase();
        });

        test('POST /authentication/refresh 403 Forbidden Provide a token of type refresh.', async () => {
            response = await request(server).post("/authentication/refresh").set({ "authorization": `Bearer ${accessToken}` }).send();
            expect(response.body.message.error).toContain("you must provide a token of type refreshToken");
            expect(response.statusCode).toBe(403);
        });

        test('POST /authentication/refresh 200 OK Refresh accessToken removing last accessToken', async () => {
            response = await request(server).post("/authentication/refresh").set({ "authorization": `Bearer ${refreshToken}`, "accessToken": `Bearer ${accessToken}` }).send();
            expect(response.body.message.accessToken).not.toBeNull();
            expect(response.statusCode).toBe(200);
        });

        test('POST /authentication/refresh 200 OK Refresh accessToken without last accessToken', async () => {
            response = await request(server).post("/authentication/refresh").set({ "authorization": `Bearer ${refreshToken}` }).send();
            expect(response.body.accessToken).not.toBeNull();
            expect(response.statusCode).toBe(200);
        });
    });


});