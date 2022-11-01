const { httpResponseInternalServerError, httpResponseNotFound, httpResponseErrorToken, httpResponseForbidden } = require("../helpers/httpResponses");
const { encondePassword } = require("../helpers/cipher");
const { blacklistToken, checkToken, verifyToken, TOKEN_STATE } = require("../helpers/token");
const { getAccountLoginData } = require("../dataaccess/dataAccess");
const { logger } = require("../helpers/logger");

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
        await getAccountLoginData(emailOrUsername).then(user => {
            if (doesExistUser(user)) {
                if (doesPasswordMatch(encondePassword(password), user["Cuentum.contraseña"])) {
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
    let accessToken = (request.headers.authorization).split(" ")[1];

    let value;
    try {
        value = await checkToken(id, accessToken);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    if (!value || value.toUpperCase() == TOKEN_STATE.NIL) {
        return httpResponseErrorToken(response, "token does not exist");
    } else if (value.toUpperCase() == TOKEN_STATE.INVALID) {
        return httpResponseErrorToken(response, "token has expired");
    }
    try {
        await verifyToken(accessToken);
    } catch (error) {
        return httpResponseErrorToken(response, error);
    }
    return response.send("Access guaranted by TOKEN");
    return next();
}

const validationRefreshTokenData = async (request, response, next) => {
    let { id } = request.headers;
    let refreshToken = (request.headers.authorization).split(" ")[1];
    let value;
    try {
        value = await checkToken(id, refreshToken);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    if (!value || value.toUpperCase() == TOKEN_STATE.NIL) {
        return httpResponseErrorToken(response, "token does not exist");
    } else if (value.toUpperCase() == TOKEN_STATE.INVALID) {
        return httpResponseErrorToken(response, "token has expired");
    }
    try {
        await verifyToken(refreshToken);
        await blacklistToken(id, refreshToken);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return next();
}

module.exports = { validationLoginData, validationAccesTokenData, validationRefreshTokenData }



