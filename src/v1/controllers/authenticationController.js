const {CREATED, UNAUTHORIZED} = require("../../services/httpResponsesService");
const {apiVersionType} = require("../../types/apiVersionType");
const MessageType = require("../../types/MessageType");
const {generateTokens, deleteAllSessionByAccessToken, verifyToken, removeToken, refreshAccessToken} = require("../../dataaccess/tokenDataAccess");
const {getAccountLoginData, getAccountLoginDataById} = require("../../dataaccess/userDataAccess");

const createTokens = async (request, response) => {
	let {emailOrUsername} = request.body;
	let tokens;
	try {
		let userData = await getAccountLoginData(emailOrUsername);
		let device_info = request.headers.host;
		tokens = await generateTokens(userData.id, userData.role, device_info);
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	return CREATED(response, tokens, apiVersionType.V1);
};

const refreshTokens = async (request, response) => {
	let newAccessToken;
	let refreshToken = (request.headers.authorization).split(" ")[1];
	let resultRemoveAccessToken;
	try {
		let refreshTokenData = await verifyToken(refreshToken);
		let userData = await getAccountLoginDataById(refreshTokenData.id);
		newAccessToken = await refreshAccessToken(userData.id, userData.role, refreshTokenData.jti);

		if (request.headers.accesstoken) {
			let optionalAccessToken = (request.headers.accesstoken).split(" ")[1];
			let optionalTokenData = await verifyToken(optionalAccessToken);
			if (optionalTokenData.refreshTokenJti == refreshTokenData.jti) {
				resultRemoveAccessToken = (optionalAccessToken) ? await removeToken(optionalAccessToken) : undefined;
			} else {
				resultRemoveAccessToken = MessageType.USER.UNAUTHORIZED;
			}
		}
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	const payload = {
		accessToken: newAccessToken.accessToken.token,
		optionalAccessTokenMessage: resultRemoveAccessToken
	}
	return OK(response, payload, apiVersionType.V1);
};

const logoutSession = async (request, response) => {
	let accessToken = (request.headers.authorization).split(" ")[1];
	try {
		await deleteAllSessionByAccessToken(accessToken);
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	return OK(response, MessageType.USER.LOGOUT_SUCESSFUL, apiVersionType.V1);
};

const checkRolesAuth = (roles) => async (request, response, next) => {
	const token = (request.headers.authorization).split(" ")[1];
	let userRoleData;
	try {
		userRoleData = (await verifyToken(token)).userRole;
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	let rolesAllowed = [].concat(roles);
	if (!rolesAllowed.includes(userRoleData)) {
		return UNAUTHORIZED(response, MessageType.USER.UNAUTHORIZED, apiVersionType.V1);
	}
	return next();
};

const sayHello = async (request, response) => {
	return response.send("Welcome! This is just for testing purposes");
};

module.exports = {createTokens, refreshTokens, logoutSession, checkRolesAuth, sayHello}
