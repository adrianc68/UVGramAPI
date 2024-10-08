const request = require('supertest');
const { connetionToServers } = require('../src/app');
const { getVerificationCodeFromEmail, getURLConfirmationFromEmail } = require('../src/dataaccess/mailDataAccess');
const { CategoryType } = require('../src/models/enum/CategoryType');
const { GenderType } = require('../src/models/enum/GenderType');
const { server, delayServerConnections, clearMessagesMailHog, clearDatabase } = require("../src/server")

beforeAll(async () => {
    await delayServerConnections();
    await clearDatabase();
});

afterAll(async () => {
    server.close();
    await clearDatabase();
});

describe('On URL and code generation Test', () => {
    // CAN FAIL BY MAILHOG ENCODING (URL in mailhog add 3D and \n\r )
    let accessToken;
    afterAll(async () => {
        await clearDatabase();
    });

    beforeAll(async () => {
        await clearDatabase();
        let response = await request(server).post("/accounts/create/verification").send({ "username": "uvgram", "email": "uvgram@uvgram.com" });
        let vCode = await getVerificationCodeFromEmail("uvgram@uvgram.com");
        const newUser = {
            name: "uvgram user",
            presentation: "Welcome to UVGram.",
            username: "uvgram",
            password: "hola1234",
            phoneNumber: "2212345678",
            email: "uvgram@uvgram.com",
            birthdate: "2000-01-01",
            verificationCode: vCode
        }
        response = await request(server).post("/accounts/create").send(newUser);
        response = await request(server).post("/authentication/login").send({ "emailOrUsername": "uvgram", "password": "hola1234" });
        accessToken = response.body.data.accessToken;
        response = await request(server).post("/data/region/").send({ "region": "XALAPA" });
        response = await request(server).post("/data/faculty/").send({ "idRegion": "1", "faculty": "FACULTAD_DE_ARQUITECTURA" });
        response = await request(server).post("/data/educationalProgram/").send({ "educationalProgram": "NUTRICION", "idFaculty": "1" });
    });

    beforeEach(async () => {
        // Don't change username on this test or will fail.
        let response = await request(server).post("/authentication/login").send({ "emailOrUsername": "uvgram", "password": "hola1234" });
        accessToken = response.body.data.accessToken;
    })

    describe('POST /accounts/password/reset/confirmation/?:data', () => {
        test('POST /accounts/password/reset/confirmation/?:data 200 OK', async () => {
            let response = await request(server).post("/accounts/password/reset").send({ "emailOrUsername": "uvgram@uvgram.com" });
            let url = await getURLConfirmationFromEmail("uvgram@uvgram.com");
            url = url.substring(url.search("/accounts"))
            response = await request(server).get(url);
            let urlDecoded = response.body.message.redirect;
            urlDecoded = urlDecoded.substring(urlDecoded.search("/accounts"))
            response = await request(server).post(urlDecoded).send({ "password": "hola1234" });
            expect(response.body.message.refreshToken).not.toBeNull();
            expect(response.body.data.accessToken).not.toBeNull();
            expect(response.body.message.isUpdated).toBe(true);
            expect(response.statusCode).toBe(200);
        });
    });

    describe('POST /accounts/verification/url/change_password?:data', () => {
        test('POST /accounts/verification/url/change_password?:data 200 OK', async () => {
            let response = await request(server).post("/accounts/password/reset").send({ "emailOrUsername": "uvgram" });
            let url = await getURLConfirmationFromEmail("uvgram@uvgram.com");
            url = url.substring(url.search("/accounts"));
            response = await request(server).get(url);
            let urlDecoded = response.body.message.redirect;
            urlDecoded = urlDecoded.substring(urlDecoded.search("/accounts"))
            response = await request(server).post(urlDecoded).send({ "password": "hola1234" });
            expect(response.body.message.refreshToken).not.toBeNull();
            expect(response.body.data.accessToken).not.toBeNull();
            expect(response.statusCode).toBe(200);
        });
    });

    describe('POST /accounts/verification/url/confirm_email?:data', () => {
        test('POST /accounts/verification/url/confirm_email?:data 200 OK', async () => {
            let response = await request(server).patch("/accounts/edit/personal").set({ "authorization": `Bearer ${accessToken}` }).send({
                name: "uvgram user",
                presentation: "Welcome to UVGram.",
                username: "uvgram",
                phoneNumber: "2212345678",
                email: "uvgram999@uvgram.com",
                birthdate: "2000-01-01",
                idCareer: 1,
                gender: GenderType.FEMININE
            });
            let url = await getURLConfirmationFromEmail("uvgram999@uvgram.com");
            url = url.substring(url.search("/accounts"));
            response = await request(server).get(url);
            expect(response.body.message.isUpdated).toBe(true);
            expect(response.statusCode).toBe(200);
        });
    });
});

describe('POST /accounts/create/verification', () => {
    describe('Test that must fail', () => {
        test('POST /accounts/create/verifications 404 Resource not found', async () => {
            let response = await request(server).post("/accounts/create/verifications").send({ "userjasfd": "uvgram", "email": "admin@uvgram.com" });
            expect(response.statusCode).toBe(404);
        });

        test('POST /accounts/create/verification 400 Bad Request username is required', async () => {
            let response = await request(server).post("/accounts/create/verification").send({ "userjasfd": "uvgram", "email": "admin@uvgram.com" });
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/verification 400 Bad Request email is required', async () => {
            let response = await request(server).post("/accounts/create/verification").send({ "username": "uvgram", "afsdpk": "admin@uvgram.com" });
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/verification 400 Bad Request username is empty', async () => {
            let response = await request(server).post("/accounts/create/verification").send({ "username": "", "email": "admin@uvgram.com" });
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/verification 400 Bad Request username is null', async () => {
            let response = await request(server).post("/accounts/create/verification").send({ "username": null, "email": "admin@uvgram.com" });
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/verification 400 Bad Request username is undefined ', async () => {
            let response = await request(server).post("/accounts/create/verification").send({ "username": undefined, "email": "admin@uvgram.com" });
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/verification 400 Bad Request email is empty', async () => {
            let response = await request(server).post("/accounts/create/verification").send({ "username": "uvgram", "email": "" });
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/verification 400 Bad Request email is null', async () => {
            let response = await request(server).post("/accounts/create/verification").send({ "username": "uvgram", "email": null });
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/verification 400 Bad Request email is undefined', async () => {
            let response = await request(server).post("/accounts/create/verification").send({ "username": "uvgram", "email": undefined });
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/verification 404 Bad Request on JSON', async () => {
            let response = await request(server).post("/accounts/create/verification").send({ "username": "uvgr\"am", "email": "admin@uvgram.com" });
            expect(response.statusCode).toBe(400);
        });

        test('POST /accounts/create/verification 404 Bad Request on JSON', async () => {
            let response = await request(server).post("/accounts/create/verification").send({ "username": "uvgr\"am", "email": "admin@uvgram.com" });
            expect(response.statusCode).toBe(400);
        });
    });


    describe('Test that must pass', () => {
        test('POST /accounts/create/verification 200 OK Response For new user', async () => {
            let response = await request(server).post("/accounts/create/verification").send({ "username": "ricardolopez", "email": "riclopez@uvgram.com" });
            let verificationCode = await getVerificationCodeFromEmail("riclopez@uvgram.com");
            expect(verificationCode).toHaveLength(8);
            expect(response.statusCode).toBe(200);
        });

        test('POST /accounts/create/verification 403 Forbidden Code already generated should wait 5 minutes', async () => {
            let response = await request(server).post("/accounts/create/verification").send({ "username": "ricardolopez", "email": "riclopez@uvgram.com" });
            expect(response.statusCode).toBe(403);
        });

        test('POST /accounts/create/verification 200 OK Response For another user', async () => {
            let response = await request(server).post("/accounts/create/verification").send({ "username": "robertolopez", "email": "lopezroberto@test.com" });
            expect(response.statusCode).toBe(200);
            let verificationCode = await getVerificationCodeFromEmail("lopezroberto@test.com");
            expect(verificationCode).toHaveLength(8);
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
            let response = await request(server).post("/accounts/creates").send(newUser);
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
            let response = await request(server).post("/accounts/create").send(newUser);
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
            let response = await request(server).post("/accounts/create").send(newUser);
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
            let response = await request(server).post("/accounts/create").send(newUser);
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
            let response = await request(server).post("/accounts/create").send(newUser);
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
            let response = await request(server).post("/accounts/create").send(newUser);
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
            let response = await request(server).post("/accounts/create").send(newUser);
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
            let response = await request(server).post("/accounts/create").send(newUser);
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
            let response = await request(server).post("/accounts/create").send(newUser);
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
            let response = await request(server).post("/accounts/create").send(newUser);
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
            let response = await request(server).post("/accounts/create").send(newUser);
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
            let response = await request(server).post("/accounts/create").send(newUser);
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
            let response = await request(server).post("/accounts/create").send(newUser);
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
            let response = await request(server).post("/accounts/create").send(newUser);
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
            let response = await request(server).post("/accounts/create").send(newUser);
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
            let response = await request(server).post("/accounts/create").send(newUser);
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
            let response = await request(server).post("/accounts/create").send(newUser);
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
            let response = await request(server).post("/accounts/create").send(newUser);
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
            let response = await request(server).post("/accounts/create").send(newUser);
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
            let response = await request(server).post("/accounts/create").send(newUser);
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
            let response = await request(server).post("/accounts/create").send(newUser);
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
            let response = await request(server).post("/accounts/create").send(newUser);
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
            let response = await request(server).post("/accounts/create").send(newUser);
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
            let response = await request(server).post("/accounts/create").send(newUser);
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
            let response = await request(server).post("/accounts/create").send(newUser);
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
            let response = await request(server).post("/accounts/create").send(newUser);
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
            let response = await request(server).post("/accounts/create").send(newUser);
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
            let response = await request(server).post("/accounts/create").send(newUser);
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
            let response = await request(server).post("/accounts/create").send(newUser);
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
            let response = await request(server).post("/accounts/create").send(newUser);
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
            let response = await request(server).post("/accounts/create").send(newUser);
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
            let response = await request(server).post("/accounts/create").send(newUser);
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
            let response = await request(server).post("/accounts/create").send(newUser);
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
            let response = await request(server).post("/accounts/create").send(newUser);
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
            let response = await request(server).post("/accounts/create").send(newUser);
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
            let response = await request(server).post("/accounts/create").send(newUser);
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
            let response = await request(server).post("/accounts/create").send(newUser);
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
            let response = await request(server).post("/accounts/create").send(newUser);
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
            let response = await request(server).post("/accounts/create").send(newUser);
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
            let response = await request(server).post("/accounts/create").send(newUser);
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
            let response = await request(server).post("/accounts/create").send(newUser);
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
            let response = await request(server).post("/accounts/create").send(newUser);
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
            let response = await request(server).post("/accounts/create").send(newUser);
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
            let response = await request(server).post("/accounts/create").send(newUser);
            expect(response.body.message).toContain("verification code is not valid");
            expect(response.statusCode).toBe(403);
        });
    });

    describe('Test that must pass', () => {
        test('POST /accounts/create/ 200 OK Response For new user', async () => {
            let response = await request(server).post("/accounts/create/verification").send({ "username": "uvgram", "email": "admin@uvgram.com" });
            let verificationCode = await getVerificationCodeFromEmail("admin@uvgram.com");
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
            let verificationCode = await getVerificationCodeFromEmail("adrianc68@uvgram.com")
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

        test('POST /accounts/create/ 403 Forbidden verification is not valid (generated but is invalid)', async () => {
            let response = await request(server).post("/accounts/create/verification").send({ "username": "test94", "email": "gonzalocar@uvgram.com" });
            let verificationCode = "12345678"
            const newUser = {
                name: "Gonzalo Carlos",
                presentation: "Other user in UVGram",
                username: "test94",
                password: "hola1234",
                phoneNumber: "2212345678",
                email: "gonzalocar@uvgram.com",
                birthdate: "2000-01-01",
                verificationCode
            }
            response = await request(server).post("/accounts/create").send(newUser);
            expect(response.statusCode).toBe(403);
        });
    })
});

describe('GET /accounts/email/check', () => {
    test('GET /accounts/email/checks 404 Not Found Not Found ', async () => {
        let response = await request(server).get("/accounts/email/checks").send({ "email": "test234232@uvgram.com" });
        expect(response.statusCode).toBe(404);
    });

    test('GET /accounts/email/check 404 Not Found Invalid JSON ', async () => {
        let response = await request(server).get("/accounts/email/check").send({ "emai\"l": "test234232@uvgram.com" });
        expect(response.statusCode).toBe(404);
    });

    test('GET /accounts/email/check 404 Not Found email is required ', async () => {
        let response = await request(server).get("/accounts/email/check").send({ "s": "test234232@uvgram.com" });
        expect(response.statusCode).toBe(404);
    });

    test('GET /accounts/email/check 200 OK email exist', async () => {
        let response = await request(server).post("/accounts/create/verification").send({ "username": "test1000", "email": "test1000@uvgram.com" });
        let verificationCode = await getVerificationCodeFromEmail("test1000@uvgram.com");
        const newUser = {
            name: "Testing",
            presentation: "Welcome to UVGram.",
            username: "test1000",
            password: "hola1234",
            phoneNumber: "2212345678",
            email: "test1000@uvgram.com",
            birthdate: "2000-01-01",
            verificationCode
        }
        response = await request(server).post("/accounts/create").send(newUser);
        response = await request(server).get("/accounts/email/check/" + encodeURIComponent("test1000@uvgram.com")).send();
        expect(response.body.message.exist).toBe(true);
        expect(response.statusCode).toBe(200);
    });

    test('GET /accounts/email/check 200 OK email does not exist', async () => {
        let response = await request(server).get("/accounts/email/check/" + encodeURIComponent("test234232@uvgram.com")).send();
        expect(response.body.message.exist).toBe(false);
        expect(response.statusCode).toBe(200);
    });
});

describe('GET /accounts/username/check', () => {
    test('POST /accounts/username/checks 404 Resource Not Found ', async () => {
        let response = await request(server).get("/accounts/username/checks").send({ "username": "test234232" });
        expect(response.statusCode).toBe(404);
    });

    test('POST /accounts/username/check 200 OK username exist', async () => {
        let response = await request(server).post("/accounts/create/verification").send({ "username": "test88888", "email": "test88888@uvgram.com" });
        let verificationCode = await getVerificationCodeFromEmail("test88888@uvgram.com");
        const newUser = {
            name: "Testing",
            presentation: "Welcome to UVGram.",
            username: "test88888",
            password: "hola1234",
            phoneNumber: "2212345678",
            email: "test88888@uvgram.com",
            birthdate: "2000-01-01",
            verificationCode
        }
        response = await request(server).post("/accounts/create").send(newUser);
        response = await request(server).get("/accounts/username/check/test88888").send();
        expect(response.body.message.exist).toBe(true);
        expect(response.statusCode).toBe(200);
    });

    test('POST /accounts/username/check 200 OK username does not exist', async () => {
        let response = await request(server).get("/accounts/username/check/test3453464").send();
        expect(response.body.message.exist).toBe(false);
        expect(response.statusCode).toBe(200);
    });
});

describe('DEL /accounts/username/delete', () => {
    test('DEL /accounts/username/deletes 404 Resource Not Found ', async () => {
        let response = await request(server).del("/accounts/username/deletes").send({ "username": "test234232" });
        expect(response.statusCode).toBe(404);
    });

    test('DEL /accounts/username/delete 400 Bad Request Invalid JSON ', async () => {
        let response = await request(server).del("/accounts/username/delete").send({ "username\"l": "test234232" });
        expect(response.statusCode).toBe(400);
    });

    test('DEL /accounts/username/delete 400 Bad Request username is required ', async () => {
        let response = await request(server).del("/accounts/username/delete").send({ "s": "test234232" });
        expect(response.statusCode).toBe(400);
    });

    test('DEL /accounts/username/delete 200 400 Bad Request', async () => {
        let response = await request(server).post("/accounts/create/verification").send({ "username": "deleteme", "email": "deleteme@uvgram.com" });
        let verificationCode = await getVerificationCodeFromEmail("deleteme@uvgram.com");
        const newUser = {
            name: "Testing",
            presentation: "Welcome to UVGram.",
            username: "deleteme",
            password: "hola1234",
            phoneNumber: "2212345678",
            email: "deleteme@uvgram.com",
            birthdate: "2000-01-01",
            verificationCode
        }
        response = await request(server).post("/accounts/create").send(newUser);
        response = await request(server).del("/accounts/username/delete").send({ "username": "deleteme" });
        expect(response.body.errors[0].msg).toContain("authorization header is required");
        expect(response.statusCode).toBe(400);
    });

    test('DEL /accounts/username/delete OK 400 Bad Request', async () => {
        let response = await request(server).del("/accounts/username/delete").send({ "username": "test23423" });
        expect(response.body.errors[0].msg).toContain("authorization header is required");

        expect(response.statusCode).toBe(400);
    });
});

describe('GET /accounts/users', () => {
    test('GET /accounts/users 400 Authorization header required', async () => {
        let response = await request(server).post("/accounts/create/verification").send({ "username": "userone", "email": "userone@uvgram.com" });
        let verificationCode = await getVerificationCodeFromEmail("userone@uvgram.com");
        let newUser = {
            name: "Testing",
            presentation: "Welcome to UVGram.",
            username: "userone",
            password: "hola1234",
            phoneNumber: "2212345678",
            email: "userone@uvgram.com",
            birthdate: "2000-01-01",
            verificationCode
        }
        response = await request(server).post("/accounts/create").send(newUser);
        response = await request(server).post("/accounts/create/verification").send({ "username": "usertwo", "email": "usertwo@uvgram.com" });
        let verificationCode2 = await getVerificationCodeFromEmail("usertwo@uvgram.com");
        newUser = {
            name: "Testing",
            presentation: "Welcome to UVGram.",
            username: "usertwo",
            password: "hola1234",
            phoneNumber: "2212345678",
            email: "usertwo@uvgram.com",
            birthdate: "2000-01-01",
            verificationCode: verificationCode2
        }
        response = await request(server).post("/accounts/create").send(newUser);
        response = await request(server).get("/accounts/users").send();
        expect(response.body.errors[0].msg).toContain("authorization header is required");
        expect(response.statusCode).toBe(400);
    });
});

describe('POST /accounts/password/change', () => {
    let accessToken;

    afterAll(async () => {
        await clearDatabase();
    });

    beforeAll(async () => {
        await clearDatabase();
        let response = await request(server).post("/accounts/create/verification").send({ "username": "uvgram", "email": "uvgram@uvgram.com" });
        let vCode = await getVerificationCodeFromEmail("uvgram@uvgram.com");
        const newUser2 = {
            name: "uvgram user",
            presentation: "Welcome to UVGram.",
            username: "uvgram",
            password: "hola1234",
            phoneNumber: "2212345678",
            email: "uvgram@uvgram.com",
            birthdate: "2000-01-01",
            verificationCode: vCode
        }
        response = await request(server).post("/accounts/create").send(newUser2);
        response = await request(server).post("/authentication/login").send({ "emailOrUsername": "uvgram", "password": "hola1234" });
        accessToken = response.body.data.accessToken;
    });

    test('POST /accounts/password/change 404 Resource Not Found', async () => {
        let response = await request(server).post("/accounts/password/changes").send({ "password": "hola1234", "oldPassword": "hola1234", "authorization": `Bearer ${accessToken}` });
        expect(response.statusCode).toBe(404);
    });

    test('POST /accounts/password/change 400 Bad Request password is required', async () => {
        let response = await request(server).post("/accounts/password/change").set({ "authorization": `Bearer ${accessToken}` }).send({ "oldPassword": "hola1234" });
        expect(response.body.errors[0].msg).toContain("password is required")
        expect(response.statusCode).toBe(400);
    });

    test('POST /accounts/password/change 400 Bad Request password is null', async () => {
        let response = await request(server).post("/accounts/password/change").set({ "authorization": `Bearer ${accessToken}` }).send({ "password": null, "oldPassword": "hola1234" });
        expect(response.body.errors[0].msg).toContain("password is required")
        expect(response.statusCode).toBe(400);
    });

    test('POST /accounts/password/change 400 Bad Request password is undefined', async () => {
        let response = await request(server).post("/accounts/password/change").set({ "authorization": `Bearer ${accessToken}` }).send({ "password": undefined, "oldPassword": "hola1234" });
        expect(response.body.errors[0].msg).toContain("password is required")
        expect(response.statusCode).toBe(400);
    });

    test('POST /accounts/password/change 400 Bad Request password is empty', async () => {
        let response = await request(server).post("/accounts/password/change").set({ "authorization": `Bearer ${accessToken}` }).send({ "password": "", "oldPassword": "hola1234" });
        expect(response.body.errors[0].msg).toContain("password is required")
        expect(response.statusCode).toBe(400);
    });

    test('POST /accounts/password/change 400 Bad Request oldPassword is required', async () => {
        let response = await request(server).post("/accounts/password/change").set({ "authorization": `Bearer ${accessToken}` }).send({ "password": "hola1234" });
        expect(response.body.errors[0].msg).toContain("oldPassword is required")
        expect(response.statusCode).toBe(400);
    });

    test('POST /accounts/password/change 400 Bad Request oldPassword is empty', async () => {
        let response = await request(server).post("/accounts/password/change").set({ "authorization": `Bearer ${accessToken}` }).send({ "password": "hola1234", "oldPassword": "" });
        expect(response.body.errors[0].msg).toContain("oldPassword is required")
        expect(response.statusCode).toBe(400);
    });

    test('POST /accounts/password/change 400 Bad Request oldPassword is null', async () => {
        let response = await request(server).post("/accounts/password/change").set({ "authorization": `Bearer ${accessToken}` }).send({ "password": "hola1234", "oldPassword": null });
        expect(response.body.errors[0].msg).toContain("oldPassword is required")
        expect(response.statusCode).toBe(400);
    });

    test('POST /accounts/password/change 400 Bad Request oldPassword is undefined', async () => {
        let response = await request(server).post("/accounts/password/change").set({ "authorization": `Bearer ${accessToken}` }).send({ "password": "hola1234", "oldPassword": undefined });
        expect(response.body.errors[0].msg).toContain("oldPassword is required")
        expect(response.statusCode).toBe(400);
    });

    test('POST /accounts/password/change 200 OK password changed', async () => {
        let response = await request(server).post("/accounts/password/change").set({ "authorization": `Bearer ${accessToken}` }).send({ "password": "hola1234", "oldPassword": "hola1234" });
        expect(response.body.message).toBe(true);
        expect(response.statusCode).toBe(200);
    });

    test('POST /accounts/password/change 401 Unauthorized Bearer token is not valid', async () => {
        let response = await request(server).post("/accounts/password/change").set({ "authorization": `Bearer ${accessToken}s` }).send({ "password": "hola1234", "oldPassword": undefined });
        expect(response.body.message).toContain("You don't have permissions to perform this action!");
        expect(response.statusCode).toBe(401);
    });
});

describe('POST /accounts/password/reset', () => {
    let accessToken;
    let accessToken2;

    afterAll(async () => {
        await clearDatabase();

    });

    beforeAll(async () => {
        await clearDatabase();

        let response = await request(server).post("/accounts/create/verification").send({ "username": "uvgram", "email": "uvgram@uvgram.com" });
        let vCode = await getVerificationCodeFromEmail("uvgram@uvgram.com");
        const newUser = {
            name: "uvgram user",
            presentation: "Welcome to UVGram.",
            username: "uvgram",
            password: "hola1234",
            phoneNumber: "2212345678",
            email: "uvgram@uvgram.com",
            birthdate: "2000-01-01",
            verificationCode: vCode
        }
        response = await request(server).post("/accounts/create").send(newUser);
        response = await request(server).post("/authentication/login").send({ "emailOrUsername": "uvgram", "password": "hola1234" });
        accessToken = response.body.data.accessToken;


        response = await request(server).post("/accounts/create/verification").send({ "username": "uvgram2", "email": "uvgram2@uvgram.com" });
        let verificationCode = await getVerificationCodeFromEmail("uvgram2@uvgram.com");
        const newUser2 = {
            name: "uvgram user",
            presentation: "Welcome to UVGram.",
            username: "uvgram2",
            password: "hola1234",
            phoneNumber: "2212345678",
            email: "uvgram2@uvgram.com",
            birthdate: "2000-01-01",
            verificationCode
        }
        response = await request(server).post("/accounts/create").send(newUser2);
        response = await request(server).post("/authentication/login").send({ "emailOrUsername": "uvgram2", "password": "hola1234" });
        accessToken2 = response.body.data.accessToken;

    });

    test('POST /accounts/password/resets 404 Resource Not Found', async () => {
        let response = await request(server).post("/accounts/password/resets").send({ "emailOrUsername": "test234232" });
        expect(response.statusCode).toBe(404);
    });

    test('POST /accounts/password/reset 400 Bad Request emailOrUsername is required', async () => {
        let response = await request(server).post("/accounts/password/reset").send({});
        expect(response.body.errors[0].msg).toContain("emailOrUsername is required");
        expect(response.statusCode).toBe(400);
    });

    test('POST /accounts/password/reset 400 Bad Request emailOrUsername is empty', async () => {
        let response = await request(server).post("/accounts/password/reset").send({ "emailOrUsername": "" });
        expect(response.body.errors[0].msg).toContain("emailOrUsername is required");
        expect(response.statusCode).toBe(400);
    });

    test('POST /accounts/password/reset 400 Bad Request emailOrUsername is null', async () => {
        let response = await request(server).post("/accounts/password/reset").send({ "emailOrUsername": null });
        expect(response.body.errors[0].msg).toContain("emailOrUsername is required");
        expect(response.statusCode).toBe(400);
    });

    test('POST /accounts/password/reset 400 Bad Request emailOrUsername is undefined', async () => {
        let response = await request(server).post("/accounts/password/reset").send({ "emailOrUsername": undefined });
        expect(response.body.errors[0].msg).toContain("emailOrUsername is required");
        expect(response.statusCode).toBe(400);
    });

    test('POST /accounts/password/reset 200 OK generated confirmation address by username', async () => {
        let response = await request(server).post("/accounts/password/reset").send({ "emailOrUsername": "uvgram" });
        expect(response.body.message).toContain("a confirmation address has been sent to the new email");
        expect(response.statusCode).toBe(200);
    });

    test('POST /accounts/password/reset 200 OK generated confirmation address by email', async () => {
        let response = await request(server).post("/accounts/password/reset").send({ "emailOrUsername": "uvgram2@uvgram.com" });
        expect(response.body.message).toContain("a confirmation address has been sent to the new email");
        expect(response.statusCode).toBe(200);
    });

    test('POST /accounts/password/reset 200 OK can not generate a new confirmation address after 1 generated', async () => {
        let response = await request(server).post("/accounts/password/reset").send({ "emailOrUsername": "uvgram2@uvgram.com" });
        expect(response.body.message).toContain("please wait 5 minutes");
        expect(response.statusCode).toBe(403);
    });

    test('POST /accounts/password/reset 403 Forbidden username does not exist', async () => {
        let response = await request(server).post("/accounts/password/reset").send({ "emailOrUsername": "uvgram99" });
        expect(response.body.message).toContain("username does not exist");
        expect(response.statusCode).toBe(403);
    });

    test('POST /accounts/password/reset 403 Forbidden email does not exist', async () => {
        let response = await request(server).post("/accounts/password/reset").send({ "emailOrUsername": "uvgram999@uvgram.com" });
        expect(response.body.message).toContain("username does not exist");
        expect(response.statusCode).toBe(403);
    });
});

describe('PATCH /accounts/edit/admin', () => {
    let accessToken;
    afterAll(async () => {
        await clearDatabase();
    });

    beforeAll(async () => {
        await clearDatabase();
        let response = await request(server).post("/accounts/create/verification").send({ "username": "uvgram", "email": "uvgram@uvgram.com" });
        let vCode = await getVerificationCodeFromEmail("uvgram@uvgram.com");
        const newUser = {
            name: "uvgram user",
            presentation: "Welcome to UVGram.",
            username: "uvgram",
            password: "hola1234",
            phoneNumber: "2212345678",
            email: "uvgram@uvgram.com",
            birthdate: "2000-01-01",
            verificationCode: vCode
        }
        response = await request(server).post("/accounts/create").send(newUser);
        response = await request(server).post("/accounts/users/roles/change").send({ "key": "+jWfhIusDKBwUN6IhnPeAkAFur+5DRzS99GJknMMeS19YpNNCO9Ycfo28tG+XcG4", "emailOrUsername": "uvgram", "newRoleType": "administrador" });
        response = await request(server).post("/authentication/login").send({ "emailOrUsername": "uvgram", "password": "hola1234" });
        accessToken = response.body.data.accessToken;
    });

    test('PATCH /accounts/edit/admins 404 Resource Not Found', async () => {
        let response = await request(server).post("/accounts/edit/admins").send({
            "name": "Administrator",
            "presentation": null,
            "username": "uvgram1",
            "phoneNumber": "2283687920",
            "email": "uvgram1@uvgram.com",
            "birthdate": "2022-01-26"
        });
        expect(response.statusCode).toBe(404);
    });

    test('PATCH /accounts/edit/admin 200 OK update name', async () => {
        let response = await request(server).patch("/accounts/edit/admin").set({ "authorization": `Bearer ${accessToken}` }).send({
            name: "Administrator",
            presentation: "Welcome to UVGram.",
            username: "uvgram",
            phoneNumber: "2212345678",
            email: "uvgram@uvgram.com",
            birthdate: "2000-01-01",
        });
        expect(response.body.message.isUpdated).toBe(true);
        expect(response.statusCode).toBe(200);
    });

    test('PATCH /accounts/edit/admin 200 OK update presentation', async () => {
        let response = await request(server).patch("/accounts/edit/admin").set({ "authorization": `Bearer ${accessToken}` }).send({
            name: "Administrator",
            presentation: "I am new administrator",
            username: "uvgram",
            phoneNumber: "2212345678",
            email: "uvgram@uvgram.com",
            birthdate: "2000-01-01",
        });
        expect(response.body.message.isUpdated).toBe(true);
        expect(response.statusCode).toBe(200);
    });

    test('PATCH /accounts/edit/admin 200 OK update username', async () => {
        let response = await request(server).patch("/accounts/edit/admin").set({ "authorization": `Bearer ${accessToken}` }).send({
            name: "Administrator",
            presentation: "I am new administrator",
            username: "administrator",
            phoneNumber: "2212345678",
            email: "uvgram@uvgram.com",
            birthdate: "2000-01-01",
        });
        expect(response.body.message.isUpdated).toBe(true);
        expect(response.statusCode).toBe(200);
    });

    test('PATCH /accounts/edit/admin 200 OK update phoneNumber', async () => {
        let response = await request(server).patch("/accounts/edit/admin").set({ "authorization": `Bearer ${accessToken}` }).send({
            name: "Administrator",
            presentation: "I am new administrator",
            username: "administrator",
            phoneNumber: "23420394823490",
            email: "uvgram@uvgram.com",
            birthdate: "2000-01-01",
        });
        expect(response.body.message.isUpdated).toBe(true);
        expect(response.statusCode).toBe(200);
    });

    test('PATCH /accounts/edit/admin 200 OK update email', async () => {
        let response = await request(server).patch("/accounts/edit/admin").set({ "authorization": `Bearer ${accessToken}` }).send({
            name: "Administrator",
            presentation: "I am new administrator",
            username: "administrator",
            phoneNumber: "2212345678",
            email: "administrator@uvgram.com",
            birthdate: "2000-01-01",
        });
        expect(response.body.message.emailMessage).toContain("a confirmation address has been sent to the new email");
        expect(response.body.message.isUpdated).toBe(true);
        expect(response.statusCode).toBe(200);
    });

    test('PATCH /accounts/edit/admin 200 OK update birthdate with differente email', async () => {
        let response = await request(server).patch("/accounts/edit/admin").set({ "authorization": `Bearer ${accessToken}` }).send({
            name: "Administrator",
            presentation: "I am new administrator",
            username: "administrator",
            phoneNumber: "2212345678",
            email: "administrator@uvgram.com",
            birthdate: "2000-01-02",
        });
        expect(response.body.message.emailMessage).toContain("please wait 5 minutes to generate another confirmation address");
        expect(response.body.message.isUpdated).toBe(true);
        expect(response.statusCode).toBe(200);
    });

    test('PATCH /accounts/edit/admin 200 OK update birthdate', async () => {
        let response = await request(server).patch("/accounts/edit/admin").set({ "authorization": `Bearer ${accessToken}` }).send({
            name: "Administrator",
            presentation: "I am new administrator",
            username: "administrator",
            phoneNumber: "2212345678",
            email: "uvgram@uvgram.com",
            birthdate: "2000-01-02",
        });
        expect(response.body.message.emailMessage).toBeUndefined();
        expect(response.body.message.isUpdated).toBe(true);
        expect(response.statusCode).toBe(200);
    });
});

describe('PATCH /accounts/edit/moderator', () => {
    let accessToken;
    afterAll(async () => {
        await clearDatabase();
    });

    beforeAll(async () => {
        await clearDatabase();
        let response = await request(server).post("/accounts/create/verification").send({ "username": "uvgram2", "email": "uvgram2@uvgram.com" });
        let verificationCode = await getVerificationCodeFromEmail("uvgram2@uvgram.com");
        const newUser2 = {
            name: "uvgram user",
            presentation: "Welcome to UVGram.",
            username: "uvgram2",
            password: "hola1234",
            phoneNumber: "2212345678",
            email: "uvgram2@uvgram.com",
            birthdate: "2000-01-01",
            verificationCode
        }
        response = await request(server).post("/accounts/create").send(newUser2);
        response = await request(server).post("/accounts/users/roles/change").send({ "key": "+jWfhIusDKBwUN6IhnPeAkAFur+5DRzS99GJknMMeS19YpNNCO9Ycfo28tG+XcG4", "emailOrUsername": "uvgram2", "newRoleType": "moderador" });
        response = await request(server).post("/authentication/login").send({ "emailOrUsername": "uvgram2", "password": "hola1234" });
        accessToken = response.body.data.accessToken;
    });

    test('PATCH /accounts/edit/moderator 404 Resource Not Found', async () => {
        let response = await request(server).post("/accounts/edit/moderators").send({
            name: "uvgram user",
            presentation: "Welcome to UVGram.",
            username: "uvgram2",
            phoneNumber: "2212345678",
            email: "uvgram2@uvgram.com",
            birthdate: "2000-01-01",
        });
        expect(response.statusCode).toBe(404);
    });

    test('PATCH /accounts/edit/moderator 200 OK update name', async () => {
        let response = await request(server).patch("/accounts/edit/moderator").set({ "authorization": `Bearer ${accessToken}` }).send({
            name: "moderator",
            presentation: "Welcome to UVGram.",
            username: "uvgram2",
            phoneNumber: "2212345678",
            email: "uvgram2@uvgram.com",
            birthdate: "2000-01-01",
        });
        expect(response.body.message.isUpdated).toBe(true);
        expect(response.statusCode).toBe(200);
    });

    test('PATCH /accounts/edit/moderator 200 OK update presentation', async () => {
        let response = await request(server).patch("/accounts/edit/moderator").set({ "authorization": `Bearer ${accessToken}` }).send({
            name: "moderator",
            presentation: "Now iam a moderator.",
            username: "uvgram2",
            phoneNumber: "2212345678",
            email: "uvgram2@uvgram.com",
            birthdate: "2000-01-01",
        });
        expect(response.body.message.isUpdated).toBe(true);
        expect(response.statusCode).toBe(200);
    });

    test('PATCH /accounts/edit/moderator 200 OK update username', async () => {
        let response = await request(server).patch("/accounts/edit/moderator").set({ "authorization": `Bearer ${accessToken}` }).send({
            name: "moderator",
            presentation: "Now iam a moderator.",
            username: "moderator",
            phoneNumber: "2212345678",
            email: "uvgram2@uvgram.com",
            birthdate: "2000-01-01",
        });
        expect(response.body.message.isUpdated).toBe(true);
        expect(response.statusCode).toBe(200);
    });

    test('PATCH /accounts/edit/moderator 200 OK update phoneNumber', async () => {
        let response = await request(server).patch("/accounts/edit/moderator").set({ "authorization": `Bearer ${accessToken}` }).send({
            name: "moderator",
            presentation: "Now iam a moderator.",
            username: "moderator",
            phoneNumber: "2212345668",
            email: "uvgram2@uvgram.com",
            birthdate: "2000-01-01",
        });
        expect(response.body.message.isUpdated).toBe(true);
        expect(response.statusCode).toBe(200);
    });

    test('PATCH /accounts/edit/moderator 200 OK update email', async () => {
        let response = await request(server).patch("/accounts/edit/moderator").set({ "authorization": `Bearer ${accessToken}` }).send({
            name: "moderator",
            presentation: "Now iam a moderator.",
            username: "moderator",
            phoneNumber: "2212345668",
            email: "moderator@uvgram.com",
            birthdate: "2000-01-01",
        });
        expect(response.body.message.emailMessage).toContain("a confirmation address has been sent to the new email");
        expect(response.body.message.isUpdated).toBe(true);
        expect(response.statusCode).toBe(200);
    });

    test('PATCH /accounts/edit/moderator 200 OK update birthdate with differente email', async () => {
        let response = await request(server).patch("/accounts/edit/moderator").set({ "authorization": `Bearer ${accessToken}` }).send({
            name: "moderator",
            presentation: "Now iam a moderator.",
            username: "moderator",
            phoneNumber: "2212345668",
            email: "moderator@uvgram.com",
            birthdate: "2002-10-12",
        });
        expect(response.body.message.emailMessage).toContain("please wait 5 minutes to generate another confirmation address");
        expect(response.body.message.isUpdated).toBe(true);
        expect(response.statusCode).toBe(200);
    });

    test('PATCH /accounts/edit/moderator 200 OK update birthdate with actual email', async () => {
        let response = await request(server).patch("/accounts/edit/moderator").set({ "authorization": `Bearer ${accessToken}` }).send({
            name: "moderator",
            presentation: "Now iam a moderator.",
            username: "moderator",
            phoneNumber: "2212345668",
            email: "uvgram2@uvgram.com",
            birthdate: "2000-01-01",
        });
        expect(response.body.message.emailMessage).toBeUndefined();
        expect(response.body.message.isUpdated).toBe(true);
        expect(response.statusCode).toBe(200);
    });
});

describe('PATCH /accounts/edit/business', () => {
    let accessToken;
    afterAll(async () => {
        await clearDatabase();
    });

    beforeAll(async () => {
        await clearDatabase();
        let response = await request(server).post("/accounts/create/verification").send({ "username": "uvgram3", "email": "uvgram3@uvgram.com" });
        let vCode3 = await getVerificationCodeFromEmail("uvgram3@uvgram.com");
        const newUser3 = {
            name: "uvgram user",
            presentation: "Welcome to UVGram.",
            username: "uvgram3",
            password: "hola1234",
            phoneNumber: "2212345678",
            email: "uvgram3@uvgram.com",
            birthdate: "2000-01-01",
            verificationCode: vCode3
        }
        response = await request(server).post("/accounts/create").send(newUser3);
        response = await request(server).post("/accounts/users/roles/change").send({ "key": "+jWfhIusDKBwUN6IhnPeAkAFur+5DRzS99GJknMMeS19YpNNCO9Ycfo28tG+XcG4", "emailOrUsername": "uvgram3", "newRoleType": "empresarial" });
        response = await request(server).post("/authentication/login").send({ "emailOrUsername": "uvgram3", "password": "hola1234" });
        accessToken = response.body.data.accessToken;

    });

    test('PATCH /accounts/edit/business 404 Resource Not Found', async () => {
        let response = await request(server).post("/accounts/edit/businesss").send({
            "name": "UVGram testing business",
            "presentation": null,
            "username": "uvgram",
            "phoneNumber": "2283687920",
            "email": "admin@uvgram.com",
            "birthdate": "2022-01-26",
            "category": "PRODUCTO_O_SERVICIO",
            "city": "Xalapa",
            "postalCode": "91190",
            "contactEmail": "negocio@uvgram.com",
            "phoneContact": "2294506920",
            "organizationName": "El Mejor Negocio de Pizzas"
        });
        expect(response.statusCode).toBe(404);
    });

    test('PATCH /accounts/edit/business 200 OK update name and add business data', async () => {
        let response = await request(server).patch("/accounts/edit/business").set({ "authorization": `Bearer ${accessToken}` }).send({
            name: "Business",
            presentation: null,
            username: "uvgram3",
            phoneNumber: "2212345678",
            email: "uvgram3@uvgram.com",
            birthdate: "2000-01-01",
            category: "PRODUCTO_O_SERVICIO",
            city: "Xalapa",
            postalCode: "91190",
            postalAddress: "Mexico",
            contactEmail: "uvgram3@uvgram.com",
            phoneContact: "2294506920",
            organizationName: "El Mejor Negocio de Pizzas"
        });
        expect(response.body.message.isUpdated).toBe(true);
        expect(response.statusCode).toBe(200);
    });

    test('PATCH /accounts/edit/business 200 OK update presentation', async () => {
        let response = await request(server).patch("/accounts/edit/business").set({ "authorization": `Bearer ${accessToken}` }).send({
            name: "Business",
            presentation: "Nueva presentacion",
            username: "uvgram3",
            phoneNumber: "2212345678",
            email: "uvgram3@uvgram.com",
            birthdate: "2000-01-01",
            category: "PRODUCTO_O_SERVICIO",
            city: "Xalapa",
            postalCode: "91190",
            postalAddress: "Mexico",
            contactEmail: "uvgram3@uvgram.com",
            phoneContact: "2294506920",
            organizationName: "El Mejor Negocio de Pizzas"
        });
        expect(response.body.message.isUpdated).toBe(true);
        expect(response.statusCode).toBe(200);
    });

    test('PATCH /accounts/edit/business 200 OK update username', async () => {
        let response = await request(server).patch("/accounts/edit/business").set({ "authorization": `Bearer ${accessToken}` }).send({
            name: "Business",
            presentation: null,
            username: "business",
            phoneNumber: "2212345678",
            email: "uvgram3@uvgram.com",
            birthdate: "2000-01-01",
            category: "PRODUCTO_O_SERVICIO",
            city: "Xalapa",
            postalCode: "91190",
            postalAddress: "Mexico",
            contactEmail: "uvgram3@uvgram.com",
            phoneContact: "2294506920",
            organizationName: "El Mejor Negocio de Pizzas"
        });
        expect(response.body.message.isUpdated).toBe(true);
        expect(response.statusCode).toBe(200);
    });

    test('PATCH /accounts/edit/business 200 OK update phoneNumber', async () => {
        let response = await request(server).patch("/accounts/edit/business").set({ "authorization": `Bearer ${accessToken}` }).send({
            name: "Business",
            presentation: null,
            username: "business",
            phoneNumber: "2212345678",
            email: "uvgram3@uvgram.com",
            birthdate: "2000-01-01",
            category: "PRODUCTO_O_SERVICIO",
            city: "Xalapa",
            postalCode: "91190",
            postalAddress: "Mexico",
            contactEmail: "uvgram3@uvgram.com",
            phoneContact: "2294506920",
            organizationName: "El Mejor Negocio de Pizzas"
        });
        expect(response.body.message.isUpdated).toBe(true);
        expect(response.statusCode).toBe(200);
    });

    test('PATCH /accounts/edit/business 200 OK update email', async () => {
        let response = await request(server).patch("/accounts/edit/business").set({ "authorization": `Bearer ${accessToken}` }).send({
            name: "Business",
            presentation: null,
            username: "business",
            phoneNumber: "2212345678",
            email: "business@uvgram.com",
            birthdate: "2000-01-01",
            category: "PRODUCTO_O_SERVICIO",
            city: "Xalapa",
            postalCode: "91190",
            postalAddress: "Mexico",
            contactEmail: "uvgram3@uvgram.com",
            phoneContact: "2294506920",
            organizationName: "El Mejor Negocio de Pizzas"
        });
        expect(response.body.message.emailMessage).toContain("a confirmation address has been sent to the new email");
        expect(response.body.message.isUpdated).toBe(true);
        expect(response.statusCode).toBe(200);
    });

    test('PATCH /accounts/edit/business 200 OK update birthdate with differente email', async () => {
        let response = await request(server).patch("/accounts/edit/business").set({ "authorization": `Bearer ${accessToken}` }).send({
            name: "Business",
            presentation: null,
            username: "business",
            phoneNumber: "2212345678",
            email: "business@uvgram.com",
            birthdate: "2010-09-09",
            category: "PRODUCTO_O_SERVICIO",
            city: "Xalapa",
            postalCode: "91190",
            postalAddress: "Mexico",
            contactEmail: "uvgram3@uvgram.com",
            phoneContact: "2294506920",
            organizationName: "El Mejor Negocio de Pizzas"
        });
        expect(response.body.message.emailMessage).toContain("please wait 5 minutes to generate another confirmation address");
        expect(response.body.message.isUpdated).toBe(true);
        expect(response.statusCode).toBe(200);
    });

    test('PATCH /accounts/edit/business 200 OK update birthdate with actual email', async () => {
        let response = await request(server).patch("/accounts/edit/business").set({ "authorization": `Bearer ${accessToken}` }).send({
            name: "Business",
            presentation: null,
            username: "business",
            phoneNumber: "2212345678",
            email: "uvgram3@uvgram.com",
            birthdate: "2010-09-09",
            category: "PRODUCTO_O_SERVICIO",
            city: "Xalapa",
            postalCode: "91190",
            postalAddress: "Mexico",
            contactEmail: "uvgram3@uvgram.com",
            phoneContact: "2294506920",
            organizationName: "El Mejor Negocio de Pizzas"
        });
        expect(response.body.message.emailMessage).toBeUndefined();
        expect(response.body.message.isUpdated).toBe(true);
        expect(response.statusCode).toBe(200);
    });

    test('PATCH /accounts/edit/business 200 OK update category with actual email', async () => {
        let response = await request(server).patch("/accounts/edit/business").set({ "authorization": `Bearer ${accessToken}` }).send({
            name: "Business",
            presentation: null,
            username: "business",
            phoneNumber: "2212345678",
            email: "uvgram3@uvgram.com",
            birthdate: "2010-09-09",
            category: CategoryType.GROCERY_STORES,
            city: "Xalapa",
            postalCode: "91190",
            postalAddress: "Mexico",
            contactEmail: "uvgram3@uvgram.com",
            phoneContact: "2294506920",
            organizationName: "El Mejor Negocio de Pizzas"
        });
        expect(response.body.message.emailMessage).toBeUndefined();
        expect(response.body.message.isUpdated).toBe(true);
        expect(response.statusCode).toBe(200);
    });

    test('PATCH /accounts/edit/business 200 OK update city with actual email', async () => {
        let response = await request(server).patch("/accounts/edit/business").set({ "authorization": `Bearer ${accessToken}` }).send({
            name: "Business",
            presentation: null,
            username: "business",
            phoneNumber: "2212345678",
            email: "uvgram3@uvgram.com",
            birthdate: "2010-09-09",
            category: CategoryType.GROCERY_STORES,
            city: "Veracruz",
            postalCode: "91190",
            postalAddress: "Mexico",
            contactEmail: "uvgram3@uvgram.com",
            phoneContact: "2294506920",
            organizationName: "El Mejor Negocio de Pizzas"
        });
        expect(response.body.message.emailMessage).toBeUndefined();
        expect(response.body.message.isUpdated).toBe(true);
        expect(response.statusCode).toBe(200);
    });

    test('PATCH /accounts/edit/business 200 OK update postalcode with actual email', async () => {
        let response = await request(server).patch("/accounts/edit/business").set({ "authorization": `Bearer ${accessToken}` }).send({
            name: "Business",
            presentation: null,
            username: "business",
            phoneNumber: "2212345678",
            email: "uvgram3@uvgram.com",
            birthdate: "2010-09-09",
            category: CategoryType.GROCERY_STORES,
            city: "Veracruz",
            postalCode: "91180",
            postalAddress: "Mexico",
            contactEmail: "uvgram3@uvgram.com",
            phoneContact: "2294506920",
            organizationName: "El Mejor Negocio de Pizzas"
        });
        expect(response.body.message.emailMessage).toBeUndefined();
        expect(response.body.message.isUpdated).toBe(true);
        expect(response.statusCode).toBe(200);
    });

    test('PATCH /accounts/edit/business 200 OK update contactEmail with actual email', async () => {
        let response = await request(server).patch("/accounts/edit/business").set({ "authorization": `Bearer ${accessToken}` }).send({
            name: "Business",
            presentation: null,
            username: "business",
            phoneNumber: "2212345678",
            email: "uvgram3@uvgram.com",
            birthdate: "2010-09-09",
            category: CategoryType.GROCERY_STORES,
            city: "Veracruz",
            postalCode: "91180",
            postalAddress: "Mexico",
            contactEmail: "contactmetobusiness@uvgram.com",
            phoneContact: "2294506920",
            organizationName: "El Mejor Negocio de Pizzas"
        });
        expect(response.body.message.emailMessage).toBeUndefined();
        expect(response.body.message.isUpdated).toBe(true);
        expect(response.statusCode).toBe(200);
    });

    test('PATCH /accounts/edit/business 200 OK update phoneContact with actual email', async () => {
        let response = await request(server).patch("/accounts/edit/business").set({ "authorization": `Bearer ${accessToken}` }).send({
            name: "Business",
            presentation: null,
            username: "business",
            phoneNumber: "2212345678",
            email: "uvgram3@uvgram.com",
            birthdate: "2010-09-09",
            category: CategoryType.GROCERY_STORES,
            city: "Veracruz",
            postalCode: "91180",
            postalAddress: "Mexico",
            contactEmail: "contactmetobusiness@uvgram.com",
            phoneContact: "2256453479",
            organizationName: "El Mejor Negocio de Pizzas"
        });
        expect(response.body.message.emailMessage).toBeUndefined();
        expect(response.body.message.isUpdated).toBe(true);
        expect(response.statusCode).toBe(200);
    });

    test('PATCH /accounts/edit/business 200 OK update organizationName with actual email', async () => {
        let response = await request(server).patch("/accounts/edit/business").set({ "authorization": `Bearer ${accessToken}` }).send({
            name: "Business",
            presentation: null,
            username: "business",
            phoneNumber: "2212345678",
            email: "uvgram3@uvgram.com",
            birthdate: "2010-09-09",
            category: CategoryType.GROCERY_STORES,
            city: "Veracruz",
            postalCode: "91180",
            postalAddress: "Mexico",
            contactEmail: "contactmetobusiness@uvgram.com",
            phoneContact: "2256453479",
            organizationName: "Las hamburguesas de Tlahuac"
        });
        expect(response.body.message.emailMessage).toBeUndefined();
        expect(response.body.message.isUpdated).toBe(true);
        expect(response.statusCode).toBe(200);
    });
});

describe('PATCH /accounts/edit/personal', () => {
    let accessToken;
    afterAll(async () => {
        await clearDatabase();
    });

    beforeAll(async () => {
        await clearDatabase();
        let response = await request(server).post("/accounts/create/verification").send({ "username": "uvgram2", "email": "uvgram2@uvgram.com" });
        let verificationCode = await getVerificationCodeFromEmail("uvgram2@uvgram.com");
        const newUser2 = {
            name: "uvgram user",
            presentation: "Welcome to UVGram.",
            username: "uvgram2",
            password: "hola1234",
            phoneNumber: "2212345678",
            email: "uvgram2@uvgram.com",
            birthdate: "2000-01-01",
            verificationCode
        }
        response = await request(server).post("/accounts/create").send(newUser2);
        response = await request(server).post("/authentication/login").send({ "emailOrUsername": "uvgram2", "password": "hola1234" });
        accessToken = response.body.data.accessToken;
        response = await request(server).post("/data/region/").send({ "region": "XALAPA" });
        response = await request(server).post("/data/faculty/").send({ "idRegion": "1", "faculty": "FACULTAD_DE_ARQUITECTURA" });
        response = await request(server).post("/data/educationalProgram/").send({ "educationalProgram": "NUTRICION", "idFaculty": "1" });
        response = await request(server).post("/data/educationalProgram/").send({ "educationalProgram": "DERECHO", "idFaculty": "1" });
    });

    test('PATCH /accounts/edit/personal 404 Resource Not Found', async () => {
        let response = await request(server).post("/accounts/edit/personals").send({
            name: "uvgram user",
            presentation: "Welcome to UVGram.",
            username: "uvgram2",
            phoneNumber: "2212345678",
            email: "uvgram2@uvgram.com",
            birthdate: "2000-01-01",
        });
        expect(response.statusCode).toBe(404);
    });

    test('PATCH /accounts/edit/personal 200 OK update name', async () => {
        let response = await request(server).patch("/accounts/edit/personal").set({ "authorization": `Bearer ${accessToken}` }).send({
            name: "Personal User",
            presentation: "Welcome to UVGram.",
            username: "uvgram2",
            phoneNumber: "2212345678",
            email: "uvgram2@uvgram.com",
            birthdate: "2000-01-01",
            gender: GenderType.MALE,
            idCareer: "1"
        });
        expect(response.body.message.isUpdated).toBe(true);
        expect(response.statusCode).toBe(200);
    });

    test('PATCH /accounts/edit/personal 200 OK update presentation', async () => {
        let response = await request(server).patch("/accounts/edit/personal").set({ "authorization": `Bearer ${accessToken}` }).send({
            name: "Personal User",
            presentation: "Welcome to my personal uvgram",
            username: "uvgram2",
            phoneNumber: "2212345678",
            email: "uvgram2@uvgram.com",
            birthdate: "2000-01-01",
            gender: GenderType.MALE,
            idCareer: "1"
        });
        expect(response.body.message.isUpdated).toBe(true);
        expect(response.statusCode).toBe(200);
    });

    test('PATCH /accounts/edit/personal 200 OK update username', async () => {
        let response = await request(server).patch("/accounts/edit/personal").set({ "authorization": `Bearer ${accessToken}` }).send({
            name: "Personal User",
            presentation: "Welcome to my personal uvgram",
            username: "personal",
            phoneNumber: "2212345678",
            email: "uvgram2@uvgram.com",
            birthdate: "2000-01-01",
            gender: GenderType.MALE,
            idCareer: "1"
        });
        expect(response.body.message.isUpdated).toBe(true);
        expect(response.statusCode).toBe(200);
    });

    test('PATCH /accounts/edit/personal 200 OK update phoneNumber', async () => {
        let response = await request(server).patch("/accounts/edit/personal").set({ "authorization": `Bearer ${accessToken}` }).send({
            name: "Personal User",
            presentation: "Welcome to my personal uvgram",
            username: "personal",
            phoneNumber: "224930493",
            email: "uvgram2@uvgram.com",
            birthdate: "2000-01-01",
            gender: GenderType.MALE,
            idCareer: "1"
        });
        expect(response.body.message.isUpdated).toBe(true);
        expect(response.statusCode).toBe(200);
    });

    test('PATCH /accounts/edit/personal 200 OK update email', async () => {
        let response = await request(server).patch("/accounts/edit/personal").set({ "authorization": `Bearer ${accessToken}` }).send({
            name: "Personal User",
            presentation: "Welcome to my personal uvgram",
            username: "personal",
            phoneNumber: "2212345678",
            email: "personal@uvgram.com",
            birthdate: "2000-01-01",
            gender: GenderType.MALE,
            idCareer: "1"
        });
        expect(response.body.message.emailMessage).toContain("a confirmation address has been sent to the new email");
        expect(response.body.message.isUpdated).toBe(true);
        expect(response.statusCode).toBe(200);
    });

    test('PATCH /accounts/edit/personal 200 OK update birthdate with differente email', async () => {
        let response = await request(server).patch("/accounts/edit/personal").set({ "authorization": `Bearer ${accessToken}` }).send({
            name: "Personal User",
            presentation: "Welcome to my personal uvgram",
            username: "personal",
            phoneNumber: "2212345678",
            email: "personal@uvgram.com",
            birthdate: "2020-01-01",
            gender: GenderType.MALE,
            idCareer: "1"
        });
        expect(response.body.message.emailMessage).toContain("please wait 5 minutes to generate another confirmation address");
        expect(response.body.message.isUpdated).toBe(true);
        expect(response.statusCode).toBe(200);
    });

    test('PATCH /accounts/edit/personal 200 OK update birthdate with actual email', async () => {
        let response = await request(server).patch("/accounts/edit/personal").set({ "authorization": `Bearer ${accessToken}` }).send({
            name: "Personal User",
            presentation: "Welcome to my personal uvgram",
            username: "personal",
            phoneNumber: "2212345678",
            email: "uvgram2@uvgram.com",
            birthdate: "2000-01-01",
            gender: GenderType.MALE,
            idCareer: "1"
        });
        expect(response.body.message.emailMessage).toBeUndefined();
        expect(response.body.message.isUpdated).toBe(true);
        expect(response.statusCode).toBe(200);
    });

    test('PATCH /accounts/edit/personal 200 OK update gender with actual email', async () => {
        let response = await request(server).patch("/accounts/edit/personal").set({ "authorization": `Bearer ${accessToken}` }).send({
            name: "Personal User",
            presentation: "Welcome to my personal uvgram",
            username: "personal",
            phoneNumber: "2212345678",
            email: "uvgram2@uvgram.com",
            birthdate: "2000-01-01",
            gender: GenderType.FEMININE,
            idCareer: "1"
        });
        expect(response.body.message.emailMessage).toBeUndefined();
        expect(response.body.message.isUpdated).toBe(true);
        expect(response.statusCode).toBe(200);
    });

    test('PATCH /accounts/edit/personal 200 OK update career with actual email', async () => {
        let response = await request(server).patch("/accounts/edit/personal").set({ "authorization": `Bearer ${accessToken}` }).send({
            name: "Personal User",
            presentation: "Welcome to my personal uvgram",
            username: "personal",
            phoneNumber: "2212345678",
            email: "uvgram2@uvgram.com",
            birthdate: "2000-01-01",
            gender: GenderType.FEMININE,
            idCareer: "2"
        });
        expect(response.body.message.emailMessage).toBeUndefined();
        expect(response.body.message.isUpdated).toBe(true);
        expect(response.statusCode).toBe(200);
    });
});

describe('POST /accounts/users/roles/change', () => {
    let accessToken;
    afterAll(async () => {
        await clearDatabase();
    });

    beforeAll(async () => {
        await clearDatabase();
        let response = await request(server).post("/accounts/create/verification").send({ "username": "uvgram2", "email": "uvgram2@uvgram.com" });
        let verificationCode = await getVerificationCodeFromEmail("uvgram2@uvgram.com");
        const newUser2 = {
            name: "uvgram user",
            presentation: "Welcome to UVGram.",
            username: "uvgram2",
            password: "hola1234",
            phoneNumber: "2212345678",
            email: "uvgram2@uvgram.com",
            birthdate: "2000-01-01",
            verificationCode
        }
        response = await request(server).post("/accounts/create").send(newUser2);
        response = await request(server).post("/authentication/login").send({ "emailOrUsername": "uvgram2", "password": "hola1234" });
        accessToken = response.body.data.accessToken;
        response = await request(server).post("/data/region/").send({ "region": "XALAPA" });
        response = await request(server).post("/data/faculty/").send({ "idRegion": "1", "faculty": "FACULTAD_DE_ARQUITECTURA" });
        response = await request(server).post("/data/educationalProgram/").send({ "educationalProgram": "NUTRICION", "idFaculty": "1" });
        response = await request(server).post("/data/educationalProgram/").send({ "educationalProgram": "DERECHO", "idFaculty": "1" });
    });

    beforeEach(async () => {
        let response = await request(server).post("/authentication/login").send({ "emailOrUsername": "uvgram2", "password": "hola1234" });
        accessToken = response.body.data.accessToken;
    })

    test('POST /accounts/users/roles/change 200 OK Change to administrator', async () => {
        let response = await request(server).post("/accounts/users/roles/change").send({ "key": "+jWfhIusDKBwUN6IhnPeAkAFur+5DRzS99GJknMMeS19YpNNCO9Ycfo28tG+XcG4", "emailOrUsername": "uvgram2", "newRoleType": "administrador" });
        expect(response.body.message.isUpdated).toBe(true);
        expect(response.statusCode).toBe(200);
    });

    test('POST /accounts/users/roles/change 200 OK Change to moderator', async () => {
        let response = await request(server).post("/accounts/users/roles/change").send({ "key": "+jWfhIusDKBwUN6IhnPeAkAFur+5DRzS99GJknMMeS19YpNNCO9Ycfo28tG+XcG4", "emailOrUsername": "uvgram2", "newRoleType": "moderador" });
        expect(response.body.message.isUpdated).toBe(true);
        expect(response.statusCode).toBe(200);
    });

    test('POST /accounts/users/roles/change 200 OK Change to business', async () => {
        let response = await request(server).post("/accounts/users/roles/change").send({ "key": "+jWfhIusDKBwUN6IhnPeAkAFur+5DRzS99GJknMMeS19YpNNCO9Ycfo28tG+XcG4", "emailOrUsername": "uvgram2", "newRoleType": "empresarial" });
        expect(response.body.message.isUpdated).toBe(true);
        expect(response.statusCode).toBe(200);
    });

    test('POST /accounts/users/roles/change 200 OK Change to personal', async () => {
        let response = await request(server).post("/accounts/users/roles/change").send({ "key": "+jWfhIusDKBwUN6IhnPeAkAFur+5DRzS99GJknMMeS19YpNNCO9Ycfo28tG+XcG4", "emailOrUsername": "uvgram2", "newRoleType": "personal" });
        expect(response.body.message.isUpdated).toBe(true);
        expect(response.statusCode).toBe(200);
    });

    test('POST /accounts/users/roles/change 200 OK Change to administrator again', async () => {
        let response = await request(server).post("/accounts/users/roles/change").send({ "key": "+jWfhIusDKBwUN6IhnPeAkAFur+5DRzS99GJknMMeS19YpNNCO9Ycfo28tG+XcG4", "emailOrUsername": "uvgram2", "newRoleType": "administrador" });
        expect(response.body.message.isUpdated).toBe(true);
        expect(response.statusCode).toBe(200);
    });

    test('POST /accounts/users/roles/change 200 OK Change to moderator again', async () => {
        let response = await request(server).post("/accounts/users/roles/change").send({ "key": "+jWfhIusDKBwUN6IhnPeAkAFur+5DRzS99GJknMMeS19YpNNCO9Ycfo28tG+XcG4", "emailOrUsername": "uvgram2", "newRoleType": "moderador" });
        expect(response.body.message.isUpdated).toBe(true);
        expect(response.statusCode).toBe(200);
    });

    test('POST /accounts/users/roles/change 200 OK Change to business again', async () => {
        let response = await request(server).post("/accounts/users/roles/change").send({ "key": "+jWfhIusDKBwUN6IhnPeAkAFur+5DRzS99GJknMMeS19YpNNCO9Ycfo28tG+XcG4", "emailOrUsername": "uvgram2", "newRoleType": "empresarial" });
        expect(response.body.message.isUpdated).toBe(true);
        expect(response.statusCode).toBe(200);
    });

    test('POST /accounts/users/roles/change 200 OK Change to personal again', async () => {
        let response = await request(server).post("/accounts/users/roles/change").send({ "key": "+jWfhIusDKBwUN6IhnPeAkAFur+5DRzS99GJknMMeS19YpNNCO9Ycfo28tG+XcG4", "emailOrUsername": "uvgram2", "newRoleType": "personal" });
        expect(response.body.message.isUpdated).toBe(true);
        expect(response.statusCode).toBe(200);
    });

    test('POST /accounts/users/roles/change 404 Not Found Resource not found', async () => {
        let response = await request(server).post("/accounts/users/roles/changes").send({ "key": "+jWfhIusDKBwUN6IhnPeAkAFur+5DRzS99GJknMMeS19YpNNCO9Ycfo28tG+XcG4", "emailOrUsername": "uvgram2", "newRoleType": "personal" });
        expect(response.statusCode).toBe(404);
    });

    test('POST /accounts/users/roles/change400 Bad Request invalid user role type', async () => {
        let response = await request(server).post("/accounts/users/roles/change").send({ "key": "+jWfhIusDKBwUN6IhnPeAkAFur+5DRzS99GJknMMeS19YpNNCO9Ycfo28tG+XcG4", "emailOrUsername": "uvgram2", "newRoleType": "coco" });
        expect(response.body.errors[0].msg).toContain("newRoleType must be one this:")
        expect(response.statusCode).toBe(400);
    });
});

describe('POST /accounts/users/change-privacy and GET /accounts/data', () => {
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
        response = await request(server).post("/authentication/login").send({ "emailOrUsername": "admin", "password": "hola1234" });
        adminToken = response.body.data.accessToken;

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
        response = await request(server).post("/authentication/login").send({ "emailOrUsername": "moderator", "password": "hola1234" });
        moderatorToken = response.body.data.accessToken;


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
        response = await request(server).post("/authentication/login").send({ "emailOrUsername": "business", "password": "hola1234" });
        businessToken = response.body.data.accessToken;


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
        response = await request(server).post("/authentication/login").send({ "emailOrUsername": "personal", "password": "hola1234" });
        personalToken = response.body.data.accessToken;
    });

    test('POST /accounts/users/change-privacy 200 OK Change privacy of personal user', async () => {
        let response = await request(server).post("/accounts/users/change-privacy").set("authorization", `Bearer ${personalToken}`).send({ "privacy": "privado" });
        expect(response.body.message).toBe(true);
        expect(response.statusCode).toBe(200);
    });

    test('POST /accounts/users/change-privacy 200 OK Change privacy of business user', async () => {
        let response = await request(server).post("/accounts/users/change-privacy").set("authorization", `Bearer ${businessToken}`).send({ "privacy": "privado" });
        expect(response.body.message).toBe(true);
        expect(response.statusCode).toBe(200);
    });

    test('POST /accounts/users/change-privacy 200 OK Change privacy of moderator user', async () => {
        let response = await request(server).post("/accounts/users/change-privacy").set("authorization", `Bearer ${moderatorToken}`).send({ "privacy": "privado" });
        expect(response.body.message).toBe(true);
        expect(response.statusCode).toBe(200);
    });

    test('POST /accounts/users/change-privacy 200 OK Change privacy of admin user', async () => {
        let response = await request(server).post("/accounts/users/change-privacy").set("authorization", `Bearer ${adminToken}`).send({ "privacy": "privado" });
        expect(response.body.message).toBe(true);
        expect(response.statusCode).toBe(200);
    });

    test('POST /accounts/data 200 OK Get data of personal user', async () => {
        let response = await request(server).get("/accounts/data").set("authorization", `Bearer ${personalToken}`);
        expect(response.body.message.privacy).toContain("PRIVADO")
        expect(response.statusCode).toBe(200);
    });

    test('POST /accounts/data 200 OK Get data of business user', async () => {
        let response = await request(server).get("/accounts/data").set("authorization", `Bearer ${businessToken}`);
        expect(response.body.message.privacy).toContain("PRIVADO")
        expect(response.statusCode).toBe(200);
    });

    test('POST /accounts/data 200 OK Get data of moderator user', async () => {
        let response = await request(server).get("/accounts/data").set("authorization", `Bearer ${moderatorToken}`);
        expect(response.body.message.privacy).toContain("PRIVADO")
        expect(response.statusCode).toBe(200);
    });

    test('POST /accounts/data 200 OK Get data of admin user', async () => {
        let response = await request(server).get("/accounts/data").set("authorization", `Bearer ${adminToken}`);
        expect(response.body.message.privacy).toContain("PRIVADO")
        expect(response.statusCode).toBe(200);
    });
});


