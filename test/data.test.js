const request = require('supertest');
const { connetionToServers } = require('../src/app');
const { getVerificationCodeFromEmail } = require('../src/dataaccess/mailDataAccess');
const { sequelize } = require("../src/database/connectionDatabaseSequelize");
const { redisClient } = require("../src/database/connectionRedis");
const { server, delayServerConnections, clearDatabase } = require("../src/server");

beforeAll(async () => {
    await delayServerConnections();
    await clearDatabase();
    await sequelize.truncate({ cascade: true, restartIdentity: true });
    await redisClient.flushAll("ASYNC");
});

afterAll(async () => {
    server.close();
    await sequelize.truncate({ cascade: true, restartIdentity: true });
    await redisClient.flushAll("ASYNC");
    await clearDatabase();
});

describe('GET /data/faculty/', () => {
    beforeAll(async () => {
        response = await request(server).post("/data/region/").send({ "region": "PUEBLA" });
        response = await request(server).post("/data/region/").send({ "region": "VERACRUZ" });
        response = await request(server).post("/data/region/").send({ "region": "XALAPA" });
        response = await request(server).post("/data/faculty/").send({ "idRegion": "3", "faculty": "FACULTAD_ESTADISTICA_E_INFORMATICA" });
        response = await request(server).post("/data/faculty/").send({ "idRegion": "3", "faculty": "FACULTAD_DE_CONTABILIDAD" });
        response = await request(server).post("/data/faculty/").send({ "idRegion": "3", "faculty": "FACULTAD_DE_INGENIERIA" });
        response = await request(server).post("/data/faculty/").send({ "idRegion": "2", "faculty": "FACULTAD_DE_DERECHO" });
        response = await request(server).post("/data/faculty/").send({ "idRegion": "1", "faculty": "FACULTAD_DE_ARQUITECTURA" });
        response = await request(server).post("/data/educationalProgram/").send({ "educationalProgram": "LICENCIATURA_INGENIERIA_ALIMENTOS", "idFaculty": "3" });
        response = await request(server).post("/data/educationalProgram/").send({ "educationalProgram": "INGENIERIA_DE_SOFTWARE", "idFaculty": "3" });
        response = await request(server).post("/data/educationalProgram/").send({ "educationalProgram": "INGENIERIA_MECANICA", "idFaculty": "3" });
        response = await request(server).post("/data/educationalProgram/").send({ "educationalProgram": "MEDICINA", "idFaculty": "2" });
        response = await request(server).post("/data/educationalProgram/").send({ "educationalProgram": "DERECHO", "idFaculty": "2" });
        response = await request(server).post("/data/educationalProgram/").send({ "educationalProgram": "NUTRICION", "idFaculty": "1" });
    });

    test('POST /user/follow 200 Get 5 faculties availables ', async () => {
        response = await request(server).get("/data/faculty/").send();
        expect(response.body.message.length).toEqual(5);
        expect(response.statusCode).toBe(200);
    });
});

describe('GET /data/region/', () => {
    test('POST /user/follow 200 Get 3 region availables ', async () => {
        response = await request(server).get("/data/region/").send();
        expect(response.body.message.length).toEqual(3);
        expect(response.statusCode).toBe(200);
    });
});

describe('GET /data/educationalprogram/', () => {
    test('POST /user/follow 200 Get educational programs availables ', async () => {
        response = await request(server).get("/data/educationalprogram/").send();
        expect(response.body.message.length).toEqual(6);
        expect(response.statusCode).toBe(200);
    });
});
