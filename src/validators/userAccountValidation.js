const { verifyToken } = require("../dataaccess/tokenDataAccess");
const { isEmailRegistered, isUsernameRegistered, isVerificationCodeGenerated, doesVerificationCodeMatches,
    getIdByUsername, isOldPasswordValid, getAccountLoginData, removeVerificationCode } = require("../dataaccess/userDataAccess");
const { httpResponseInternalServerError, httpResponseOk, httpResponseForbidden } = require("../helpers/httpResponses");
const { logger } = require("../helpers/logger");

const validationisEmailRegisteredWithNext = async (request, response, next) => {
    let isRegistered;
    try {
        const { email } = request.body;
        isRegistered = await isEmailRegistered(email);
    } catch (err) {
        return httpResponseInternalServerError(response, err);
    }
    if (isRegistered) {
        return httpResponseForbidden(response, { exist: isRegistered, message: "email is already registered" });
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
        return httpResponseForbidden(response, { exist: isRegistered, message: "username is already registered" });
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

const validationChangePasswordLoggedUser = async (request, response, next) => {
    const token = (request.headers.authorization).split(" ")[1];
    let { oldPassword } = request.body;
    let isValidOldPassword = false;
    try {
        let userData = await verifyToken(token).then(data => { return data });
        isValidOldPassword = await isOldPasswordValid(oldPassword, userData.email);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    if (!isValidOldPassword) {
        return httpResponseForbidden(response, "the old password does not match actual password");
    }
    return next();
}

const validationChangePasswordUnloggedUser = async (request, response, next) => {
    let { emailOrUsername, verificationCode } = request.body;
    let userData;
    let isValidCode;
    try {
        userData = await getAccountLoginData(emailOrUsername);
        isValidCode = await doesVerificationCodeMatches(userData.username, verificationCode);
        if (!userData) {
            return httpResponseForbidden(response, "username does not exist");
        }
        if (!isValidCode) {
            return httpResponseForbidden(response, "verification code is not valid");
        }
        await removeVerificationCode(userData.username);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return next();
}

module.exports = {
    validationisEmailRegisteredWithNext, validationIsUsernameRegisteredWithNext,
    validationIsUsernameRegistered, validationIsEmailRegistered, validationNotGeneratedVerificationCode,
    validationVerificationCodeMatches, validationChangePasswordLoggedUser, validationChangePasswordUnloggedUser
}



