const { getAccountLoginData, getAccountLoginDataById } = require("../dataaccess/UserDataAccess");
const { httpResponseOk, httpResponseInternalServerError } = require("../helpers/httpResponses");
const { addToken, removeToken, generateRefreshToken, generateAccessToken, verifyToken } = require("../helpers/token");

const generateTokens = async (username, userId, userRole) => {
    let accessToken;
    let refreshToken;
    try {
        let payloadAccessToken = {
            id: userId,
            username,
            userRole,
        };
        refreshToken = await generateRefreshToken(payloadAccessToken);
        accessToken = await generateAccessToken(payloadAccessToken, refreshToken.jti);
        await addToken(refreshToken.token, refreshToken.jti);
        await addToken(accessToken.token, accessToken.jti);
    } catch (error) {
        removeToken(accessToken.jti);
        removeToken(refreshToken.jti);
        throw new Error(error);
    }
    let tokensCreated = {
        refreshToken: refreshToken.token,
        accessToken: accessToken.token
    }
    return tokensCreated;
}

const refreshAccessToken = async (username, userId, userRole, refreshTokenJti) => {
    let accessToken;
    try {
        let payloadAccessToken = {
            userId,
            username,
            userRole,
        };
        accessToken = await generateAccessToken(payloadAccessToken, refreshTokenJti);
        await addToken(accessToken.token, accessToken.jti);
    } catch (error) {
        removeToken(accessToken.jti);
        throw new Error(error);
    }
    let tokenCreated = {
        accessToken
    }
    return tokenCreated;
}

const removeOptionalAccessToken = async (optionalAccessToken) => {
    let optionalOldAccessTokenMessage;
    if (optionalAccessToken) {
        try {
            await verifyToken(optionalAccessToken);
            await removeToken(optionalAccessToken);
        } catch (error) {
            optionalOldAccessTokenMessage = {
                message: "Failed to remove access token",
                errorType: error.message
            }
        }
    }
    return optionalOldAccessTokenMessage;
}

const createTokens = async (request, response) => {
    let { emailOrUsername } = request.body;
    let tokens;
    try {
        let user = await getAccountLoginData(emailOrUsername);
        tokens = await generateTokens(user.username, user.id, user["UserRole.role"]);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, tokens);
}

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
}

const logOutToken = async (request, response) => {
    let accessToken = (request.headers.authorization).split(" ")[1];
    let refreshToken = (request.headers.refreshtoken).split(" ")[1];
    try {
        await removeToken(accessToken);
        await removeToken(refreshToken);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, { message: "logout successful" });
}

const sayHello = (request, response) => {
    return response.send("Welcome! Now you can get the resources");
}

module.exports = { createTokens, refreshTokens, logOutToken, sayHello }