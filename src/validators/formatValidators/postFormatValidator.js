const {validateError} = require('../../middleware/validationFormatMiddleware');
const {validateFileData, validatePostDescriptionData, validatePostCommentsAllowed, validatePostLikesAllowed, validatePostUUID} = require('./formatValidator');

const validatePostDataFormat = [
	validateFileData,
	validatePostDescriptionData,
	validatePostCommentsAllowed,
	validatePostLikesAllowed,
	(request, response, next) => {
		validateError(request, response, next);
	}
];

const validateFileDataFormat = [
	validateFileData,
	(request, response, next) => {
		validateError(request, response, next);
	}
]

const validateUUIDPostDataFormat = [
	validatePostUUID,
	(request, response, next) => {
		validateError(request, response, next);
	}
];

module.exports = {
	validatePostDataFormat, validateUUIDPostDataFormat, validateFileDataFormat
}
