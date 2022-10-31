const { httpResponseOk, httpResponseUnauthorized, httpResponseErrorToken, httpResponseInternalServerError, httpResponseBadRequest } = require("../helpers/httpResponses");
const { logger } = require("../helpers/logger");
const { generateAccessToken, verifyToken, EXPIRATION_TIME, addToken, removeToken, checkToken } = require("../helpers/token");

const createToken = async (request, response, next) => {
    let user = request.userLogged;
    let accessToken;
    let refreshToken;
    try {
        let payload = {
            username: user.username,
            id: user.id,
            userRole: user.userRole
        }
        accessToken = await generateAccessToken(payload, EXPIRATION_TIME.INSTANT);
        await addToken(user.id, accessToken);
        refreshToken = await generateAccessToken(payload, EXPIRATION_TIME.LONG_TIME);
        await addToken(user.id, refreshToken);
    } catch (error) {
        removeToken(user.id, accessToken);
        removeToken(user.id, refreshToken);
        return httpResponseInternalServerError(response, error);
    }

    let payload = {
        message: "Login successful",
        body: {
            id: user.id,
            accessToken,
            refreshToken
        }
    }
    return httpResponseOk(response, payload);
}

const authenticateToken = async (request, response, next) => {
    let accessToken = request.headers.authorization;
    let { id } = request.body;
    let value;
    try {
        value = await checkToken(id, accessToken);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    if (value === "nil") return httpResponseErrorToken(response, "Refresh token cache error");
    if (value === "invalid" || !value) return httpResponseUnauthorized(response);
    try {
        await verifyToken(accessToken);
    } catch (error) {
        return httpResponseErrorToken(response, error.message);
    }
    // response.next()
    return response.send("OK YOU HAVE ACCESS :)");
}

const refreshToken = async (request, response, next) => {
    let refreshToken = request.headers.authorization;
    let { id } = request.body;

    let value;
}

module.exports = { createToken }