const { User } = require("../models/User");
const { Account } = require("../models/Account");
const { sequelize } = require("../database/connectionDatabaseSequelize");
const { logger } = require("../helpers/logger");
const { StatusCodes } = require("http-status-codes");
const { httpResponse } = require("../helpers/httpResponses");

const isUsernameRegistered = async (request, response) => {
    let isUsernameRegistered = false;
    const { username } = request.body;
    try {
        const user = await User.findAll({
            where: { usuario: username }
        });
        isUsernameRegistered = (user.length != 0);
    } catch (err) {
        return httpResponse(response, err);
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
        return httpResponse(response, err);
    }
    return isEmailRegistered;
}

const validationisEmailRegisteredWithNext = async (request, response, next) => {
    "use strict";
    let isRegistered = await isEmailRegistered(request, response);
    if (isRegistered) {
        return response.status(StatusCodes.OK).json({ exist: isRegistered, message: "email is already registered" });
    } else {
        return next();
    }
}

const validationIsUsernameRegisteredWithNext = async (request, response, next) => {
    "use strict";
    let isRegistered = await isUsernameRegistered(request, response);
    if (isRegistered) {
        return response.status(StatusCodes.OK).json({ exist: isRegistered, message: "username is already registered" });
    } else {
        return next();
    }
}

const validationIsEmailRegistered = async (request, response) => {
    "use strict";
    let isRegistered = await isEmailRegistered(request, response);
    if (isRegistered) {
        return response.status(StatusCodes.OK).json({ exist: isRegistered, message: "email is already registered" });
    } else {
        return response.status(StatusCodes.OK).json({ exist: isRegistered, message: "email is not registered" });
    }
}

const validationIsUsernameRegistered = async (request, response) => {
    "use strict";
    let isRegistered = await isUsernameRegistered(request, response);
    if (isRegistered) {
        return response.status(StatusCodes.OK).json({ exist: isRegistered, message: "username is already registered" });
    } else {
        return response.status(StatusCodes.OK).json({ exist: isRegistered, message: "username is not registered" });
    }
}

module.exports = { validationisEmailRegisteredWithNext, validationIsUsernameRegisteredWithNext, validationIsUsernameRegistered, validationIsEmailRegistered }



