const {validationResult} = require("express-validator");
const {BAD_REQUEST} = require("../services/httpResponsesService");

const validateError = (request, response, next, apiVersionType = null) => {
	const errors = validationResult(request);
	if (!errors.isEmpty()) {
		let payload = {errors: errors.array()}
		return BAD_REQUEST(response, payload, apiVersionType)
	}
	return next();
}

module.exports = {validateError}
