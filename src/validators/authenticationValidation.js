const { httpResponseInternalServerError, httpResponseNotFound, httpResponseErrorToken, httpResponseForbidden } = require("../helpers/httpResponses");
const { encondePassword } = require("../helpers/cipher");
const { getAccountLoginData } = require("../dataaccess/userDataAccess");
const { getTokenExist, TOKEN_TYPE } = require("../dataaccess/tokenDataAccess");
const { AccountStatusType } = require("../models/enum/AccountStatusType");
const { logger } = require("../helpers/logger");

const doesExistUser = (user) => {
    let doesExistUser = false;
    if (user != undefined && user.length != 0) {
        doesExistUser = true;
    }
    return doesExistUser;
};

const doesPasswordMatch = (passwordA, passwordB) => {
    let doesPasswordMatch = false;
    if (passwordA == passwordB) {
        doesPasswordMatch = true;
    }
    return doesPasswordMatch;
};

const validationLoginData = async (request, response, next) => {
    const { emailOrUsername, password } = request.body;
    try {
        await getAccountLoginData(emailOrUsername).then(user => {
            if (doesExistUser(user)) {
                if (user["Account.AccountVerification.account_status"] == AccountStatusType.BLOCKED) {
                    return httpResponseForbidden(response, "user has been kicked from server")
                }
                if (doesPasswordMatch(encondePassword(password), user["Account.password"])) {
                    return next();
                } else {
                    return httpResponseForbidden(response, "password does not match");
                }
            } else {
                return httpResponseForbidden(response, "user not found");
            }
        });
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
};

const validationAccesTokenDataAsAuthorization = async (request, response, next) => {
    let accessToken = (request.headers.authorization).split(" ")[1];
    try {
        await getTokenExist(accessToken, TOKEN_TYPE.ACCESS);
    } catch (error) {
        const payload = { error: error.message }
        return httpResponseErrorToken(response, payload);
    }
    return next();
};

const validationRefreshTokenDataAsAuthorization = async (request, response, next) => {
    let refreshToken = (request.headers.authorization).split(" ")[1];
    try {
        await getTokenExist(refreshToken, TOKEN_TYPE.REFRESH);
    } catch (error) {
        const payload = { error: error.message }
        return httpResponseErrorToken(response, payload);
    }
    return next();
};

const validationRefreshTokenDataAsParameter = async (request, response, next) => {
    let refreshToken = (request.headers.refreshtoken).split(" ")[1];
    try {
        await getTokenExist(refreshToken, TOKEN_TYPE.REFRESH);
    } catch (error) {
        const payload = { error: error.message }
        return httpResponseErrorToken(response, payload);
    }
    return next();
}

module.exports = {
    validationLoginData, validationAccesTokenDataAsAuthorization, validationRefreshTokenDataAsAuthorization, validationRefreshTokenDataAsParameter
}



