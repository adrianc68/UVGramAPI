const {encondePassword} = require("../helpers/cipher");
const {getAccountLoginData} = require("../dataaccess/userDataAccess");
const {getTokenExist, TOKEN_TYPE} = require("../dataaccess/tokenDataAccess");
const {AccountStatusType} = require("../models/enum/AccountStatusType");
const {UNAUTHORIZED, FORBIDDEN, NOT_FOUND, INTERNAL_SERVER_ERROR} = require("../services/httpResponsesService");
const MessageType = require("../types/MessageType");
const {apiVersionType} = require("../types/apiVersionType");

const doesExistUser = (user) => {
	let doesExistUser = false;
	if (user != undefined && user.length !== 0) {
		doesExistUser = true;
	}
	return doesExistUser;
};

const doesPasswordMatch = (passwordA, passwordB) => {
	let doesPasswordMatch = false;
	if (passwordA == passwordB) {
		doesPasswordMatch = true;
	}
	return doesPasswordMatch;
};

const validationLoginData = async (request, response, next) => {
	const {emailOrUsername, password} = request.body;
	try {
		await getAccountLoginData(emailOrUsername).then(userData => {
			if (doesExistUser(userData)) {
				if (userData.account_status == AccountStatusType.BLOCKED) {
					return FORBIDDEN(response, MessageType.USER.USER_BLOCKED, apiVersionType.V1);
				}
				if (doesPasswordMatch(encondePassword(password), userData.password)) {
					return next();
				} else {
					return UNAUTHORIZED(response, MessageType.USER.BAD_PASSWORD, apiVersionType.V1);
				}
			} else {
				return NOT_FOUND(response, MessageType.USER.USER_NOT_FOUND, apiVersionType.V1);
			}
		});
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
};

const validationAccesTokenDataAsAuthorization = async (request, response, next) => {
	let accessToken = (request.headers.authorization).split(" ")[1];
	try {
		await getTokenExist(accessToken, TOKEN_TYPE.ACCESS);
	} catch (error) {
		return UNAUTHORIZED(response, MessageType.USER.UNAUTHORIZED);
	}
	return next();
};

const validationRefreshTokenDataAsAuthorization = async (request, response, next) => {
	let refreshToken = (request.headers.authorization).split(" ")[1];
	try {
		await getTokenExist(refreshToken, TOKEN_TYPE.REFRESH);
	} catch (error) {
		console.log(error);
		return UNAUTHORIZED(response, MessageType.USER.UNAUTHORIZED, apiVersionType.V1);
	}
	return next();
};

const validationRefreshTokenDataAsParameter = async (request, response, next) => {
	let refreshToken = (request.headers.refreshtoken).split(" ")[1];
	try {
		await getTokenExist(refreshToken, TOKEN_TYPE.REFRESH);
	} catch (error) {
		return UNAUTHORIZED(response, MessageType.UNAUTHORIZED, apiVersionType.V1);
	}
	return next();
};

const validationAccesTokenDataAsOptionalAuthorization = async (request, response, next) => {
	let accessToken = request.headers.authorization;
	if (accessToken == null) {
		return next();
	}
	accessToken = accessToken.split(" ")[1];
	try {
		await getTokenExist(accessToken, TOKEN_TYPE.ACCESS);
	} catch (error) {
		return UNAUTHORIZED(response, MessageType.UNAUTHORIZED, apiVersionType.V1);
	}
	return next();
};

module.exports = {
	validationLoginData, validationAccesTokenDataAsAuthorization, validationRefreshTokenDataAsAuthorization,
	validationRefreshTokenDataAsParameter, validationAccesTokenDataAsOptionalAuthorization
}



