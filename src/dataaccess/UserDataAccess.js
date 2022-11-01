const { Op } = require("sequelize");
const { sequelize } = require("../database/connectionDatabaseSequelize");
const { encondePassword } = require("../helpers/cipher");
const { Account } = require("../models/Account");
const { AccountVerification } = require("../models/AccountVerification");
const { PersonalUserRole } = require("../models/PersonalUserRole");
const { User } = require("../models/User");
const { UserConfiguration } = require("../models/UserConfiguration");
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

const deleteUserByUsername = async (username) => {
    const t = await sequelize.transaction();
    let message;
    try {
        const user = await User.destroy({
            where: {
                usuario: username
            }
        }).then((rowDeleted) => {
            message = rowDeleted + " entity(s) was removed";
        });
        await t.commit();
    } catch (error) {
        await t.rollback();
        throw new Error(error);
    }
    return message;
}

const createUser = async (user) => {
    const { password, email, name, presentation, username, phoneNumber, birthdate, confirmationCode } = user;
    let userID;
    const t = await sequelize.transaction();
    try {
        const user = await User.create({
            nombre: name,
            presentacion: presentation,
            usuario: username,
        }, { transaction: t });
        userID = user.id;
        const userConfiguration = await UserConfiguration.create({
            tipo_privacidad: "PUBLICO",
            id_usuario: userID
        }, { transaction: t });
        const account = await Account.create({
            correo: email,
            contraseña: encondePassword(password),
            id_usuario: userID,
            telefono: phoneNumber,
            fecha_nacimiento: birthdate,
        }, { transaction: t });
        const accountVerification = await AccountVerification.create({
            codigo_verificacion: confirmationCode,
            intentos_realizados: 0,
            estado_cuenta: "NO_BLOQUEADO",
            id_usuario: userID
        }, { transaction: t });
        const userRole = await UserRole.create({
            id_usuario: userID,
            rol_usuario: "PERSONAL"
        }, { transaction: t });
        const personalUserRole = await PersonalUserRole.create({
            facultad: null,
            programa_educativo: null,
            sexo: "INDIFERENTE",
            id_usuario: userID
        }, { transaction: t });
        await t.commit();
    } catch (error) {
        await t.rollback();
        throw new Error(error);
    }
    return "New entity was added";
}

module.exports = {
    getAccountLoginData, isUsernameRegistered, isEmailRegistered,
    getAccountLoginDataById, deleteUserByUsername, createUser
}