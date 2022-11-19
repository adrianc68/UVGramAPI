const { generateRefreshToken: generateRefreshTokenHelper, generateAccessToken: generateAcessTokenHelper,
    addToken: addTokenHelper, removeToken: removeTokenHelper, verifyToken: verifyTokenHelper,
    TOKEN_STATE, TOKEN_TYPE, checkToken: checkTokenHelper } = require("../helpers/token");
const { removeSessionToken } = require("./userDataAccess");

/**
* Check that the token has the VALID status and TokenType 
* is the expected tokenType
* @param {*} token token to be verified.
* @param {*} tokenType type of token expected
* @returns the actual value got from redis database (VALID|INVALID|NILL|Undefined|null)
*/
const getTokenExist = async (token, tokenType) => {
    let value;
    try {
        value = await checkTokenHelper(token);
    } catch (error) {
        throw new Error(error, `${tokenType} not found`)
    }
    if (!value || value == TOKEN_STATE.NIL) {
        throw new Error(`${tokenType} does not exist`);
    } else if (value.split(" ")[0] == TOKEN_STATE.INVALID) {
        throw new Error(`${tokenType} has expired`)
    }
    try {
        let values = await verifyToken(token);
        if (values.tokenType != tokenType) {
            throw (`you must provide a token of type ${tokenType}`)
        }
    } catch (error) {
        throw new Error(error, `${tokenType} is not valid`);
    }
    return value;
};

/**
 * It generates the accessToken and refreshToken
 * @param {*} username data to be save into payload.
 * @param {*} userId data to be save into payload.
 * @param {*} userRole data to be save into payload.
 * @param {*} email data to be save into payload.
 * @returns the accessToken and refreshToken as JSON object.
 */
const generateTokens = async (username, userId, userRole, email) => {
    let accessToken;
    let refreshToken;
    try {
        let payloadAccessToken = {
            id: userId,
            username,
            userRole,
            email
        };
        refreshToken = await generateRefreshTokenHelper(payloadAccessToken);
        accessToken = await generateAcessTokenHelper(payloadAccessToken, refreshToken.jti);
        await addTokenHelper(refreshToken.token, refreshToken.jti);
        await addTokenHelper(accessToken.token, accessToken.jti);
    } catch (error) {
        removeTokenHelper(accessToken.jti);
        removeTokenHelper(refreshToken.jti);
        throw new Error(error);
    }
    let tokensCreated = {
        refreshToken: refreshToken.token,
        accessToken: accessToken.token
    }
    return tokensCreated;
};

/**
 * It generates a new accessToken using a refreshtoken identifier.
 * @param {*} username data to be save into payload.
 * @param {*} userId data to be save into payload.
 * @param {*} userRole data to be save into payload.
 * @param {*} email data to be save into payload.
 * @param {*} refreshTokenJti the identifier of refreshToken
 * @returns the new accessToken as JSON object.
 */
const refreshAccessToken = async (username, userId, userRole, email, refreshTokenJti) => {
    let accessToken;
    try {
        let payloadAccessToken = {
            userId,
            username,
            userRole,
            email
        };
        accessToken = await generateAcessTokenHelper(payloadAccessToken, refreshTokenJti);
        await addTokenHelper(accessToken.token, accessToken.jti);
    } catch (error) {
        removeTokenHelper(accessToken.jti);
        throw new Error(error);
    }
    let tokenCreated = {
        accessToken
    }
    return tokenCreated;
};

/**
 * It receives a optional accessToken and removes if exists from redis server.
 * @param {*} optionalAccessToken the accessToken to be removed
 * @returns undefined if token does not exist and fail message if cannot be removed from redis server
 */
const removeOptionalAccessToken = async (optionalAccessToken) => {
    let optionalOldAccessTokenMessage;
    if (optionalAccessToken) {
        try {
            await verifyTokenHelper(optionalAccessToken);
            await removeTokenHelper(optionalAccessToken);
        } catch (error) {
            optionalOldAccessTokenMessage = {
                message: "Failed to remove access token",
                errorType: error.message
            }
        }
    }
    return optionalOldAccessTokenMessage;
};

/**
 * Remove token from redis server
 * @param {*} token the token to remove that will act as key
 */
const removeToken = async (token) => {
    try {
        await removeTokenHelper(token);
    } catch (error) {
        throw new Error(error);
    }
};

/**
 * Verify if token exist and decode data.
 * @param {*} token the token to be verified.
 * @returns the JWT data decoded.
 */
const verifyToken = async (token) => {
    let tokenVerified;
    try {
        tokenVerified = await verifyTokenHelper(token);
    } catch (error) {
        throw new Error(error);
    }
    return tokenVerified;
};

/**
 * Refresh login of user removing old access token
 * @param {*} accessToken the accesstoken that will be removed
 * @param {*} username the actual user data
 * @param {*} id the actual user data
 * @param {*} userRole the actual user data
 * @param {*} email the actual user data
 * @param {*} refreshTokenJTI the id of refreshToken
 * @returns accessToken regenerated
 */
const refreshLoginAndRemoveOldAccessToken = async (accessToken, username, id, userRole, email, refreshTokenJTI) => {
    let newAccessToken;
    try {
        newAccessToken = await refreshAccessToken(username, id, userRole, email, refreshTokenJTI);
        await removeTokenHelper(accessToken);
    } catch (error) {
        throw new Error(error);
    }
    return newAccessToken;
}

module.exports = {
    removeOptionalAccessToken, refreshAccessToken, generateTokens,
    removeToken, verifyToken, getTokenExist, TOKEN_STATE, TOKEN_TYPE,
    refreshLoginAndRemoveOldAccessToken
}