const { User } = require("../models/User");
const { Account } = require("../models/Account");
const { AccountVerification } = require("../models/AccountVerification");
const { UserConfiguration } = require("../models/UserConfiguration");
const { UserRole } = require("../models/UserRole");
const { generateRandomCode } = require("../helpers/generateCode");
const { sequelize } = require("../database/connectionDatabaseSequelize");
const { httpResponseInternalServerError, httpResponseOk } = require("../helpers/httpResponses");
const { encondePassword } = require("../helpers/cipher");

const createUser = async (request, response) => {
    const { password, email, name, presentation, username, phoneNumber, birthdate } = request.body;
    let confirmationCode = generateRandomCode(8);
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
            telefono: phoneNumber
        }, { transaction: t });
        const accountVerification = await AccountVerification.create({
            codigo_verificacion: confirmationCode,
            intentos_realizados: 0,
            estado_cuenta: "NO_BLOQUEADO",
            correo_cuenta: email,
            id_usuario: userID
        }, { transaction: t });
        const userRole = await UserRole.create({
            fecha_nacimiento: birthdate,
            id_usuario: userID,
            nombre_completo: null
        }, { transaction: t });
        await t.commit();
    } catch (err) {
        await t.rollback();
        return httpResponseInternalServerError(response, err);
    }
    return httpResponseOk(response, "New entity was added succesfully")
}

const deleteUserByUsername = async (request, response) => {
    const { username } = request.body;
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
    } catch (err) {
        await t.rollback();
        return httpResponseInternalServerError(response, err);
    }
    return httpResponseOk(response, message)
}

module.exports = { createUser, deleteUserByUsername }