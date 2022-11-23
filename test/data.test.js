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

afterAll(async () => {
    server.close();
    await sequelize.truncate({ cascade: true, restartIdentity: true });
    await redisClient.flushAll("ASYNC");
    await clearDatabase();
});

describe('GET /data/faculty/', () => {
    test('GET /data/faculty 200 OK Get 5 faculties availables ', async () => {
        response = await request(server).get("/data/faculty/").send();
        expect(response.body.message.length).toEqual(5);
        expect(response.statusCode).toBe(200);
    });
});

describe('GET /data/region/', () => {
    test('GET /data/region/ 200 OK Get 3 region availables ', async () => {
        response = await request(server).get("/data/region/").send();
        expect(response.body.message.length).toEqual(3);
        expect(response.statusCode).toBe(200);
    });
});

describe('GET /data/educationalprogram/', () => {
    test('GET /data/educationalprogram/ 200 OK Get educational programs availables ', async () => {
        response = await request(server).get("/data/educationalprogram/").send();
        expect(response.body.message.length).toEqual(6);
        expect(response.statusCode).toBe(200);
    });
});



describe('POST /data/educationalprogram/', () => {
    test('POST /data/educationalprogram 200 OK POST educational programs ', async () => {
        response = await request(server).post("/data/educationalProgram/").send({ "educationalProgram": "METALURGIA", "idFaculty": "1" });
        expect(response.statusCode).toBe(200);
    });

    test('POST /data/educationalprogram 200 OK POST educational programs ', async () => {
        response = await request(server).post("/data/educationalProgram/").send({ "educationalProgram": "QUIMICA", "idFaculty": "1" });
        expect(response.statusCode).toBe(200);
    });

    test('POST /data/educationalprogram 200 OK POST educational programs ', async () => {
        response = await request(server).post("/data/educationalProgram/").send({ "educationalProgram": "INFORMATICA", "idFaculty": "2" });
        expect(response.statusCode).toBe(200);
    });
});


describe('POST /data/faculty/', () => {
    test('POST /data/faculty 200 OK POST 1 faculty added ', async () => {
        response = await request(server).post("/data/faculty/").send({ "idRegion": "1", "faculty": "FACULTAD_PSICOLOGIA" });
        expect(response.statusCode).toBe(200);
    });

    test('POST /data/faculty 200 OK POST 1 faculty added', async () => {
        response = await request(server).post("/data/faculty/").send({ "idRegion": "1", "faculty": "FACULTAD_CIENCIAS" });
        expect(response.statusCode).toBe(200);
    });

    test('POST /data/faculty 200 OK POST 1 faculty added', async () => {
        response = await request(server).post("/data/faculty/").send({ "idRegion": "1", "faculty": "FACULTAD_CIENCIAS_SOCIALES" });
        expect(response.statusCode).toBe(200);
    });
});


describe('POST /data/region/', () => {
    test('POST /data/region 200 OK POST 1 region added ', async () => {
        response = await request(server).post("/data/region/").send({ "region": "TABASCO" });
        expect(response.statusCode).toBe(200);
    });

    test('POST /data/region 200 OK POST 1 region added ', async () => {
        response = await request(server).post("/data/region/").send({ "region": "RIO_PANUCO" });
        expect(response.statusCode).toBe(200);
    });

    test('POST /data/region 200 OK POST 1 region added ', async () => {
        response = await request(server).post("/data/region/").send({ "region": "CORDOBA" });
        expect(response.statusCode).toBe(200);
    });
});
