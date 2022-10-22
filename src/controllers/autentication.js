const { User } = require("../models/User");
const { Account } = require("../models/Account");
const { AccountVerification } = require("../models/AccountVerification");
const { UserConfiguration } = require("../models/UserConfiguration");
const { generateRandomCode } = require("../helpers/generateCode");



const createUser = async (request, response) => {
    const { password, email, name, presentation, username } = request.body;
    let confirmationCode = generateRandomCode(8);
    try {
        const newUser = await User.create({
            nombre: name,
            presentacion: presentation,
            usuario: username,
        }).then( user => {
            let userID = user.id;
            const newAccount = Account.create({
                correo: email,
                contraseña: password,
                id_usuario: userID
            });
            const newAccountVerification = AccountVerification.create({
                codigo_verificacion: confirmationCode,
                intentos_realizados: 0,
                estado_cuenta: "NO_BLOQUEADO",
                correo_cuenta: email,
                id_usuario: userID
            });
            const newUserConfiguration = UserConfiguration.create({
                tipo_privacidad: "PUBLICO",
                id_usuario: userID
            })
        });
        // const newUser = await User.create({
        //     nombre: name,
        //     presentacion: presentation,
        //     usuario: username,
        //     Account: {
        //         correo: email,
        //         contraseña: password,
        //     }
        // }, {
        //     include: [Account]
        // });

        // const newAccount = await Account.create({
        //     correo: email,
        //     contraseña: password,
        //     User: {
        //         nombre: name,
        //         presentacion: presentation,
        //         usuario: username
        //     }
        // },{
        //     include: [User]
        // });




        // User.create(newUser).then( result => console.log(result.id));

    } catch (error) {
        return response.status(400).json({ message: error.message });
    }
    response.send("Hola");
}

module.exports = { createUser }