const { User } = require("../models/User");
const { Account } = require("../models/Account");
const { AccountVerification } = require("../models/AccountVerification");
const { UserConfiguration } = require("../models/UserConfiguration");
const { generateRandomCode } = require("../helpers/generateCode");
const { sequelize } = require("../database/connectionDatabaseSequelize");

const createUser = async (request, response) => {
    const { password, email, name, presentation, username } = request.body;
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
        const newAccount = await Account.create({
            correo: email,
            contraseña: password,
            id_usuario: userID
        }, { transaction: t });
        const newAccountVerification = await AccountVerification.create({
            codigo_verificacion: confirmationCode,
            intentos_realizados: 0,
            estado_cuenta: "NO_BLOQUEADO",
            correo_cuenta: email,
            id_usuario: userID
        }, { transaction: t });
        await t.commit();
    } catch (error) {
        await t.rollback();
    }
    response.send("Added successfully");
}

const deleteUserByUsername = async (request, response) => {
    const { username } = request.body;
    const t = await sequelize.transaction();
    try {
        const user = await User.destroy({
            where: {
                usuario: username
            }
        }).then( function(rowDeleted) {
            if(rowDeleted === 1) {
                console.log("Delected successfully");
            }
        }, function(error) {
            console.log(err);
        });

        await t.commit();
    } catch(error) {
        await t.rollback();
    }
    response.send("Removed succesfully");
}

module.exports = { createUser, deleteUserByUsername }