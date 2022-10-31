const { httpResponseInternalServerError, httpResponseUnauthorized, httpResponseNotFound, httpResponseErrorToken, httpResponseForbidden } = require("../helpers/httpResponses");
const { Account } = require("../models/Account");
const { encondePassword } = require("../helpers/cipher");
const { Op } = require("sequelize");
const { User } = require("../models/User");
const { UserRole } = require("../models/UserRole");
const { blacklistToken, generateAccessToken, checkToken, verifyToken, TOKEN_STATE } = require("../helpers/token");
const { logger } = require("../helpers/logger");

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
                    return httpResponseForbidden(response, "password does not match");
                }
            } else {
                return httpResponseNotFound(response, "user not found");
            }
        });
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
}

const validationAccesTokenData = async (request, response, next) => {
    let { id } = request.headers;
    let accessToken = request.headers.authorization;
    let value;
    try {
        value = await checkToken(id, accessToken);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    if (!value || value.toUpperCase() == TOKEN_STATE.NIL) {
        return httpResponseErrorToken(response, "token does not exist");
    } else if (value.toUpperCase() == TOKEN_STATE.INVALID) {
        return httpResponseErrorToken(response, { error: "token has expired" });
    }
    try {
        await verifyToken(accessToken);
    } catch (error) {
        return httpResponseErrorToken(response, error);
    }
    return response.send("ACCESS TOKEN DATA");
    return next();
}

const validationRefreshTokenData = async (request, response, next) => {
    let { id } = request.headers;
    let refreshToken = request.headers.authorization;
    let value;
    try {
        value = await checkToken(id, refreshToken);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    if (!value || value.toUpperCase() == TOKEN_STATE.NIL) {
        return httpResponseErrorToken(response, "token does not exist");
    } else if (value.toUpperCase() == TOKEN_STATE.INVALID) {
        return httpResponseErrorToken(response, { error: "token has expired" });
    }
    try {
        await verifyToken(refreshToken);
        await blacklistToken(id, refreshToken);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }

    // const accessToken = //generateAccessToken();
    // const refreshToken = //

    return response.send("REFRESH TOKEN DATA");
    return next();
}

module.exports = { validationLoginData, validationAccesTokenData, validationRefreshTokenData }



