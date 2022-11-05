const { httpResponseInternalServerError, httpResponseNotFound, httpResponseErrorToken, httpResponseForbidden } = require("../helpers/httpResponses");
const { encondePassword } = require("../helpers/cipher");
const { checkToken, verifyToken, TOKEN_STATE, TOKEN_TYPE } = require("../helpers/token");
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

const getTokenExist = async (token, tokenType = "token") => {
    let value;
    try {
        value = await checkToken(token);
    } catch (error) {
        throw new Error(error, `${tokenType} not found`)
    }
    if (!value || value == TOKEN_STATE.NIL) {
        throw new Error(`${tokenType} does not exist`);
    } else if (value.split(" ")[0] == TOKEN_STATE.INVALID) {
        throw new Error(`${tokenType} has expired`)
    }
    try {
        await verifyToken(token);
    } catch (error) {
        throw new Error(error, `${tokenType} is not valid`);
    }
    return value;
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
    let accessToken = (request.headers.authorization).split(" ")[1];
    try {
        await getTokenExist(accessToken, TOKEN_TYPE.ACCESS);
    } catch (error) {
        const payload = { error: error.message }
        return httpResponseErrorToken(response, payload);
    }
    return next();
}

const validationRefreshTokenData = async (request, response, next) => {
    let refreshToken = (request.headers.authorization).split(" ")[1];
    let optionalAccessToken = request.headers.accesstoken;
    try {
        await getTokenExist(refreshToken, TOKEN_TYPE.REFRESH);



        if (optionalAccessToken) {
            await getTokenExist(optionalAccessToken.split(" ")[1], TOKEN_TYPE.ACCESS);
        }

        
    } catch (error) {
        const payload = { error: error.message }
        return httpResponseErrorToken(response, payload);
    }
    return next();
}

const validationLogoutTokensData = async (request, response, next) => {
    let accessToken = (request.headers.authorization).split(" ")[1];
    let refreshToken = (request.headers.refreshtoken).split(" ")[1];
    try {
        await getTokenExist(refreshToken, TOKEN_TYPE.REFRESH);
        await getTokenExist(accessToken, TOKEN_TYPE.ACCESS);
    } catch (error) {
        const payload = { error: error.message }
        return httpResponseErrorToken(response, payload);
    }
    return next();
}

module.exports = {
    validationLoginData, validationAccesTokenData, validationRefreshTokenData, validationLogoutTokensData
}



