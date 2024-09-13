const {validationResult} = require("express-validator");
const {BAD_REQUEST} = require("../services/httpResponsesService");
const MessageType = require("../types/MessageType");
const fs = require('fs');
const {logger} = require("../helpers/logger");


const validateError = (request, response, next, apiVersionType = null) => {
	const errors = validationResult(request);
	if (!errors.isEmpty()) {
		if (request.files) {
			Object.values(request.files).flat().forEach(file => {
				if (file.tempFilePath) {
					fs.unlink(file.tempFilePath, (err) => {
						if (err) {
							logger.warn(`Error removing file ${file.tempFilePath}:`, err);
						}
					});
				}
			});
		}

		let payload = {errors: errors.array(), ...MessageType.USER.INVALID_DATA}
		return BAD_REQUEST(response, payload, apiVersionType)
	}
	return next();
}

module.exports = {validateError}
