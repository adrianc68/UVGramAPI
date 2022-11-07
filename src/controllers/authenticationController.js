const { removeOptionalAccessToken, refreshAccessToken, verifyToken, removeToken, generateTokens } = require("../dataaccess/tokenDataAccess");
const { getAccountLoginData, getAccountLoginDataById, saveSessionToken, removeSessionToken } = require("../dataaccess/UserDataAccess");
const { httpResponseOk, httpResponseInternalServerError, httpResponseErrorToken, httpResponseUnauthorized } = require("../helpers/httpResponses");

const createTokens = async (request, response) => {
    let { emailOrUsername } = request.body;
    let tokens;
    try {
        let user = await getAccountLoginData(emailOrUsername);
        tokens = await generateTokens(user.username, user.id, user["UserRole.role"]);
        let session = {
            id_user: user.id,
            token: tokens.refreshToken,
            device: request.headers.host
        }
        await saveSessionToken(session);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, tokens);
};

const refreshTokens = async (request, response) => {
    let newRefreshtoken;
    let refreshToken = (request.headers.authorization).split(" ")[1];
    let optionalAccessToken = request.headers.accesstoken;
    let optionalOldAccessTokenMessage = (optionalAccessToken) ? await removeOptionalAccessToken(optionalAccessToken.split(" ")[1]) : undefined;
    try {
        let refreshTokenData = await verifyToken(refreshToken);
        let user = await getAccountLoginDataById(refreshTokenData.id);
        newRefreshtoken = await refreshAccessToken(user.usuario, user.id, user["UserRole.role"], refreshTokenData.jti);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    const payload = {
        accessToken: newRefreshtoken.accessToken.token,
        optionalAccessTokenMessage: optionalOldAccessTokenMessage
    }
    return httpResponseOk(response, payload);
};

const logOutToken = async (request, response) => {
    let accessToken = (request.headers.authorization).split(" ")[1];
    let refreshToken = (request.headers.refreshtoken).split(" ")[1];
    try {
        await removeToken(accessToken);
        await removeToken(refreshToken);
        await removeSessionToken(refreshToken);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, { message: "logout successful" });
};

const checkAuth = async (request, response, next) => {
    let accessToken = request.headers.authorization;
    let tokenData;
    try {
        tokenData = await verifyToken(accessToken.split(" ")[1]);
        if (tokenData.userId) {
            return next();
        } else {
            return httpResponseErrorToken(response, "token is required to access to this resource!");
        }
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
};

const checkAuthRole = (roles) => async (request, response, next) => {
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
    return response.send("Welcome! Now you can get the resources");
};


module.exports = { createTokens, refreshTokens, logOutToken, checkAuthRole, sayHello }