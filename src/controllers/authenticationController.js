const { generateTokens, deleteAllSessionByAccessToken, verifyToken, removeToken, refreshAccessToken } = require("../dataaccess/tokenDataAccess");
const { getAccountLoginData, getAccountLoginDataById } = require("../dataaccess/userDataAccess");
const { httpResponseOk, httpResponseInternalServerError, httpResponseUnauthorized } = require("../helpers/httpResponses");
const { logger } = require("../helpers/logger");

const createTokens = async (request, response) => {
    let { emailOrUsername } = request.body;
    let tokens;
    try {
        let user = await getAccountLoginData(emailOrUsername);
        let device_info = request.headers.host;
        tokens = await generateTokens(user.id, user["UserRole.role"], device_info);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, tokens);
};

const refreshTokens = async (request, response) => {
    let newAccessToken;
    let refreshToken = (request.headers.authorization).split(" ")[1];
    let resultRemoveAccessToken;
    let optionalAccessToken = (request.headers.accesstoken).split(" ")[1];
    try {
        resultRemoveAccessToken = (optionalAccessToken) ? await removeToken(optionalAccessToken) : undefined;
        let refreshTokenData = await verifyToken(refreshToken);
        let user = await getAccountLoginDataById(refreshTokenData.id);
        newAccessToken = await refreshAccessToken(user.id, user["UserRole.role"], refreshTokenData.jti);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    const payload = {
        accessToken: newAccessToken.accessToken.token,
        optionalAccessTokenMessage: resultRemoveAccessToken
    }
    return httpResponseOk(response, payload);
};

const logoutSession = async (request, response) => {
    let accessToken = (request.headers.authorization).split(" ")[1];
    try {
        await deleteAllSessionByAccessToken(accessToken);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, "logout successful");
};

const checkRolesAuth = (roles) => async (request, response, next) => {
    const token = (request.headers.authorization).split(" ")[1];
    let userRoleData;
    try {
        userRoleData = (await verifyToken(token)).userRole;
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    let rolesAllowed = [].concat(roles);
    if (!rolesAllowed.includes(userRoleData)) {
        return httpResponseUnauthorized(response)
    }
    return next();
};

const sayHello = async (request, response) => {
    return response.send("Welcome! This is just for testing purposes");
};

module.exports = { createTokens, refreshTokens, logoutSession, checkRolesAuth, sayHello }