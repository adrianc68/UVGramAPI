const { httpResponseInternalServerError, httpResponseNotFound, httpResponseErrorToken, httpResponseForbidden } = require("../helpers/httpResponses");
const { encondePassword } = require("../helpers/cipher");
const { checkToken, verifyToken, TOKEN_STATE, TOKEN_TYPE } = require("../helpers/token");
const { getAccountLoginData } = require("../dataaccess/UserDataAccess");

/**
 * Check if user is not undefined or null.
 * @param {*} user 
 * @returns true if user has content otherwise false.
 */
const doesExistUser = (user) => {
    let doesExistUser = false;
    if (user != undefined && user.length != 0) {
        doesExistUser = true;
    }
    return doesExistUser;
};

/**
 * Check if passwordA is equal to passwordB.
 * @param {*} passwordA 
 * @param {*} passwordB 
 * @returns true if both are equals otherwise false.
 */
const doesPasswordMatch = (passwordA, passwordB) => {
    let doesPasswordMatch = false;
    if (passwordA == passwordB) {
        doesPasswordMatch = true;
    }
    return doesPasswordMatch;
};

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
        value = await checkToken(token);
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
            throw (`you must provide a token of type ${tokenType} `)
        }
    } catch (error) {
        throw new Error(error, `${tokenType} is not valid`);
    }
    return value;
};

const validationLoginData = async (request, response, next) => {
    const { emailOrUsername, password } = request.body;
    try {
        await getAccountLoginData(emailOrUsername).then(user => {
            if (doesExistUser(user)) {
                if (doesPasswordMatch(encondePassword(password), user["Account.password"])) {
                    return next();
                } else {
                    return httpResponseForbidden(response, "password does not match");
                }
            } else {
                return httpResponseNotFound(response, "user not found");
            }
        });
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
};

const validationAccesTokenData = async (request, response, next) => {
    let accessToken = (request.headers.authorization).split(" ")[1];
    try {
        await getTokenExist(accessToken, TOKEN_TYPE.ACCESS);
    } catch (error) {
        const payload = { error: error.message }
        return httpResponseErrorToken(response, payload);
    }
    return next();
};

const validationRefreshTokenData = async (request, response, next) => {
    let refreshToken = (request.headers.authorization).split(" ")[1];
    try {
        await getTokenExist(refreshToken, TOKEN_TYPE.REFRESH);
    } catch (error) {
        const payload = { error: error.message }
        return httpResponseErrorToken(response, payload);
    }
    return next();
};

const validationLogoutTokensData = async (request, response, next) => {
    let accessToken = (request.headers.authorization).split(" ")[1];
    let refreshToken = (request.headers.refreshtoken).split(" ")[1];
    try {
        await getTokenExist(refreshToken, TOKEN_TYPE.REFRESH);
        await getTokenExist(accessToken, TOKEN_TYPE.ACCESS);
    } catch (error) {
        const payload = { error: error.message }
        return httpResponseErrorToken(response, payload);
    }
    return next();
};

module.exports = {
    validationLoginData, validationAccesTokenData, validationRefreshTokenData, validationLogoutTokensData
}



