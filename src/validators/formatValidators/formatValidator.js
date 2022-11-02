const router = require('express').Router();
const { check, param, body, header } = require('express-validator');
const { httpResponseValidation } = require('../../helpers/httpResponses');

const validateEmailData = [
    check("email")
        .trim()
        .not()
        .isEmpty()
        .withMessage("email is required")
        .bail()
        .isEmail()
        .normalizeEmail()
        .withMessage("email is invalid")
];

const validateUsernameData = [
    check("username")
        .not()
        .isEmpty()
        .withMessage("username is required")
        .bail()
        .matches(/^[\w\d]+(\.([\w\d]+))*$/)
        .withMessage("username is invalid. Can include numbers, letter, period and underscore")
];

const validateNameData = [
    check("name")
        .not()
        .isEmpty()
        .withMessage("name is required")
        .bail()
        .matches(/^[a-zA-Z]+(\ ([a-zA-Z]+))*$/)
        .withMessage("name is invalid. Can only contain letters")
];

const validatePresentationData = [
    check("presentation")
        .trim()
];

const validatePasswordData = [
    check("password")
        .not()
        .isEmpty()
        .withMessage("password is required")
        .bail()
        .isLength({ min: 6 })
        .withMessage("password must be 6 or more characters")
];

const validatePhoneNumberData = [
    check("phoneNumber")
        .isLength({ min: 8 })
        .withMessage("phone number must be 8 or more characters")
];

const validateBirthdateData = [
    check("birthdate")
        .isISO8601('yyyy-mm-dd')
        .withMessage("birthday format is invalid")
        .bail()
        .custom((value, { req }) => {
            return isValidDate(value);
        })
        .withMessage("birthday does not exist")
];

const validateLoginData = [
    check("emailOrUsername")
        .not()
        .isEmpty()
        .withMessage("emailOrUsername is required")
];

const validateVerificationCodeData = [
    body("verificationCode")
    .not()
    .isEmpty()
    .withMessage("verificationCode is required")
];

const validateAuthorizationHeaderData = [
    header("authorization")
        .not()
        .isEmpty()
        .withMessage("authorization header is required")
        .bail()
        .matches(/^Bearer\s{1}([^ ]+)$/)
        .withMessage("Bearer token is invalid")
];

const validateIdHeaderData = [
    header("id")
        .not()
        .isEmpty()
        .withMessage("id header is required")
        .bail()
        .isNumeric()
        .withMessage("id must be integer")
];

const isValidDate = (dateString) => {
    // Parse the date parts to integers
    var parts = dateString.split("-");
    var day = parseInt(parts[2], 10);
    var month = parseInt(parts[1], 10);
    var year = parseInt(parts[0], 10);
    // Check the ranges of month and year
    if (year < 1000 || year > 3000 || month == 0 || month > 12)
        return false;
    var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    // Adjust for leap years
    if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        monthLength[1] = 29;
    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
}


module.exports = {
    validateEmailData, validateUsernameData, validateNameData,
    validatePresentationData, validatePasswordData, validatePhoneNumberData,
    validateBirthdateData, validateLoginData, validateAuthorizationHeaderData,
     validateIdHeaderData, validateVerificationCodeData
}