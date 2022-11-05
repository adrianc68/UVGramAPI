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
    REFRESH: "REFRESH",
    ACCESS: "ACCESS"
};

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

const verifyToken = async (token) => {
    const tokenVerified = jwt.verify(token, process.env.TOKEN_SECRET);
    return tokenVerified;
};

const addToken = async (token, jti) => {
    const check = await redisClient.EXISTS(token); // check if key exists in cache
    if (check == 1) {
        return;
    }
    const value = `${TOKEN_STATE.VALID} ${jti}`
    await redisClient.SET(token, value);
    const payload = await verifyToken(token); // verify and decode the JWT
    await redisClient.EXPIREAT(token, +payload.exp); // set expiry date for the key in the cache
    return;
};

const checkToken = async (token) => {
    const status = await redisClient.GET(token); // get the token from the cache and return its value
    return status;
};

const blacklistToken = async (token, jti) => {
    const value = `${TOKEN_STATE.INVALID} ${jti}`
    const status = await redisClient.SET(token, value);
    if (status == "nil") return;
    const payload = await verifyToken(token); // verify and decode the JWT
    await redisClient.EXPIREAT(token, +payload.exp); // set time duration for the token to removed from the cache
    return;
};

const removeToken = async (token) => {
    await redisClient.del(token);
};

module.exports = {
    generateRefreshToken, generateAccessToken, verifyToken,
    addToken, checkToken, blacklistToken,
    removeToken, TOKEN_STATE
}