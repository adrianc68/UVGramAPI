const router = require('express').Router();
const { httpResponseValidation } = require('../../helpers/httpResponses');
const { validatePasswordData, validateLoginData, validateAuthorizationHeaderData, validateIdHeaderData } = require('./formatValidator');

const formatValidationLogin = [
    validateLoginData,
    validatePasswordData,
    (request, response, next) => {
        return httpResponseValidation(request, response, next);
    }
];

const formatValidationToken = [
    validateAuthorizationHeaderData,
    validateIdHeaderData,
    (request, response, next) => {
        return httpResponseValidation(request, response, next);
    }
]


module.exports = { formatValidationLogin, formatValidationToken }

