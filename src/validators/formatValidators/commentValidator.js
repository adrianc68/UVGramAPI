const {validateError} = require("../../middleware/validationFormatMiddleware");
const {validateCommentUUID, validateCommentData} = require("./formatValidator");

const validateUUIDCommentDataFormat = [
	validateCommentUUID,
	(request, response, next) => {
		validateError(request, response, next);
	}
];

const validateCommentDataFormat = [
	validateCommentData,
	(request, response, next) => {
		validateError(request, response, next);
	}
];

module.exports = {
	validateUUIDCommentDataFormat, validateCommentDataFormat
}
