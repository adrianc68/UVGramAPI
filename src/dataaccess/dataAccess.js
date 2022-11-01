const { Op } = require("sequelize");
const { Account } = require("../models/Account");
const { User } = require("../models/User");
const { UserRole } = require("../models/UserRole");

const getAccountLoginData = async (emailOrUsername) => {
    const user = await User.findAll({
        where: {
            [Op.or]: [{ usuario: emailOrUsername }, { '$Cuentum.correo$': emailOrUsername }]
        },
        attributes: ["id", "usuario"],
        include: [{
            model: Account,
            as: "Cuentum",
            attributes: ["contraseña"]
        }, {
            model: UserRole,
            attributes: ["rol_usuario"]
        }],
        plain: true,
        raw: true
    });
    return user;
}

const getAccountLoginDataById = async (id) => {
    const user = await User.findAll({
        where: {
            id
        },
        attributes: ["id", "usuario"],
        include: [{
            model: Account,
            as: "Cuentum",
            attributes: ["contraseña"]
        }, {
            model: UserRole,
            attributes: ["rol_usuario"]
        }],
        plain: true,
        raw: true
    });
    return user;
}

const isUsernameRegistered = async (username) => {
    let isUsernameRegistered = false;
    const user = await User.findAll({
        where: { usuario: username }
    });
    isUsernameRegistered = (user.length != 0);
    return isUsernameRegistered;
}

const isEmailRegistered = async (email) => {
    let isEmailRegistered = false;
    const account = await Account.findAll({
        where: { correo: email }
    });
    isEmailRegistered = (account.length != 0);
    return isEmailRegistered;
}

module.exports = {
    getAccountLoginData, isUsernameRegistered,
    isEmailRegistered, getAccountLoginDataById
}