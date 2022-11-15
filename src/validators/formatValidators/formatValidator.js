const { check, body, header } = require('express-validator');

const validateEmailData = [
    check("email")
        .trim()
        .not()
        .isEmpty()
        .withMessage("email is required")
        .bail()
        .isLength({ min: 3, max: 254 })
        .withMessage("email allowed length: {min: 3, max: 254}")
        .bail()
        .isEmail()
        .normalizeEmail()
        .withMessage("email format is not valid. must have allowed format: hello@example.com")
];

const validateUsernameData = [
    check("username")
        .not()
        .isEmpty()
        .withMessage("username is required")
        .bail()
        .isLength({ min: 3, max: 30 })
        .withMessage("username must have the allowed length: {min: 3, max: 30}")
        .matches(/^[\w\d]+(\.([\w\d]+))*$/)
        .withMessage("username is not valid, must have allowed characters: words, numbers. no allowed spaces and period as last character")
        .isLowercase()
        .withMessage("username is not valid, must have allowed characters: only lowercase allowed")
];

const validateNameData = [
    check("name")
        .optional({ nullable: true })
        .bail()
        .isLength({ min: 3, max: 64 })
        .withMessage("name must have the allowed length: {min: 3, max: 64}")
        .bail()
        .matches(/^[a-zA-Zñ]+(\ ([a-zA-Zñ]+))*$/)
        .withMessage("name is not valid, must have allowed characters: a-zA-Z and one space between words")
];

const validatePresentationData = [
    check("presentation")
        .optional({ nullable: true })
        .bail()
        .isLength({ min: 0, max: 150 })
        .withMessage("presentation must have the allowed length: {min: 0, max: 150}")
];

const validatePasswordData = [
    check("password")
        .not()
        .isEmpty()
        .withMessage("password is required")
        .bail()
        .isLength({ min: 6, max: 128 })
        .withMessage("password must have the allowed length: {min: 6, max: 128}")
];

const validatePhoneNumberData = [
    check("phoneNumber")
        .isLength({ min: 8, max: 15 })
        .withMessage("phoneNumber must have the allowed length: {min: 8, max: 15}")
        .matches(/^[\d]*$/)
        .withMessage("phoneNumber must have the allowed characters: digits")
];

const validateBirthdateData = [
    check("birthdate")
        .isISO8601('yyyy-mm-dd')
        .withMessage("birthday format is invalid, must have the allowed format: yyyy-mm-dd")
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
        .bail()
        .isLength({ min: 3, max: 254 })
        .withMessage("emailOrUsername must have the allowed length: {min: 3, max: 254}")
];

const validateVerificationCodeData = [
    body("verificationCode")
        .not()
        .isEmpty()
        .withMessage("verificationCode is required")
        .isLength({ min: 8, max: 8 })
        .withMessage("verificationCode must have the allowed length: {min: 8, max:8}")
];

const validateAuthorizationHeaderData = [
    header("authorization")
        .not()
        .isEmpty()
        .withMessage("authorization header is required")
        .bail()
        .matches(/^Bearer\s{1}([^ ]+)$/)
        .withMessage("Bearer token is not valid, you must provide a valid token format")
];

const validateAccessTokenParameterData = [
    header("accessToken")
        .not()
        .isEmpty()
        .withMessage("accessToken header is required")
        .bail()
        .matches(/^Bearer\s{1}([^ ]+)$/)
        .withMessage("Bearer token is not valid, you must provide a valid token format")
];

const validateRefreshTokenParameterData = [
    header("refreshToken")
        .not()
        .isEmpty()
        .withMessage("refreshToken header is required")
        .bail()
        .matches(/^Bearer\s{1}([^ ]+)$/)
        .withMessage("Bearer token is not valid, you must provide a valid token format")
];

const validateOptionalAccessTokenParameterData = [
    header("accessToken")
        .optional({ nullable: false })
        .not()
        .isEmpty()
        .withMessage("accessToken header is optional, but is not allowed to be empty")
        .bail()
        .matches(/^Bearer\s{1}([^ ]+)$/)
        .withMessage("Bearer token is not valid, you must provide a valid token format")
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
};

module.exports = {
    validateEmailData, validateUsernameData, validateNameData,
    validatePresentationData, validatePasswordData, validatePhoneNumberData,
    validateBirthdateData, validateLoginData, validateVerificationCodeData,
    validateAuthorizationHeaderData, validateAccessTokenParameterData, validateRefreshTokenParameterData,
    validateOptionalAccessTokenParameterData
}