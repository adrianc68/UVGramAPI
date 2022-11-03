const router = require('express').Router();
const { httpResponseValidation } = require('../../helpers/httpResponses');
const { validatePasswordData, validateLoginData, validateAuthorizationHeaderData, validateAccessTokenIdHeaderData, validateRefreshTokenIdHeaderData, validateAccessTokenParameterData, validateAccessTokenIdOptionalHeaderData } = require('./formatValidator');

const formatValidationLogin = [
    validateLoginData,
    validatePasswordData,
    (request, response, next) => {
        return httpResponseValidation(request, response, next);
    }
];

const formatValidationAccessToken = [
    validateAuthorizationHeaderData,
    validateAccessTokenIdHeaderData,
    (request, response, next) => {
        return httpResponseValidation(request, response, next);
    }
]

const formatValidationRefreshToken = [
    validateAuthorizationHeaderData,
    validateRefreshTokenIdHeaderData,
    (request, response, next) => {
        return httpResponseValidation(request, response, next);
    }
]

const formatValidationRefreshAndAccessToken = [
    validateAuthorizationHeaderData,
    validateRefreshTokenIdHeaderData,
    validateAccessTokenParameterData,
    validateAccessTokenIdHeaderData,
    (request, response, next) => {
        return httpResponseValidation(request, response, next);
    }
]

module.exports = {
    formatValidationLogin, formatValidationAccessToken, formatValidationRefreshToken,
    formatValidationRefreshAndAccessToken
}

