const { getAccountLoginData, getAccountLoginDataById } = require("../dataaccess/dataAccess");
const { httpResponseOk, httpResponseInternalServerError } = require("../helpers/httpResponses");
const { logger } = require("../helpers/logger");
const { generateToken, EXPIRATION_TIME, addToken, removeToken, blacklistToken } = require("../helpers/token");

const generateTokens = async (username, id, userRole) => {
    let accessToken;
    let refreshToken;
    let payload = {
        id, username, userRole
    }
    try {
        accessToken = await generateToken(payload, EXPIRATION_TIME.INSTANT);
        await addToken(id, accessToken);
        refreshToken = await generateToken(payload, EXPIRATION_TIME.LONG_TIME);
        await addToken(id, refreshToken);
    } catch (error) {
        removeToken(id, accessToken);
        removeToken(id, refreshToken);
        throw new Error(error);
    }
    let tokensCreated = {
        body: {
            id,
            accessToken,
            refreshToken
        }
    }
    return tokensCreated;
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
    let { id } = request.headers;
    let tokens;
    try {
        let user = await getAccountLoginDataById(id);
        tokens = await generateTokens(user.usuario, user.id, user["RolUsuario.rol_usuario"]);

        logger.trace(tokens.message);

    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, tokens);
}

const logOutToken = async (request, response) => {
    let { id } = request.headers;
    let { accessToken } = (request.headers.authorization).split(" ")[1];;
    try {
        await blacklistToken(id, accessToken);
    } catch (error) {
        return httpResponseInternalServerError(error);
    }
    return httpResponseOk(response, { message: "Logout successful"});
}

module.exports = { createTokens, refreshTokens, logOutToken }