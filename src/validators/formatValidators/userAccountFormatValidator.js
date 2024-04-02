const {httpResponseValidation} = require('../../helpers/httpResponses');
const {validateError} = require('../../middleware/validationFormatMiddleware');
const {validateNameData, validatePresentationData, validateUsernameData, validatePasswordFormatData,
	validatePhoneNumberData, validateEmailData, validateBirthdateData, validateVerificationCodeFormatData, validateOldPasswordFormatData, validateEmailAsOptional, validateIdCareer, validateGenderData, validateCategory, validateCity, validatePostalCode, validatePostalAddress, validateContactEmail, validatePhoneContact, validateOrganizationName, validateNewRoleTypeFormatData, validateUserPrivacyData} = require('./formatValidator');

const validateUserAccountDataFormat = [
	validateNameData,
	validatePresentationData,
	validateUsernameData,
	validatePasswordFormatData,
	validatePhoneNumberData,
	validateEmailData,
	validateBirthdateData,
	(request, response, next) => {
		validateError(request, response, next);
	}
];

const validateBasicUserAccountDataFormat = [
	validateNameData,
	validatePresentationData,
	validateUsernameData,
	validatePhoneNumberData,
	validateEmailAsOptional,
	validateBirthdateData,
	(request, response, next) => {
		validateError(request, response, next);
	}
];

const validatePersonalDataFormat = [
	validateIdCareer,
	validateGenderData,
	(request, response, next) => {
		validateError(request, response, next);
	}
];

const validateBusinessDataFormat = [
	validateCategory,
	validateCity,
	validatePostalCode,
	validatePostalAddress,
	validateContactEmail,
	validatePhoneContact,
	validateOrganizationName,
	(request, response, next) => {
		validateError(request, response, next);
	}
];

const validateAdminDataFormat = [
	(request, response, next) => {
		validateError(request, response, next);
	}
];

const validateModeratorDataFormat = [
	(request, response, next) => {
		validateError(request, response, next);
	}
];

const validateAccountEmailFormat = [
	validateEmailData,
	(request, response, next) => {
		validateError(request, response, next);
	}
];

const validateAccountUsernameFormat = [
	validateUsernameData,
	(request, response, next) => {
		validateError(request, response, next);
	}
];

const validateVerificationCodeFormat = [
	validateVerificationCodeFormatData,
	(request, response, next) => {
		validateError(request, response, next);
	}
];

const validateOldPasswordFormat = [
	validateOldPasswordFormatData,
	(request, response, next) => {
		validateError(request, response, next);
	}
];

const validatePasswordFormat = [
	validatePasswordFormatData,
	(request, response, next) => {
		validateError(request, response, next);
	}
];

const validateNewRoleTypeFormat = [
	validateNewRoleTypeFormatData,
	(request, response, next) => {
		validateError(request, response, next);
	}
];

const validatePrivacyDataFormat = [
	validateUserPrivacyData,
	(request, response, next) => {
		validateError(request, response, next);
	}
];

module.exports = {
	validateUserAccountDataFormat, validateAccountEmailFormat, validateAccountUsernameFormat,
	validateVerificationCodeFormat, validateOldPasswordFormat, validatePasswordFormat,
	validateBasicUserAccountDataFormat, validatePersonalDataFormat, validateBusinessDataFormat,
	validateAdminDataFormat, validateModeratorDataFormat, validateNewRoleTypeFormat, validatePrivacyDataFormat
}

