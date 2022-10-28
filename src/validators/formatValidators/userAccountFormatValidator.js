const router = require('express').Router();
const { httpResponseValidation } = require('../../helpers/httpResponses');
const { validateNameData, validatePresentationData, validateUsernameData, validatePasswordData,
    validatePhoneNumberData, validateEmailData, validateBirthdateData } = require('./formatValidator');

const formatValidationAccountData = [
    validateNameData,
    validatePresentationData,
    validateUsernameData,
    validatePasswordData,
    validatePhoneNumberData,
    validateEmailData,
    validateBirthdateData,
    (request, response, next) => {
        httpResponseValidation(request, response, next);
    }
];

const formatValidationAccountEmail = [
    validateEmailData,
    (request, response, next) => {
        httpResponseValidation(request, response, next);
    }
];

const formatValidationAccountUsername = [
    validateUsernameData,
    (request, response, next) => {
        httpResponseValidation(request, response, next);
    }
];

module.exports = { formatValidationAccountData, formatValidationAccountEmail, formatValidationAccountUsername }

