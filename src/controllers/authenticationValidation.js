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
        console.log(isUsernameRegistered);
    } catch (err) {
        return httpResponse(response, err);
    }
    return response.status(StatusCodes.OK).json(isUsernameRegistered);
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
    return response.status(StatusCodes.OK).json(isEmailRegistered);
}

module.exports = { isUsernameRegistered, isEmailRegistered }




