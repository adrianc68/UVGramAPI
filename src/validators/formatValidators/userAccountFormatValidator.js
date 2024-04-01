const {httpResponseValidation} = require('../../helpers/httpResponses');
const {validateError} = require('../../middleware/validationFormatMiddleware');
const {validateNameData, validatePresentationData, validateUsernameData, validatePasswordData,
	validatePhoneNumberData, validateEmailData, validateBirthdateData, validateVerificationCodeData, validateOldPasswordData, validateEmailAsOptional, validateIdCareer, validateGenderData, validateCategory, validateCity, validatePostalCode, validatePostalAddress, validateContactEmail, validatePhoneContact, validateOrganizationName, validateNewRoleTypeData, validateUserPrivacyData} = require('./formatValidator');

const validateUserAccountDataFormat = [
	validateNameData,
	validatePresentationData,
	validateUsernameData,
	validatePasswordData,
	validatePhoneNumberData,
	validateEmailData,
	validateBirthdateData,
	(request, response, next) => {
		validateError(request, response, next);
		return response.status(200);
	}
];

const validateBasicUserAccountData = [
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

const validatePersonalData = [
	validateIdCareer,
	validateGenderData,
	(request, response, next) => {
		validateError(request, response, next);
	}
];

const validateBusinessData = [
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

const validateAdminData = [
	(request, response, next) => {
		validateError(request, response, next);
	}
];

const validateModeratorData = [
	(request, response, next) => {
		validateError(request, response, next);
	}
];

const validateAccountEmail = [
	validateEmailData,
	(request, response, next) => {
		validateError(request, response, next);
	}
];

const validateAccountUsername = [
	validateUsernameData,
	(request, response, next) => {
		validateError(request, response, next);
	}
];

const validateVerificationCode = [
	validateVerificationCodeData,
	(request, response, next) => {
		validateError(request, response, next);
	}
];

const validateOldPassword = [
	validateOldPasswordData,
	(request, response, next) => {
		validateError(request, response, next);
	}
];

const validatePassword = [
	validatePasswordData,
	(request, response, next) => {
		validateError(request, response, next);
	}
];

const validateNewRoleType = [
	validateNewRoleTypeData,
	(request, response, next) => {
		validateError(request, response, next);
	}
];

const validatePrivacyData = [
	validateUserPrivacyData,
	(request, response, next) => {
		validateError(request, response, next);
	}
];

module.exports = {
	validateUserAccountDataFormat, validateAccountEmail, validateAccountUsername,
	validateVerificationCode, validateOldPassword, validatePassword,
	validateBasicUserAccountData, validatePersonalData, validateBusinessData,
	validateAdminData, validateModeratorData, validateNewRoleType, validatePrivacyData
}

