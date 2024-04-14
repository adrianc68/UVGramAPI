const {Router} = require("express");
const {checkRolesAuth} = require("../v1/controllers/authenticationController");
const {validationAccesTokenDataAsAuthorization, validationRefreshTokenDataAsParameter, validationAccesTokenDataAsOptionalAuthorization} = require("../validators/authenticationValidation");
const {validateAuthorizationTokenFormat, validateRefreshTokenAsParameterFormat, validateOptionalAccessTokenFormat} = require("../validators/formatValidators/authenticationFormatValidator");

const checkAccessTokenAndAuthRoleMiddleware = (roles) => Router().use([
	validateAuthorizationTokenFormat,
	validationAccesTokenDataAsAuthorization,
	checkRolesAuth(roles),
]);

const checkAccessAndRefreshTokenAndAuthRoleMiddleware = (roles) => Router().use([
	validateAuthorizationTokenFormat,
	validateRefreshTokenAsParameterFormat,
	validationAccesTokenDataAsAuthorization,
	validationRefreshTokenDataAsParameter,
	checkRolesAuth(roles),
]);

const checkAccessTokenAsOptionalMiddleware = () => Router().use([
	validateOptionalAccessTokenFormat,
	validationAccesTokenDataAsOptionalAuthorization
]);

module.exports = {checkAccessTokenAndAuthRoleMiddleware, checkAccessAndRefreshTokenAndAuthRoleMiddleware, checkAccessTokenAsOptionalMiddleware}
