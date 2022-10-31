const router = require('express').Router();
const { httpResponseValidation } = require('../../helpers/httpResponses');
const { validatePasswordData, validateLoginData, validateTokenData, validateIdData } = require('./formatValidator');

const formatValidationLogin = [
    validateLoginData,
    validatePasswordData,
    (request, response, next) => {
        httpResponseValidation(request, response, next);
    }
];

const formatValidationToken =  [
    validateTokenData,
    validateIdData,
    (request, response, next) => {
        httpResponseValidation(request, response, next);
    }
]
 

module.exports = { formatValidationLogin, formatValidationToken }

