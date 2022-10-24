const { User } = require("../models/User");
const { Account } = require("../models/Account");
const { sequelize } = require("../database/connectionDatabaseSequelize");
const { logger } = require("../helpers/logger");

const isUsernameRegistered = async (request, response) => {
    let isUsernameRegistered = false;
    const { username } = request.body;
    try {
        const user = await User.findAll({
            where: { usuario: username }
        });
        isUsernameRegistered = (user.length != 0);
        console.log(isUsernameRegistered);
    } catch (err) {
        logger.warn(err.message);
    }
    response.send(isUsernameRegistered);
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
        logger.warn(err.message);
    }
    response.send(isEmailRegistered);
}


module.exports = { isUsernameRegistered, isEmailRegistered }




