const { httpResponseInternalServerError, httpResponseOk } = require("../helpers/httpResponses");
const { User } = require("../models/User");
const { Account } = require("../models/Account");

const isUsernameRegistered = async (request, response) => {
    let isUsernameRegistered = false;
    const { username } = request.body;
    try {
        const user = await User.findAll({
            where: { usuario: username }
        });
        isUsernameRegistered = (user.length != 0);
    } catch (err) {
        return httpResponseInternalServerError(response, err);
    }
    return isUsernameRegistered;
}

const isEmailRegistered = async (request, response) => {
    let isEmailRegistered = false;
    const { email } = request.body;
    try {
        const account = await Account.findAll({
            where: { correo: email }
        });
        isEmailRegistered = (account.length != 0);
    } catch (err) {
        return httpResponseInternalServerError(response, err);
    }
    return isEmailRegistered;
}

const validationisEmailRegisteredWithNext = async (request, response, next) => {
    let isRegistered = await isEmailRegistered(request, response);
    if (isRegistered) {
        return httpResponseOk(response, { exist: isRegistered, message: "email is already registered" });
    } else {
        return next();
    }
}

const validationIsUsernameRegisteredWithNext = async (request, response, next) => {
    let isRegistered = await isUsernameRegistered(request, response);
    if (isRegistered) {
        return httpResponseOk(response, { exist: isRegistered, message: "username is already registered" });
    } else {
        return next();
    }
}

const validationIsEmailRegistered = async (request, response) => {
    let isRegistered = await isEmailRegistered(request, response);
    let message;
    if (isRegistered) {
        message = "email is already registered";
    } else {
        message = "email is not registered";
    }
    return httpResponseOk(response, { exist: isRegistered, message });
}

const validationIsUsernameRegistered = async (request, response) => {
    let isRegistered = await isUsernameRegistered(request, response);
    let message;
    if (isRegistered) {
        message = "username is already registered";
    } else {
        message = "username is not registered";
    }
    return httpResponseOk(response, { exist: isRegistered, message });
}

module.exports = { validationisEmailRegisteredWithNext, validationIsUsernameRegisteredWithNext, validationIsUsernameRegistered, validationIsEmailRegistered }



