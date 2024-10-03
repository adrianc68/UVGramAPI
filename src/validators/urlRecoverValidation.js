const {getDataURLRecover, doesURLVerificationAlreadyGenerated} = require("../dataaccess/urlRecoverDataAccess");
const {getAccountLoginData} = require("../dataaccess/userDataAccess");
const {TOO_MANY_REQUESTS, INTERNAL_SERVER_ERROR, NOT_FOUND} = require("../services/httpResponsesService");
const {apiVersionType} = require("../types/apiVersionType");
const MessageType = require("../types/MessageType");

const validationURLRecover = async (request, response, next) => {
	let uri = request.query;
	let result;
	try {
		result = await getDataURLRecover(uri);
		response.locals.data = result;
	} catch (error) {
		return NOT_FOUND(response, MessageType.USER.URL_INVALID, apiVersionType.V1);
	}
	if (!result) {
		return NOT_FOUND(response, MessageType.USER.URL_EXPIRED, apiVersionType.V1);
	}
	return next();
};

const validationIsURLRecoverAlreadyGeneratedByEmailOrUsername = async (request, response, next) => {
	let {emailOrUsername} = request.body;
	try {
		let userData = await getAccountLoginData(emailOrUsername);
		let isAlreadyURLGenerated = await doesURLVerificationAlreadyGenerated(userData.id);
		if (isAlreadyURLGenerated) {
			return TOO_MANY_REQUESTS(response, MessageType.USER.WAITFOR_GENERATE_URL, apiVersionType.V1);
		}
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	return next();
}


module.exports = {validationURLRecover, validationIsURLRecoverAlreadyGeneratedByEmailOrUsername}
