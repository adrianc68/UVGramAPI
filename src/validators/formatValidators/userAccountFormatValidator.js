const router = require('express').Router();
const { httpResponseValidation } = require('../../helpers/httpResponses');
const { validateNameData, validatePresentationData, validateUsernameData, validatePasswordData,
    validatePhoneNumberData, validateEmailData, validateBirthdateData, validateVerificationCodeData } = require('./formatValidator');

const formatValidationUserAccountData = [
    validateNameData,
    validatePresentationData,
    validateUsernameData,
    validatePasswordData,
    validatePhoneNumberData,
    validateEmailData,
    validateBirthdateData,
    (request, response, next) => {
        return httpResponseValidation(request, response, next);
    }
];

const formatValidationAccountEmail = [
    validateEmailData,
    (request, response, next) => {
        return httpResponseValidation(request, response, next);
    }
];

const formatValidationAccountUsername = [
    validateUsernameData,
    (request, response, next) => {
        return httpResponseValidation(request, response, next);
    }
];

const formatValidationVerificationCode = [
    validateVerificationCodeData,
    (request, response, next) => {
        return httpResponseValidation(request, response, next);
    }
]

module.exports = {
    formatValidationUserAccountData, formatValidationAccountEmail, formatValidationAccountUsername,
    formatValidationVerificationCode
}

