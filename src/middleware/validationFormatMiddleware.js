const {validationResult} = require("express-validator");
const {BAD_REQUEST} = require("../services/httpResponsesService");
const MessageType = require("../types/MessageType");

const validateError = (request, response, next, apiVersionType = null) => {
	const errors = validationResult(request);
	if (!errors.isEmpty()) {
		let payload = {errors: errors.array(), ...MessageType.USER.INVALID_DATA}
		return BAD_REQUEST(response, payload, apiVersionType)
	}
	return next();
}

module.exports = {validateError}
