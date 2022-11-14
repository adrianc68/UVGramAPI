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

afterAll(async () => {
    sequelize.truncate({ cascade: true, restartIdentity: true });
});

describe('POST /accounts/create/verification', () => {
    describe('Test that must fail', () => {
        test('POST /accounts/create/verifications 404 Resource not found', async () => {
            const response = await request(server).post("/accounts/create/verifications").send({ "userjasfd": "uvgram", "email": "admin@uvgram.com" });
            expect(response.statusCode).toBe(404);
        });

        test('POST /accounts/create/verification 400 Bad Request username is required', async () => {
            const response = await request(server).post("/accounts/create/verification").send({ "userjasfd": "uvgram", "email": "admin@uvgram.com" });
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/verification 400 Bad Request email is required', async () => {
            const response = await request(server).post("/accounts/create/verification").send({ "username": "uvgram", "afsdpk": "admin@uvgram.com" });
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
            const response = await request(server).post("/accounts/create/verification").send({ "username": "uvgram", "email": "" });
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/verification 400 Bad Request email is null', async () => {
            const response = await request(server).post("/accounts/create/verification").send({ "username": "uvgram", "email": null });
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/verification 400 Bad Request email is undefined', async () => {
            const response = await request(server).post("/accounts/create/verification").send({ "username": "uvgram", "email": undefined });
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/verification 404 Bad Request on JSON', async () => {
            const response = await request(server).post("/accounts/create/verification").send({ "username": "uvgr\"am", "email": "admin@uvgram.com" });
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/verification 404 Bad Request on JSON', async () => {
            const response = await request(server).post("/accounts/create/verification").send({ "username": "uvgr\"am", "email": "admin@uvgram.com" });
            expect(response.statusCode).toBe(400);
        });
    });


    describe('Test that must pass', () => {
        test('POST /accounts/create/verification 200 OK Response For new user', async () => {
            const response = await request(server).post("/accounts/create/verification").send({ "username": "ricardolopez", "email": "riclopez@uvgram.com" });
            expect(response.statusCode).toBe(200);
            expect(response.body.message.verificationCode).toHaveLength(8);
        });

        test('POST /accounts/create/verification 403 Forbidden Code already generated should wait 5 minutes', async () => {
            const response = await request(server).post("/accounts/create/verification").send({ "username": "ricardolopez", "email": "riclopez@uvgram.com" });
            console.log(response.body);
            expect(response.statusCode).toBe(403);
        });

        test('POST /accounts/create/verification 200 OK Response For another user', async () => {
            const response = await request(server).post("/accounts/create/verification").send({ "username": "robertolopez", "email": "lopezroberto@test.com" });
            expect(response.statusCode).toBe(200);
            expect(response.body.message.verificationCode).toHaveLength(8);
        });
    });
});

describe('POST /accounts/create/', () => {

    describe('Test that must fail', () => {
        test('POST /accounts/creates/ 404 Resource not found', async () => {
            const newUser = {
                name: "Fenix Fluido Castañeda",
                presentation: null,
                username: "fenixfc98",
                password: "hola1234",
                phoneNumber: "2281234567",
                email: "fenixfluidocastañeda@testing.com",
                birthdate: "2000-09-09",
                verificationCode: "00000000"
            }
            const response = await request(server).post("/accounts/creates").send(newUser);
            expect(response.statusCode).toBe(404);
        });

        test('POST /accounts/create/ 400 Bad Request name is empty (name is optional)', async () => {
            const newUser = {
                name: "",
                presentation: null,
                username: "fenixfc98",
                password: "hola1234",
                phoneNumber: "2281234567",
                email: "fenixfluidocastañeda@testing.com",
                birthdate: "2000-09-09",
                verificationCode: "00000000"
            }
            const response = await request(server).post("/accounts/create").send(newUser);
            console.log(response.body.errors[0].msg);
            expect(response.body.errors[0].msg).toContain("name must have the allowed length");
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/ 403 Forbiden name is null (name is optional)', async () => {
            const newUser = {
                name: null,
                presentation: null,
                username: "fenixfc98",
                password: "hola1234",
                phoneNumber: "2281234567",
                email: "fenixfluidocastañeda@testing.com",
                birthdate: "2000-09-09",
                verificationCode: "00000000"
            }
            const response = await request(server).post("/accounts/create").send(newUser);
            expect(response.body.message).toContain("verification code is not valid");
            expect(response.statusCode).toBe(403);
        });

        test('POST /accounts/create/ 403 Forbiden name is undefined (name is optional)', async () => {
            const newUser = {
                name: undefined,
                presentation: null,
                username: "fenixfc98",
                password: "hola1234",
                phoneNumber: "2281234567",
                email: "fenixfluidocastañeda@testing.com",
                birthdate: "2000-09-09",
                verificationCode: "00000000"
            }
            const response = await request(server).post("/accounts/create").send(newUser);
            expect(response.body.message).toContain("verification code is not valid");
            expect(response.statusCode).toBe(403);
        });

        test('POST /accounts/create/ 403 Forbidden presentation is empty (presentation is optional)', async () => {
            const newUser = {
                name: "Fenix Fluido Castañeda",
                presentation: "",
                username: "fenixfc98",
                password: "hola1234",
                phoneNumber: "2281234567",
                email: "fenixfluidocastañeda@testing.com",
                birthdate: "2000-09-09",
                verificationCode: "00000000"
            }
            const response = await request(server).post("/accounts/create").send(newUser);
            expect(response.body.message).toContain("verification code is not valid");
            expect(response.statusCode).toBe(403);
        });

        test('POST /accounts/create/ 403 Forbidden presentation is null (presentation is optional)', async () => {
            const newUser = {
                name: "Fenix Fluido Castañeda",
                presentation: null,
                username: "fenixfc98",
                password: "hola1234",
                phoneNumber: "2281234567",
                email: "fenixfluidocastañeda@testing.com",
                birthdate: "2000-09-09",
                verificationCode: "00000000"
            }
            const response = await request(server).post("/accounts/create").send(newUser);
            expect(response.body.message).toContain("verification code is not valid");
            expect(response.statusCode).toBe(403);
        });

        test('POST /accounts/create/ 403 Forbidden presentation is undefined (presentation is optional)', async () => {
            const newUser = {
                name: "Fenix Fluido Castañeda",
                presentation: undefined,
                username: "fenixfc98",
                password: "hola1234",
                phoneNumber: "2281234567",
                email: "fenixfluidocastañeda@testing.com",
                birthdate: "2000-09-09",
                verificationCode: "00000000"
            }
            const response = await request(server).post("/accounts/create").send(newUser);
            expect(response.body.message).toContain("verification code is not valid");
            expect(response.statusCode).toBe(403);
        });
        test('POST /accounts/create/ 400 Bad Request username is empty', async () => {
            const newUser = {
                name: "Fenix Fluido Castañeda",
                presentation: "This is my profile :)",
                username: "",
                password: "hola1234",
                phoneNumber: "2281234567",
                email: "fenixfluidocastañeda@testing.com",
                birthdate: "2000-09-09",
                verificationCode: "00000000"
            }
            const response = await request(server).post("/accounts/create").send(newUser);
            expect(response.body.errors[0].msg).toContain("username is required");
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/ 400 Bad Request username is null', async () => {
            const newUser = {
                name: "Fenix Fluido Castañeda",
                presentation: "This is my profile :)",
                username: null,
                password: "hola1234",
                phoneNumber: "2281234567",
                email: "fenixfluidocastañeda@testing.com",
                birthdate: "2000-09-09",
                verificationCode: "00000000"
            }
            const response = await request(server).post("/accounts/create").send(newUser);
            expect(response.body.errors[0].msg).toContain("username is required");
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/ 400 Bad Request username is undefined', async () => {
            const newUser = {
                name: "Fenix Fluido Castañeda",
                presentation: "This is my profile :)",
                username: undefined,
                password: "hola1234",
                phoneNumber: "2281234567",
                email: "fenixfluidocastañeda@testing.com",
                birthdate: "2000-09-09",
                verificationCode: "00000000"
            }
            const response = await request(server).post("/accounts/create").send(newUser);
            expect(response.body.errors[0].msg).toContain("username is required");
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/ 400 Bad Request username is too long', async () => {
            const newUser = {
                name: "Fenix Fluido Castañeda",
                presentation: "This is my profile :)",
                username: "psokadfpoadfopakfdokpdfpodfkapofkaspodfkdapfoaspofadpfoakdfposadkfposadkfposakfspdsadf09sa8df90sad90fsakdpfoadfosaidfa09is09a",
                password: "hola1234",
                phoneNumber: "2281234567",
                email: "fenixfluidocastañeda@testing.com",
                birthdate: "2000-09-09",
                verificationCode: "00000000"
            }
            const response = await request(server).post("/accounts/create").send(newUser);
            expect(response.body.errors[0].msg).toContain("username must have the allowed length");
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/ 400 Bad Request username has spaces between words', async () => {
            const newUser = {
                name: "Fenix Fluido Castañeda",
                presentation: "This is my profile :)",
                username: "fenix fluido castañeda",
                password: "hola1234",
                phoneNumber: "2281234567",
                email: "fenixfluidocastañeda@testing.com",
                birthdate: "2000-09-09",
                verificationCode: "00000000"
            }
            const response = await request(server).post("/accounts/create").send(newUser);
            expect(response.body.errors[0].msg).toContain("username is not valid, must have allowed characters");
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/ 400 Bad Request username has period as last character', async () => {
            const newUser = {
                name: "Fenix Fluido Castañeda",
                presentation: "This is my profile :)",
                username: "fenix_fluido_castañeda.",
                password: "hola1234",
                phoneNumber: "2281234567",
                email: "fenixfluidocastañeda@testing.com",
                birthdate: "2000-09-09",
                verificationCode: "00000000"
            }
            const response = await request(server).post("/accounts/create").send(newUser);
            expect(response.body.errors[0].msg).toContain("username is not valid, must have allowed characters");
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/ 400 Bad Request username has multiple period char in a row', async () => {
            const newUser = {
                name: "Fenix Fluido Castañeda",
                presentation: "This is my profile :)",
                username: "fenix_fluido..castañeda",
                password: "hola1234",
                phoneNumber: "2281234567",
                email: "fenixfluidocastañeda@testing.com",
                birthdate: "2000-09-09",
                verificationCode: "00000000"
            }
            const response = await request(server).post("/accounts/create").send(newUser);
            expect(response.body.errors[0].msg).toContain("username is not valid, must have allowed characters");
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/ 400 Bad Request username ñ is not allowed', async () => {
            const newUser = {
                name: "Fenix Fluido Castañeda",
                presentation: "This is my profile :)",
                username: "fenix_fluido._castañeda",
                password: "hola1234",
                phoneNumber: "2281234567",
                email: "fenixfluidocastañeda@testing.com",
                birthdate: "2000-09-09",
                verificationCode: "00000000"
            }
            const response = await request(server).post("/accounts/create").send(newUser);
            expect(response.body.errors[0].msg).toContain("username is not valid, must have allowed characters");
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/ 400 Bad Request username special character is not allowed', async () => {
            const newUser = {
                name: "Fenix Fluido Castañeda",
                presentation: "This is my profile :)",
                username: "fenix_fluido._castan$eda",
                password: "hola1234",
                phoneNumber: "2281234567",
                email: "fenixfluidocastañeda@testing.com",
                birthdate: "2000-09-09",
                verificationCode: "00000000"
            }
            const response = await request(server).post("/accounts/create").send(newUser);
            expect(response.body.errors[0].msg).toContain("username is not valid, must have allowed characters");
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/ 400 Bad Request username special character is not allowed', async () => {
            const newUser = {
                name: "Fenix Fluido Castañeda",
                presentation: "This is my profile :)",
                username: "fenH&%·_fluido._castan$eda",
                password: "hola1234",
                phoneNumber: "2281234567",
                email: "fenixfluidocastañeda@testing.com",
                birthdate: "2000-09-09",
                verificationCode: "00000000"
            }
            const response = await request(server).post("/accounts/create").send(newUser);
            expect(response.body.errors[0].msg).toContain("username is not valid, must have allowed characters");
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/ 400 Bad Request username uppercase not allowed', async () => {
            const newUser = {
                name: "Fenix Fluido Castañeda",
                presentation: "This is my profile :)",
                username: "Felixfluidocastaneda",
                password: "hola1234",
                phoneNumber: "2281234567",
                email: "fenixfluidocastañeda@testing.com",
                birthdate: "2000-09-09",
                verificationCode: "00000000"
            }
            const response = await request(server).post("/accounts/create").send(newUser);
            expect(response.body.errors[0].msg).toContain("username is not valid, must have allowed characters");
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/ 400 Bad Request password is empty', async () => {
            const newUser = {
                name: "Fenix Fluido Castañeda",
                presentation: "This is my profile :)",
                username: "felixfluidocastaneda",
                password: "",
                phoneNumber: "2281234567",
                email: "fenixfluidocastañeda@testing.com",
                birthdate: "2000-09-09",
                verificationCode: "00000000"
            }
            const response = await request(server).post("/accounts/create").send(newUser);
            expect(response.body.errors[0].msg).toContain("password is required");
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/ 400 Bad Request password is null', async () => {
            const newUser = {
                name: "Fenix Fluido Castañeda",
                presentation: "This is my profile :)",
                username: "felixfluidocastaneda",
                password: null,
                phoneNumber: "2281234567",
                email: "fenixfluidocastañeda@testing.com",
                birthdate: "2000-09-09",
                verificationCode: "00000000"
            }
            const response = await request(server).post("/accounts/create").send(newUser);
            expect(response.body.errors[0].msg).toContain("password is required");
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/ 400 Bad Request password is undefined', async () => {
            const newUser = {
                name: "Fenix Fluido Castañeda",
                presentation: "This is my profile :)",
                username: "felixfluidocastaneda",
                password: undefined,
                phoneNumber: "2281234567",
                email: "fenixfluidocastañeda@testing.com",
                birthdate: "2000-09-09",
                verificationCode: "00000000"
            }
            const response = await request(server).post("/accounts/create").send(newUser);
            expect(response.body.errors[0].msg).toContain("password is required");
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/ 400 Bad Request password is too short', async () => {
            const newUser = {
                name: "Fenix Fluido Castañeda",
                presentation: "This is my profile :)",
                username: "felixfluidocastaneda",
                password: "a",
                phoneNumber: "2281234567",
                email: "fenixfluidocastañeda@testing.com",
                birthdate: "2000-09-09",
                verificationCode: "00000000"
            }
            const response = await request(server).post("/accounts/create").send(newUser);
            expect(response.body.errors[0].msg).toContain("password must have the allowed length");
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/ 400 Bad Request password is too long', async () => {
            const newUser = {
                name: "Fenix Fluido Castañeda",
                presentation: "This is my profile :)",
                username: "felixfluidocastaneda",
                password: "asdkfsajpfkaspodfapodfkapokdfpoasdkfaposdkfposadfkspafkspadfksapdfokafasuifjvspcmoasodkfpvdpsfiojsdfgiopjdsmfpoasdfiokasjdfopndocvpijakdfpoidfmsoiakfasdoj",
                phoneNumber: "2281234567",
                email: "fenixfluidocastañeda@testing.com",
                birthdate: "2000-09-09",
                verificationCode: "00000000"
            }
            const response = await request(server).post("/accounts/create").send(newUser);
            expect(response.body.errors[0].msg).toContain("password must have the allowed length");
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/ 400 Bad Request phoneNumber is empty', async () => {
            const newUser = {
                name: "Fenix Fluido Castañeda",
                presentation: "This is my profile :)",
                username: "felixfluidocastaneda",
                password: "hola1234",
                phoneNumber: "",
                email: "fenixfluidocastañeda@testing.com",
                birthdate: "2000-09-09",
                verificationCode: "00000000"
            }
            const response = await request(server).post("/accounts/create").send(newUser);
            expect(response.body.errors[0].msg).toContain("phoneNumber must have the allowed length");
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/ 400 Bad Request phoneNumber is null', async () => {
            const newUser = {
                name: "Fenix Fluido Castañeda",
                presentation: "This is my profile :)",
                username: "felixfluidocastaneda",
                password: "hola1234",
                phoneNumber: null,
                email: "fenixfluidocastañeda@testing.com",
                birthdate: "2000-09-09",
                verificationCode: "00000000"
            }
            const response = await request(server).post("/accounts/create").send(newUser);
            expect(response.body.errors[0].msg).toContain("phoneNumber must have the allowed length");
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/ 400 Bad Request phoneNumber is undefined', async () => {
            const newUser = {
                name: "Fenix Fluido Castañeda",
                presentation: "This is my profile :)",
                username: "felixfluidocastaneda",
                password: "hola1234",
                phoneNumber: undefined,
                email: "fenixfluidocastañeda@testing.com",
                birthdate: "2000-09-09",
                verificationCode: "00000000"
            }
            const response = await request(server).post("/accounts/create").send(newUser);
            expect(response.body.errors[0].msg).toContain("phoneNumber must have the allowed length");
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/ 400 Bad Request phoneNumber is too short', async () => {
            const newUser = {
                name: "Fenix Fluido Castañeda",
                presentation: "This is my profile :)",
                username: "felixfluidocastaneda",
                password: "hola1234",
                phoneNumber: "22",
                email: "fenixfluidocastañeda@testing.com",
                birthdate: "2000-09-09",
                verificationCode: "00000000"
            }
            const response = await request(server).post("/accounts/create").send(newUser);
            expect(response.body.errors[0].msg).toContain("phoneNumber must have the allowed length");
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/ 400 Bad Request phoneNumber is too long', async () => {
            const newUser = {
                name: "Fenix Fluido Castañeda",
                presentation: "This is my profile :)",
                username: "felixfluidocastaneda",
                password: "hola1234",
                phoneNumber: "2202394820394820923423423",
                email: "fenixfluidocastañeda@testing.com",
                birthdate: "2000-09-09",
                verificationCode: "00000000"
            }
            const response = await request(server).post("/accounts/create").send(newUser);
            expect(response.body.errors[0].msg).toContain("phoneNumber must have the allowed length");
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/ 400 Bad Request phoneNumber only digits allowed', async () => {
            const newUser = {
                name: "Fenix Fluido Castañeda",
                presentation: "This is my profile :)",
                username: "felixfluidocastaneda",
                password: "hola1234",
                phoneNumber: "asdfpaiskdfap",
                email: "fenixfluidocastañeda@testing.com",
                birthdate: "2000-09-09",
                verificationCode: "00000000"
            }
            const response = await request(server).post("/accounts/create").send(newUser);
            expect(response.body.errors[0].msg).toContain("phoneNumber must have the allowed characters");
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/ 400 Bad Request email is empty', async () => {
            const newUser = {
                name: "Fenix Fluido Castañeda",
                presentation: "This is my profile :)",
                username: "felixfluidocastaneda",
                password: "hola1234",
                phoneNumber: "2234567890",
                email: "",
                birthdate: "2000-09-09",
                verificationCode: "00000000"
            }
            const response = await request(server).post("/accounts/create").send(newUser);
            expect(response.body.errors[0].msg).toContain("email is required");
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/ 400 Bad Request email is null', async () => {
            const newUser = {
                name: "Fenix Fluido Castañeda",
                presentation: "This is my profile :)",
                username: "felixfluidocastaneda",
                password: "hola1234",
                phoneNumber: "2234567890",
                email: null,
                birthdate: "2000-09-09",
                verificationCode: "00000000"
            }
            const response = await request(server).post("/accounts/create").send(newUser);
            expect(response.body.errors[0].msg).toContain("email is required");
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/ 400 Bad Request email is undefined', async () => {
            const newUser = {
                name: "Fenix Fluido Castañeda",
                presentation: "This is my profile :)",
                username: "felixfluidocastaneda",
                password: "hola1234",
                phoneNumber: "2234567890",
                email: undefined,
                birthdate: "2000-09-09",
                verificationCode: "00000000"
            }
            const response = await request(server).post("/accounts/create").send(newUser);
            expect(response.body.errors[0].msg).toContain("email is required");
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/ 400 Bad Request email is not valid format', async () => {
            const newUser = {
                name: "Fenix Fluido Castañeda",
                presentation: "This is my profile :)",
                username: "felixfluidocastaneda",
                password: "hola1234",
                phoneNumber: "2234567890",
                email: "hola",
                birthdate: "2000-09-09",
                verificationCode: "00000000"
            }
            const response = await request(server).post("/accounts/create").send(newUser);
            expect(response.body.errors[0].msg).toContain("email format is not valid. must have allowed format");
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/ 400 Bad Request email is too long', async () => {
            const newUser = {
                name: "Fenix Fluido Castañeda",
                presentation: "This is my profile :)",
                username: "felixfluidocastaneda",
                password: "hola1234",
                phoneNumber: "2234567890",
                email: "hello@aasdfaasdfkaposdpasodfkpaosdfkpaodkfposadfkpkodfkopsadkfposadfkpsoadfksapodfksapodfkspaofkaspofkdspafokposfapodfkapofapfkosadsfpakpsodfakspofkpofsadfkposakaasdpkfkdpafssamvlkcsvjsofisasaidfpapdfskkafpoaofakpfosadfskafdkpfdakpafaasdfaasdfkaposdpasodfkpaosdfkpaodkfposadfkpkodfkopsadkfposadfkpsoadfksapodfksapodfkspaofkaspofkdspafokposfapodfkapofapfkosadsfpakpsodfakspofkpofsadfkposakaasdpkfkdpafssamvlkcsvjsofisasaidfpapdfskkafpoaofakpfosadfskafdkpfdakpafaasdfaasdfkaposdpasodfkpaosdfkpaodkfposadfkpkodfkopsadkfposadfkpsoadfksapodfksapodfkspaofkaspofkdspafokposfapodfkapofapfkosadsfpakpsodfakspofkpofsadfkposakaasdpkfkdpafssamvlkcsvjsofisasaidfpapdfskkafpoaofakpfosadfskafdkpfdakpaf.com",
                birthdate: "2000-09-09",
                verificationCode: "00000000"
            }
            const response = await request(server).post("/accounts/create").send(newUser);
            expect(response.body.errors[0].msg).toContain("email allowed length");
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/ 400 Bad Request birthday format is not valid', async () => {
            const newUser = {
                name: "Fenix Fluido Castañeda",
                presentation: "This is my profile :)",
                username: "felixfluidocastaneda",
                password: "hola1234",
                phoneNumber: "2234567890",
                email: "fenixfluidocastañeda@hotmail.com",
                birthdate: "200009-09",
                verificationCode: "00000000"
            }
            const response = await request(server).post("/accounts/create").send(newUser);
            expect(response.body.errors[0].msg).toContain("birthday format is invalid, must have the allowed format");
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/ 400 Bad Request birthday format is not valid (/)', async () => {
            const newUser = {
                name: "Fenix Fluido Castañeda",
                presentation: "This is my profile :)",
                username: "felixfluidocastaneda",
                password: "hola1234",
                phoneNumber: "2234567890",
                email: "fenixfluidocastañeda@hotmail.com",
                birthdate: "2000/09/09",
                verificationCode: "00000000"
            }
            const response = await request(server).post("/accounts/create").send(newUser);
            expect(response.body.errors[0].msg).toContain("birthday format is invalid, must have the allowed format");
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/ 400 Bad Request birthday format must be yyyy-mm-dd', async () => {
            const newUser = {
                name: "Fenix Fluido Castañeda",
                presentation: "This is my profile :)",
                username: "felixfluidocastaneda",
                password: "hola1234",
                phoneNumber: "2234567890",
                email: "fenixfluidocastañeda@hotmail.com",
                birthdate: "09-09-2000",
                verificationCode: "00000000"
            }
            const response = await request(server).post("/accounts/create").send(newUser);
            expect(response.body.errors[0].msg).toContain("birthday format is invalid, must have the allowed format");
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/ 400 Bad Request birthday format is not valid (month 13)', async () => {
            const newUser = {
                name: "Fenix Fluido Castañeda",
                presentation: "This is my profile :)",
                username: "felixfluidocastaneda",
                password: "hola1234",
                phoneNumber: "2234567890",
                email: "fenixfluidocastañeda@hotmail.com",
                birthdate: "2000-13-12",
                verificationCode: "00000000"
            }
            const response = await request(server).post("/accounts/create").send(newUser);
            expect(response.body.errors[0].msg).toContain("birthday format is invalid, must have the allowed format");
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/ 400 Bad Request birthday format is not valid (day 32)', async () => {
            const newUser = {
                name: "Fenix Fluido Castañeda",
                presentation: "This is my profile :)",
                username: "felixfluidocastaneda",
                password: "hola1234",
                phoneNumber: "2234567890",
                email: "fenixfluidocastañeda@hotmail.com",
                birthdate: "2000-12-32",
                verificationCode: "00000000"
            }
            const response = await request(server).post("/accounts/create").send(newUser);
            expect(response.body.errors[0].msg).toContain("birthday format is invalid, must have the allowed format");
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/ 400 Bad Request birthday format is not valid (need mm two digits)', async () => {
            const newUser = {
                name: "Fenix Fluido Castañeda",
                presentation: "This is my profile :)",
                username: "felixfluidocastaneda",
                password: "hola1234",
                phoneNumber: "2234567890",
                email: "fenixfluidocastañeda@hotmail.com",
                birthdate: "2000-1-32",
                verificationCode: "00000000"
            }
            const response = await request(server).post("/accounts/create").send(newUser);
            expect(response.body.errors[0].msg).toContain("birthday format is invalid, must have the allowed format");
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/ 400 Bad Request birthday format is not valid (year 0)', async () => {
            const newUser = {
                name: "Fenix Fluido Castañeda",
                presentation: "This is my profile :)",
                username: "felixfluidocastaneda",
                password: "hola1234",
                phoneNumber: "2234567890",
                email: "fenixfluidocastañeda@hotmail.com",
                birthdate: "0-12-32",
                verificationCode: "00000000"
            }
            const response = await request(server).post("/accounts/create").send(newUser);
            expect(response.body.errors[0].msg).toContain("birthday format is invalid, must have the allowed format");
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/ 400 Bad Request birthday format is not valid (month 2 and day 29 not leap-year)', async () => {
            const newUser = {
                name: "Fenix Fluido Castañeda",
                presentation: "This is my profile :)",
                username: "felixfluidocastaneda",
                password: "hola1234",
                phoneNumber: "2234567890",
                email: "fenixfluidocastañeda@hotmail.com",
                birthdate: "2001-02-29",
                verificationCode: "00000000"
            }
            const response = await request(server).post("/accounts/create").send(newUser);
            expect(response.body.errors[0].msg).toContain("birthday does not exist");
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/ 400 Bad Request birthday format is not valid (month 4 april and day 31)', async () => {
            const newUser = {
                name: "Fenix Fluido Castañeda",
                presentation: "This is my profile :)",
                username: "felixfluidocastaneda",
                password: "hola1234",
                phoneNumber: "2234567890",
                email: "fenixfluidocastañeda@hotmail.com",
                birthdate: "2001-04-31",
                verificationCode: "00000000"
            }
            const response = await request(server).post("/accounts/create").send(newUser);
            expect(response.body.errors[0].msg).toContain("birthday does not exist");
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/ 400 Forbidden verificationCode is not valid (need to be generated first)', async () => {
            const newUser = {
                name: "Fenix Fluido Castañeda",
                presentation: "This is my profile :)",
                username: "felixfluidocastaneda",
                password: "hola1234",
                phoneNumber: "2234567890",
                email: "fenixfluidocastañeda@hotmail.com",
                birthdate: "2000-03-31",
                verificationCode: "00000000"
            }
            const response = await request(server).post("/accounts/create").send(newUser);
            expect(response.body.message).toContain("verification code is not valid");
            expect(response.statusCode).toBe(403);
        });
    });

    describe('Test that must pass', () => {
        test('POST /accounts/create/ 200 OK Response For new user', async () => {
            let response = await request(server).post("/accounts/create/verification").send({ "username": "uvgram", "email": "admin@uvgram.com" });
            let { verificationCode } = response.body.message;
            const newUser = {
                name: "UVGram",
                presentation: "Welcome to UVGram.",
                username: "uvgram",
                password: "hola1234",
                phoneNumber: "2212345678",
                email: "admin@uvgram.com",
                birthdate: "2000-01-01",
                verificationCode
            }
            response = await request(server).post("/accounts/create").send(newUser);
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toContain("New entity was added");
        });

        test('POST /accounts/create/ 200 OK Response For another new user', async () => {
            let response = await request(server).post("/accounts/create/verification").send({ "username": "adrianc68", "email": "adrianc68@uvgram.com" });
            let { verificationCode } = response.body.message;
            const newUser = {
                name: "Adrian Garcia",
                presentation: "First user in UVGram",
                username: "adrianc68",
                password: "hola1234",
                phoneNumber: "2212345678",
                email: "adrianc68@uvgram.com",
                birthdate: "2000-01-01",
                verificationCode
            }
            response = await request(server).post("/accounts/create").send(newUser);
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toContain("New entity was added");
        });

        test('POST /accounts/create/ 403 Forbidden username already registered', async () => {
            let response = await request(server).post("/accounts/create/verification").send({ "username": "adrianc68", "email": "adrianc68@uvgram.com" });
            expect(response.body.message.exist).toBe(true);
            expect(response.body.message.message).toContain("username is already registered");
            expect(response.statusCode).toBe(403);
        });

        test('POST /accounts/create/ 403 Forbidden email already registered', async () => {
            let response = await request(server).post("/accounts/create/verification").send({ "username": "test", "email": "adrianc68@uvgram.com" });
            expect(response.body.message.exist).toBe(true);
            expect(response.body.message.message).toContain("email is already registered");
            expect(response.statusCode).toBe(403);
        });
    })
});


afterAll(async () => {
    server.close();
});