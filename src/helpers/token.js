const jwt = require('jsonwebtoken')
const { redisClient } = require("../database/connectionRedis");
const { v4: uuidv4 } = require("uuid");

const EXPIRATION_TIME = {
    INSTANT: process.env.EXPIRATION_TIME_INSTANT,
    LONG: process.env.EXPIRATION_TIME_LONG_TIME
};

const TOKEN_STATE = {
    INVALID: "INVALID",
    VALID: "VALID",
    NIL: "NIL"
};

const TOKEN_TYPE = {
    REFRESH: "refreshToken",
    ACCESS: "accessToken"
};

/**
 * This method generate and signs a token of type refreshToken.
 * @param {*} payload data that must contain an identifier (id), must be the same as the accesstokens payload.
 * @returns the token generated with jti uuidv4 identifier.
 */
const generateRefreshToken = async (payload) => {
    const jti = uuidv4();
    const refreshTokenPayload = {
        id: payload.id,
        tokenType: TOKEN_TYPE.REFRESH
    }
    let refreshToken = jwt.sign(
        refreshTokenPayload,
        process.env.TOKEN_SECRET, {
        expiresIn: EXPIRATION_TIME.LONG,
        jwtid: jti
    });
    return { token: refreshToken, jti }
};
/**
 * This method generate and signs a token of type accessToken
 * and it's need a reference to a refreshToken.
 * @param {*} payload data that contain user data
 * @param {*} refreshTokenId must be the refreshToken id (jti).
 * @returns the token generated with jti uuidv4 identifier.
 */
const generateAccessToken = async (payload, refreshTokenId) => {
    const jti = uuidv4();
    const accessTokenPayload = {
        ...payload,
        refreshTokenId,
        tokenType: TOKEN_TYPE.ACCESS,
    };
    const accessToken = jwt.sign(
        accessTokenPayload,
        process.env.TOKEN_SECRET, {
        expiresIn: EXPIRATION_TIME.INSTANT,
        jwtid: jti
    });
    return { token: accessToken, jti }
};
/**
 * Verify the if JWT exists and decode the JTW data.
 * @param {*} token the token provided.
 * @returns the JTW decoded data.
 */
const verifyToken = async (token) => {
    const tokenVerified = jwt.verify(token, process.env.TOKEN_SECRET);
    return tokenVerified;
};
/**
 * Add token to redis server.
 * @param {*} token that will act as the key.
 * @param {*} jti the value that will be stored as value.
 */
const addToken = async (token, jti) => {
    const check = await redisClient.EXISTS(token);
    if (check == 1) {
        return;
    }
    const value = `${TOKEN_STATE.VALID} ${jti}`
    await redisClient.SET(token, value);
    const payload = await verifyToken(token);
    await redisClient.EXPIREAT(token, +payload.exp);
    return;
};
/**
 * Check if token is stored in redis server
 * @param {*} token that will act as a key.
 * @returns the token value: token state plus Jti).
 */
const checkToken = async (token) => {
    const status = await redisClient.GET(token);
    return status;
};
/**
 * Set the token value into invalid in redis server.
 * @param {*} token that will act as a key.
 * @param {*} jti the token jti value.
 */
const blacklistToken = async (token, jti) => {
    const value = `${TOKEN_STATE.INVALID} ${jti}`
    const status = await redisClient.SET(token, value);
    if (status == "nil") return;
    const payload = await verifyToken(token);
    await redisClient.EXPIREAT(token, +payload.exp);
    return;
};
/**
 * Remove token from redis server.
 * @param {*} token that will act as a key.
 */
const removeToken = async (token) => {
    await redisClient.del(token);
};

module.exports = {
    generateRefreshToken, generateAccessToken, verifyToken,
    addToken, checkToken, blacklistToken,
    removeToken, TOKEN_STATE, TOKEN_TYPE
}