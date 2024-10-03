const {getChatByUuid} = require("../dataaccess/chatDataAccess");
const {httpResponseForbidden} = require("../helpers/httpResponses");
const {INTERNAL_SERVER_ERROR} = require("../services/httpResponsesService");
const MessageType = require("../types/MessageType");
const {apiVersionType} = require("../types/apiVersionType");


const validationDoesChatExistByUuid = async(request, response, next) => {
	let uuid = request.params.uuid;
	if(!uuid) uuid = request.body.uuid;
	try {
		let chatData = await getChatByUuid(uuid);
		response.locals.chatData = chatData;
		if(!chatData) {
			let payload = {...MessageType.USER.DATA_NOT_FOUND}
			return httpResponseForbidden(response, payload);
		}
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	return next();
}

module.exports = {validationDoesChatExistByUuid}
