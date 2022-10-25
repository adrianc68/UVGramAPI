const router = require('express').Router();
const { check, param, body } = require('express-validator');
const { httpResponseValidation } = require('../helpers/httpResponses');
const { logger } = require('../helpers/logger');

const REGEX_USERNAME = "/^[A-Za-z0-9_.]+$/";
const REGEX_EMAIL = "/^[A-Za-z0-9.@_]+$/";

const validateEmailData = [
    check("email")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .normalizeEmail()
    .withMessage("Email is invalid")
];

const validateUsernameData = [
    check("username")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Username is required")
    .bail()
    .matches(/^[\w\d]+(\.([\w\d]+))*$/)
    .withMessage("Username is invalid")
  
]

const validationAccountEmail = [
    validateEmailData,
    (request, response, next) => {
        httpResponseValidation(request, response, next);
    }
];

const validationAccountUsername = [
    validateUsernameData,
    (request, response, next) => {
        httpResponseValidation(request, response, next);
    }
]

module.exports = { validationAccountEmail, validationAccountUsername }

