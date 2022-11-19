const { Router } = require("express");
const { checkAuthRole } = require("../controllers/authenticationController");
const { validationAccesTokenDataAsAuthorization, validationRefreshTokenDataAsAuthorization, validationRefreshTokenDataAsParameter } = require("../validators/authenticationValidation");
const { formatValidationAuthorizationToken, formatValidationRefreshTokenAsParameter } = require("../validators/formatValidators/authenticationFormatValidator");

const checkAccessTokenAndAuthRoleMiddleware = (roles) => Router().use([
    formatValidationAuthorizationToken,
    validationAccesTokenDataAsAuthorization,
    checkAuthRole(roles),
]);

const checkAccessAndRefreshTokenAndAuthRoleMiddleware = (roles) => Router().use([
    formatValidationAuthorizationToken,
    formatValidationRefreshTokenAsParameter,
    validationAccesTokenDataAsAuthorization,
    validationRefreshTokenDataAsParameter,
    checkAuthRole(roles),
]);

module.exports = { checkAccessTokenAndAuthRoleMiddleware, checkAccessAndRefreshTokenAndAuthRoleMiddleware }