const { httpResponseInternalServerError, httpResponseNotFound, httpResponseErrorToken, httpResponseForbidden } = require("../helpers/httpResponses");
const { encondePassword } = require("../helpers/cipher");
const { blacklistToken, checkToken, verifyToken, TOKEN_STATE } = require("../helpers/token");
const { getAccountLoginData } = require("../dataaccess/UserDataAccess");
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
                if (doesPasswordMatch(encondePassword(password), user["Account.password"])) {
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
    let accessTokenId = request.headers.accesstokenid;
    let accessToken = (request.headers.authorization).split(" ")[1];
    let value;
    try {
        value = await checkToken(accessTokenId, accessToken);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    if (!value || value.split(" ")[0] == TOKEN_STATE.NIL) {
        return httpResponseErrorToken(response, "access token does not exist.");
    } else if (value.split(" ")[0] == TOKEN_STATE.INVALID) {
        return httpResponseErrorToken(response, "access token has expired.");
    }
    try {
        await verifyToken(accessToken);
    } catch (error) {
        return httpResponseErrorToken(response, "token is not valid");
    }
    return next();
}

const validationRefreshTokenData = async (request, response, next) => {
    let refreshTokenId = request.headers.refreshtokenid;
    let refreshToken = (request.headers.authorization).split(" ")[1];
    let value;
    try {
        value = await checkToken(refreshTokenId, refreshToken);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    if (!value || value.split(" ")[0] == TOKEN_STATE.NIL) {
        return httpResponseErrorToken(response, "refresh token does not exist.");
    } else if (value.split(" ")[0] == TOKEN_STATE.INVALID) {
        return httpResponseErrorToken(response, "refresh token has expired.");
    }
    try {
        await verifyToken(refreshToken);
    } catch (error) {
        return httpResponseErrorToken(response, "token is not valid");
    }
    return next();
}

const sayHello = (request, response) => {
    return response.send("Welcome! Now you can get the resources");
}


module.exports = { validationLoginData, validationAccesTokenData, validationRefreshTokenData, sayHello }



