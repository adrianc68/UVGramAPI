const { httpResponseInternalServerError, httpResponseUnauthorized, httpResponseNotFound } = require("../helpers/httpResponses");
const { Account } = require("../models/Account");
const { encondePassword } = require("../helpers/cipher");
const { Op } = require("sequelize");
const { User } = require("../models/User");
const { UserRole } = require("../models/UserRole");

const getAccountExist = async (emailOrUsername) => {
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

const doesExistUser = (user) => {
    let doesExistUser = false;
    if (user != undefined && user.length != 0) {
        doesExistUser = true;
    }
    return doesExistUser;
}

const doesPasswordMatch = (passwordA, passwordB) => {
    let doesPasswordMatch = false;
    if (passwordA == passwordB) {
        doesPasswordMatch = true;
    }
    return doesPasswordMatch;
}

const validationLoginData = async (request, response, next) => {
    const { emailOrUsername, password } = request.body;
    try {
        await getAccountExist(emailOrUsername).then(user => {
            if (doesExistUser(user)) {
                if (doesPasswordMatch(encondePassword(password), user["Cuentum.contraseña"])) {
                    request.userLogged = {
                        username: user.usuario,
                        id: user.id,
                        userRole: user["RolUsuario.rol_usuario"]
                    };
                    return next();
                } else {
                    return httpResponseUnauthorized(response, "password does not match");
                }
            } else {
                return httpResponseNotFound(response, "user not found");
            }
        });
    } catch (err) {
        return httpResponseInternalServerError(response, err);
    }
}

module.exports = { validationLoginData }



