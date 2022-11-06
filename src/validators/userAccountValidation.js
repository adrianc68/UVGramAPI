const { isEmailRegistered, isUsernameRegistered, isVerificationCodeGenerated, doesVerificationCodeMatches } = require("../dataaccess/userDataAccess");
const { httpResponseInternalServerError, httpResponseOk, httpResponseForbidden } = require("../helpers/httpResponses");

const validationisEmailRegisteredWithNext = async (request, response, next) => {
    let isRegistered;
    try {
        const { email } = request.body;
        isRegistered = await isEmailRegistered(email);
    } catch (err) {
        return httpResponseInternalServerError(response, err);
    }
    if (isRegistered) {
        return httpResponseOk(response, { exist: isRegistered, message: "email is already registered" });
    } else {
        return next();
    }
};

const validationIsUsernameRegisteredWithNext = async (request, response, next) => {
    let isRegistered;
    try {
        const { username } = request.body;
        isRegistered = await isUsernameRegistered(username);
    } catch (err) {
        return httpResponseInternalServerError(response, err);
    }
    if (isRegistered) {
        return httpResponseOk(response, { exist: isRegistered, message: "username is already registered" });
    } else {
        return next();
    }
};

const validationIsEmailRegistered = async (request, response) => {
    let isRegistered;
    try {
        const { email } = request.body;
        isRegistered = await isEmailRegistered(email);
    } catch (err) {
        return httpResponseInternalServerError(response, err);
    }
    let message;
    if (isRegistered) {
        message = "email is already registered";
    } else {
        message = "email is not registered";
    }
    return httpResponseOk(response, { exist: isRegistered, message });
};

const validationIsUsernameRegistered = async (request, response) => {
    let isRegistered;
    const { username } = request.body;
    try {
        isRegistered = await isUsernameRegistered(username);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    let message;
    if (isRegistered) {
        message = "username is already registered";
    } else {
        message = "username is not registered";
    }
    return httpResponseOk(response, { exist: isRegistered, message });
};

const validationNotGeneratedVerificationCode = async (request, response, next) => {
    let { username } = request.body;
    let isGenerated;
    try {
        isGenerated = await isVerificationCodeGenerated(username);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    if (isGenerated) {
        return httpResponseForbidden(response, "wait to generate another verification code");
    }
    return next();
};

const validationVerificationCodeMatches = async (request, response, next) => {
    let { username, verificationCode } = request.body;
    let isValid = false;
    try {
        isValid = await doesVerificationCodeMatches(username, verificationCode);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    if (!isValid) {
        return httpResponseForbidden(response, "verification code is not valid");
    }
    return next();
};

module.exports = {
    validationisEmailRegisteredWithNext, validationIsUsernameRegisteredWithNext,
    validationIsUsernameRegistered, validationIsEmailRegistered, validationNotGeneratedVerificationCode,
    validationVerificationCodeMatches
}



