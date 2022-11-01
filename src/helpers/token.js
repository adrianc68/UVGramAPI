const jwt = require('jsonwebtoken')
const { redisClient } = require("../database/connectionRedis");
const { logger } = require('./logger');

const EXPIRATION_TIME = {
    INSTANT: "15s",
    LONG_TIME: "12h"
}

const TOKEN_STATE = {
    INVALID: "INVALID",
    VALID: "VALID",
    NIL: "NIL"
}

const generateToken = async (payload, expirationTime) => {
    return jwt.sign(
        payload,
        process.env.TOKEN_SECRET, {
        expiresIn: expirationTime
    });
}

const verifyToken = async (token) => {
    const tokenVerified = jwt.verify(token, process.env.TOKEN_SECRET);
    return tokenVerified;
}

const addToken = async (userID, token) => {
    const key = `${userID}_${token}`;
    const check = await redisClient.EXISTS(key); // check if key exists in cache (see later... $BG)
    if (check == 1) {
        return;
    }
    await redisClient.SET(key, TOKEN_STATE.VALID); // set key value to be 'valid'
    const payload = await verifyToken(token); // verify and decode the JWT
    await redisClient.EXPIREAT(key, +payload.exp); // set expiry date for the key in the cache
    return;
};

const checkToken = async (userID, token) => {
    const key = `${userID}_${token}`;
    const status = await redisClient.GET(key); // get the token from the cache and return its value
    return status;
};
// SEE THIS
const blacklistToken = async (userID, token) => {
    const key = `${userID}_${token}`;
    const status = await redisClient.SET(key, TOKEN_STATE.INVALID); // set key value to be 'invalid'
    if (status == "nil") return "Token doesn't exist";
    const payload = await verifyToken(token); // verify and decode the JWT
    await redisClient.EXPIREAT(key, +payload.exp); // set time duration for the token to removed from the cache
    return 0;
};
// SEE THIS
const blacklistAllToken = async (userID, token) => {
    for await (const key of redisClient.scanIterator({ // scan the cache and return all token with the id
        MATCH: `${userID}*`,
    })) {
        await redisClient.set(key, TOKEN_STATE.INVALID); // invaliadate each key
        const payload = await verifyToken(token); // verify and decode the JWT
        await redisClient.EXPIREAT(key, +payload.exp); // set time duration for the token to removed from the cache
    }
    return;
};

const removeToken = async (userID, token) => {
    const key = `${userID}_${token}`;
    await redisClient.del(key);
}

// JUST FOR DEBUG
const getAllTokens = async () => {
    for await (const key of redisClient.scanIterator()) {
        console.log("Token got it: " + key);
    }
    return;
}

module.exports = {
    generateToken, verifyToken, addToken,
    checkToken, blacklistToken, blacklistAllToken,
    getAllTokens, removeToken, EXPIRATION_TIME, TOKEN_STATE
}