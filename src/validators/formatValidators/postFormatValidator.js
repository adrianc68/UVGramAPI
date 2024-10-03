const {validateError} = require('../../middleware/validationFormatMiddleware');
const {validateFilesData, validatePostDescriptionData, validatePostCommentsAllowed, validatePostLikesAllowed, validatePostUUID, validateOptionalFileData, validateFileData} = require('./formatValidator');

const validatePostDataFormat = [
	validateFilesData,
	validatePostDescriptionData,
	validatePostCommentsAllowed,
	validatePostLikesAllowed,
	(request, response, next) => {
		validateError(request, response, next);
	}
];

const validateFilesDataFormat = [
	validateFilesData,
	(request, response, next) => {
		validateError(request, response, next);
	}
]

const validateFileDataFormat = [
	validateFileData,
	(request, response, next) => {
		validateError(request, response, next);
	}
]

const validateOptionalFileDataFormat = [
	validateOptionalFileData,
	(request, response, next) => {
		validateError(request, response, next);
	}
];

const validateUUIDPostDataFormat = [
	validatePostUUID,
	(request, response, next) => {
		validateError(request, response, next);
	}
];

module.exports = {
	validatePostDataFormat, validateUUIDPostDataFormat, validateFilesDataFormat, 
	validateOptionalFileDataFormat, validateFileDataFormat
}
