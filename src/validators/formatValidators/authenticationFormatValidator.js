const { httpResponseValidation } = require('../../helpers/httpResponses');
const { validatePasswordFormatData, validateEmailOrUsernameData, validateAuthorizationHeaderData,
    validateRefreshTokenParameterData, validateAccessTokenParameterData, validateOptionalAccessTokenParameterData } = require('./formatValidator');

const validateLoginFormat = [
    validateEmailOrUsernameData,
    validatePasswordFormatData,
    (request, response, next) => {
        return httpResponseValidation(request, response, next);
    }
];

const validateEmailOrUsernameFormat = [
    validateEmailOrUsernameData,
    (request, response, next) => {
        return httpResponseValidation(request, response, next);
    }
];

const validateAccessTokenAsParameterFormat = [
    validateAccessTokenParameterData,
    (request, response, next) => {
        return httpResponseValidation(request, response, next);
    }
];

const validateRefreshTokenAsParameterFormat = [
    validateRefreshTokenParameterData,
    (request, response, next) => {
        return httpResponseValidation(request, response, next);
    }
];

const validateRefreshAndAccessTokenFormat = [
    validateAuthorizationHeaderData,
    validateRefreshTokenParameterData,
    (request, response, next) => {
        return httpResponseValidation(request, response, next);
    }
];

const validateAuthorizationTokenFormat = [
    validateAuthorizationHeaderData,
    (request, response, next) => {
        return httpResponseValidation(request, response, next);
    }
];

const validateOptionalAccessTokenFormat = [
    validateOptionalAccessTokenParameterData,
    (request, response, next) => {
        return httpResponseValidation(request, response, next);
    }
];

module.exports = {
    validateRefreshAndAccessTokenFormat, validateAccessTokenAsParameterFormat, validateRefreshTokenAsParameterFormat,
    validateLoginFormat, validateAuthorizationTokenFormat, validateOptionalAccessTokenFormat, validateEmailOrUsernameFormat,
}

