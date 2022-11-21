const { Router } = require("express");
const { checkRolesAuth } = require("../controllers/authenticationController");
const { validationAccesTokenDataAsAuthorization, validationRefreshTokenDataAsAuthorization, validationRefreshTokenDataAsParameter } = require("../validators/authenticationValidation");
const { formatValidationAuthorizationToken, formatValidationRefreshTokenAsParameter } = require("../validators/formatValidators/authenticationFormatValidator");

const checkAccessTokenAndAuthRoleMiddleware = (roles) => Router().use([
    formatValidationAuthorizationToken,
    validationAccesTokenDataAsAuthorization,
    checkRolesAuth(roles),
]);

const checkAccessAndRefreshTokenAndAuthRoleMiddleware = (roles) => Router().use([
    formatValidationAuthorizationToken,
    formatValidationRefreshTokenAsParameter,
    validationAccesTokenDataAsAuthorization,
    validationRefreshTokenDataAsParameter,
    checkRolesAuth(roles),
]);

module.exports = { checkAccessTokenAndAuthRoleMiddleware, checkAccessAndRefreshTokenAndAuthRoleMiddleware }