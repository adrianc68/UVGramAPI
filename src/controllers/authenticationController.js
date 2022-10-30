const { httpResponseOk, httpResponseUnauthorized, httpResponseErrorToken } = require("../helpers/httpResponses");
const { logger } = require("../helpers/logger");
const { generateAccessToken, verifyToken } = require("../helpers/token");

const createToken = async (request, response, next) => {
    let user = request.userLogged;
    let token = await generateAccessToken(user.username, user.id, user.userRole);
    httpResponseOk(response, { user, token });
}

const authenticateToken = async (request, response, next) => {
    let token = request.headers.authorization;
    if (token == null) {
        return httpResponseUnauthorized(response);
    }
    try {
        let tokenVerified = await verifyToken(token);
    } catch (error) {
        return httpResponseErrorToken(response, error.message)
    }

    return next();
}

module.exports = { createToken, authenticateToken }