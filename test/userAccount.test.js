const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require("../src/database/connectionDatabaseSequelize");
const { server } = require("../src/server")

function delay() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 3000);
    });
}

beforeAll(async () => {
    await delay();
})

describe('POST /accounts/create/verification', () => {
    afterAll(async () => {
        sequelize.truncate({ cascade: true, restartIdentity: true });
    });

    describe('Test that must fail', () => {
        test('POST /accounts/create/verifications 404 Resource not found', async () => {
            const response = await request(server).post("/accounts/create/verifications").send({ "userjasfd": "UVGram", "email": "admin@uvgram.com" });
            expect(response.statusCode).toBe(404);
        });

        test('POST /accounts/create/verification 400 Bad Request username is required', async () => {
            const response = await request(server).post("/accounts/create/verification").send({ "userjasfd": "UVGram", "email": "admin@uvgram.com" });
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/verification 400 Bad Request email is required', async () => {
            const response = await request(server).post("/accounts/create/verification").send({ "username": "UVGram", "afsdpk": "admin@uvgram.com" });
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/verification 400 Bad Request username is empty', async () => {
            const response = await request(server).post("/accounts/create/verification").send({ "username": "", "email": "admin@uvgram.com" });
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/verification 400 Bad Request username is null', async () => {
            const response = await request(server).post("/accounts/create/verification").send({ "username": null, "email": "admin@uvgram.com" });
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/verification 400 Bad Request username is undefined ', async () => {
            const response = await request(server).post("/accounts/create/verification").send({ "username": undefined, "email": "admin@uvgram.com" });
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/verification 400 Bad Request email is empty', async () => {
            const response = await request(server).post("/accounts/create/verification").send({ "username": "UVGram", "email": "" });
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/verification 400 Bad Request email is null', async () => {
            const response = await request(server).post("/accounts/create/verification").send({ "username": "UVGram", "email": null });
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/verification 400 Bad Request email is undefined', async () => {
            const response = await request(server).post("/accounts/create/verification").send({ "username": "UVGram", "email": undefined });
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/verification 404 Bad Request on JSON', async () => {
            const response = await request(server).post("/accounts/create/verification").send({ "username": "UVGr\"am", "email": "admin@uvgram.com" });
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/verification 404 Bad Request on JSON', async () => {
            const response = await request(server).post("/accounts/create/verification").send({ "username": "UVGr\"am", "email": "admin@uvgram.com" });
            expect(response.statusCode).toBe(400);
        });
    });


    describe('Test that must pass', () => {
        test('POST /accounts/create/verification 200 OK Response For new user', async () => {
            const response = await request(server).post("/accounts/create/verification").send({ "username": "UVGram", "email": "admin@uvgram.com" });
            expect(response.statusCode).toBe(200);
            expect(response.body.message.verificationCode).toHaveLength(8);
        });

        test('POST /accounts/create/verification 403 Forbidden Code already generated should wait 5 minutes', async () => {
            const response = await request(server).post("/accounts/create/verification").send({ "username": "UVGram", "email": "admin@uvgram.com" });
            expect(response.statusCode).toBe(403);
        });

        test('POST /accounts/create/verification 200 OK Response For another user', async () => {
            const response = await request(server).post("/accounts/create/verification").send({ "username": "adrianc68", "email": "adrianc68@test.com" });
            expect(response.statusCode).toBe(200);
            expect(response.body.message.verificationCode).toHaveLength(8);
        });
    });
});


afterAll(async () => {
    server.close();
});