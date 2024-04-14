const {httpResponseValidation} = require('../../helpers/httpResponses');
const {validateError} = require('../../middleware/validationFormatMiddleware');
const {validatePasswordFormatData, validateEmailOrUsernameData, validateAuthorizationHeaderData,
	validateRefreshTokenParameterData, validateAccessTokenParameterData, validateOptionalAccessTokenParameterData} = require('./formatValidator');

const validateLoginFormat = [
	validateEmailOrUsernameData,
	validatePasswordFormatData,
	(request, response, next) => {
		validateError(request, response, next);
	}
];

const validateEmailOrUsernameFormat = [
	validateEmailOrUsernameData,
	(request, response, next) => {
		validateError(request, response, next);
	}
];

const validateAccessTokenAsParameterFormat = [
	validateAccessTokenParameterData,
	(request, response, next) => {
		validateError(request, response, next);
	}
];

const validateRefreshTokenAsParameterFormat = [
	validateRefreshTokenParameterData,
	(request, response, next) => {
		validateError(request, response, next);
	}
];

const validateRefreshAndAccessTokenFormat = [
	validateAuthorizationHeaderData,
	validateRefreshTokenParameterData,
	(request, response, next) => {
		validateError(request, response, next);
	}
];

const validateAuthorizationTokenFormat = [
	validateAuthorizationHeaderData,
	(request, response, next) => {
		validateError(request, response, next);
	}
];

const validateOptionalAccessTokenFormat = [
	validateOptionalAccessTokenParameterData,
	(request, response, next) => {
		validateError(request, response, next);
	}
];

module.exports = {
	validateRefreshAndAccessTokenFormat, validateAccessTokenAsParameterFormat, validateRefreshTokenAsParameterFormat,
	validateLoginFormat, validateAuthorizationTokenFormat, validateOptionalAccessTokenFormat, validateEmailOrUsernameFormat,
}

