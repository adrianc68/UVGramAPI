const jwt = require('jsonwebtoken')
const { redisClient } = require("../database/connectionRedis");

const EXPIRATION_TIME = {
    INSTANT: "10s",
    LONG_TIME: "12h"
}

const TOKEN_STATE = {
    INVALID: "INVALID",
    VALID: "VALID",
    NIL: "NIL"
}

const generateAccessToken = async (payload, expirationTime) => {
    return jwt.sign(
        payload,
        process.env.TOKEN_SECRET, {
        expiresIn: expirationTime
    }
    );
}

const verifyToken = async (token) => {
    token = await token.replace("Bearer ", "");
    const tokenVerified = jwt.verify(token, process.env.TOKEN_SECRET);
    return tokenVerified;
}

const addToken = async (userID, token) => {
    const key = `${userID}_${token}`;
    const check = await redisClient.EXISTS(key); // check if key exists in cache (see later... $BG)
    if (check == 1) {
        return;
    }
    await redisClient.SET(key, "VALID"); // set key value to be 'valid'
    const payload = await verifyToken(token); // verify and decode the JWT
    await redisClient.EXPIREAT(key, +payload.exp); // set expiry date for the key in the cache
    return;
};

const checkToken = async (userID, token) => {
    const key = `${userID}_${token}`;
    const status = await redisClient.GET(key); // get the token from the cache and return its value
    return status;
};

const blacklistToken = async (userID, token) => {
    const key = `${userID}_${token}`;
    const status = await redisClient.SET(key, "INVALID"); // set key value to be 'invalid'
    if (status == "nil") return "Token doesn't exist";
    const payload = await verifyToken(token); // verify and decode the JWT
    await redisClient.EXPIREAT(key, +payload.exp); // set time duration for the token to removed from the cache
    return 0;
};

const blacklistAllToken = async (userID, token) => {
    for await (const key of redisClient.scanIterator({ // scan the cache and return all token with the id
        MATCH: `${userID}*`,
    })) {
        await redisClient.set(key, "invalid"); // invaliadate each key
        const payload = await verifyToken(token); // verify and decode the JWT
        await redisClient.EXPIREAT(key, +payload.exp); // set time duration for the token to removed from the cache
    }
    return;
};

const removeToken = async (userID, token) => {
    const key = `${userID}_${token}`;
    await redisClient.del(key);
}

const getAllTokens = async () => {
    for await (const key of redisClient.scanIterator()) {
        console.log("Token got it: " + key);
    }
    return;
}

module.exports = {
    generateAccessToken, verifyToken, addToken,
    checkToken, blacklistToken, blacklistAllToken,
    getAllTokens, removeToken, EXPIRATION_TIME, TOKEN_STATE
}