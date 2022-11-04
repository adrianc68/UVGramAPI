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
        await addToken(refreshToken.jti, refreshToken.token);
        await addToken(accessToken.jti, accessToken.token);
    } catch (error) {
        removeToken(accessToken.jti);
        removeToken(refreshToken.jti);
        throw new Error(error);
    }
    let tokensCreated = {
        refreshToken,
        accessToken
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
        await addToken(accessToken.jti, accessToken.token);
    } catch (error) {
        removeToken(accessToken.jti);
        throw new Error(error);
    }
    let tokenCreated = {
        accessToken
    }
    return tokenCreated;
}

const createTokens = async (request, response) => {
    let { emailOrUsername } = request.body;
    let tokens;
    try {
        let user = await getAccountLoginData(emailOrUsername);
        tokens = await generateTokens(user.usuario, user.id, user["RolUsuario.rol_usuario"]);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, tokens);
}

const refreshTokens = async (request, response) => {
    let token;
    let refreshTokenId = request.headers.refreshtokenid;
    let refreshToken = (request.headers.authorization).split(" ")[1];
    try {
        let refreshTokenData = await verifyToken(refreshToken);
        let user = await getAccountLoginDataById(refreshTokenData.id);
        token = await refreshAccessToken(user.usuario, user.id, user["RolUsuario.rol_usuario"], refreshTokenId);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, token);
}

const logOutToken = async (request, response) => {
    let refreshTokenId = request.headers.refreshtokenid;
    let accessTokenId = request.headers.accesstokenid;
    try {
        await removeToken(accessTokenId);
        await removeToken(refreshTokenId);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, { message: "logout successful" });
}

module.exports = { createTokens, refreshTokens, logOutToken }