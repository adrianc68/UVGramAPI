const {isEducationalProgramRegistered} = require("../dataaccess/educationalProgramDataAccess");
const {verifyToken} = require("../dataaccess/tokenDataAccess");
const {isEmailRegistered, isUsernameRegistered, isVerificationCodeGenerated, doesVerificationCodeMatches,
	isOldPasswordValid, getAccountLoginData, getAccountLoginDataById, getActualPrivacyType} = require("../dataaccess/userDataAccess");
const {decryptAES} = require("../helpers/aes-encryption");
const {CategoryType} = require("../models/enum/CategoryType");
const {GenderType} = require("../models/enum/GenderType");
const {INTERNAL_SERVER_ERROR, CONFLICT, NOT_FOUND, TOO_MANY_REQUESTS, BAD_REQUEST, UNAUTHORIZED, OK} = require("../services/httpResponsesService");
const {apiVersionType} = require("../types/apiVersionType");
const MessageType = require("../types/MessageType");

const validationisEmailRegisteredWithNext = async (request, response, next) => {
	let isRegistered;
	try {
		const {email} = request.body;
		isRegistered = await isEmailRegistered(email);
	} catch (err) {
		return INTERNAL_SERVER_ERROR(response, err, apiVersionType.V1);
	}
	if (isRegistered) {
		return CONFLICT(response, {boolValue: isRegistered, ...MessageType.USER.EMAIL_ALREADY_REGISTERED}, apiVersionType.V1);
	} else {
		return next();
	}
};

const validationIsUsernameRegisteredWithNext = async (request, response, next) => {
	let isRegistered;
	try {
		const {username} = request.body;
		isRegistered = await isUsernameRegistered(username);
	} catch (err) {
		return INTERNAL_SERVER_ERROR(response, err, apiVersionType.V1);
	}
	if (isRegistered) {
		return CONFLICT(response, {boolValue: isRegistered, ...MessageType.USER.USER_ALREADY_REGISTERED}, apiVersionType.V1);
	} else {
		return next();
	}
};

const validationIsEmailRegistered = async (request, response) => {
	let isRegistered;
	try {
		let {email} = request.body;
		if (!email) {
			email = request.params.email
			email = decodeURIComponent(email);
		}
		isRegistered = await isEmailRegistered(email);
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	let message;
	if (isRegistered) {
		message = MessageType.USER.EMAIL_ALREADY_REGISTERED;
	} else {
		message = MessageType.USER.EMAIL_NOT_REGISTERED;
	}
	return OK(response, {boolValue: isRegistered, ...message}, apiVersionType.V1);
};

const validationIsUsernameRegistered = async (request, response) => {
	let isRegistered;
	let {username} = request.body;
	if (!username) username = request.params.username;
	try {
		isRegistered = await isUsernameRegistered(username);
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	let messageData;
	if (isRegistered) {
		messageData = MessageType.USER.USER_ALREADY_REGISTERED;
	} else {
		messageData = MessageType.USER.USER_NOT_REGISTERED;
	}
	let message = {boolValue: isRegistered, ...messageData}
	return OK(response, message, apiVersionType.V1);
};

const validationNotGeneratedVerificationCode = async (request, response, next) => {
	let {username} = request.body;
	let isGenerated;
	try {
		isGenerated = await isVerificationCodeGenerated(username);
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, err, apiVersionType.V1);
	}
	if (isGenerated) {
		return TOO_MANY_REQUESTS(response, MessageType.USER.WAITFOR_GENERATE_VERIFICATION_CODE, apiVersionType.V1);
	}
	return next();
};

const validationVerificationCodeMatches = async (request, response, next) => {
	let {username, verificationCode} = request.body;
	let isValid = false;
	try {
		isValid = await doesVerificationCodeMatches(username, verificationCode);
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, err, apiVersionType.V1);
	}
	if (!isValid) {
		return NOT_FOUND(response, MessageType.USER.INVALID_VERIFICATION_CODE, apiVersionType.V1);
	}
	return next();
};

const validationChangePasswordLoggedUser = async (request, response, next) => {
	const token = (request.headers.authorization).split(" ")[1];
	let {oldPassword} = request.body;
	let isValidOldPassword = false;
	try {
		let tokenDataId = await verifyToken(token).then(data => {return data.id});
		let userEmail = (await getAccountLoginDataById(tokenDataId)).email;
		isValidOldPassword = await isOldPasswordValid(oldPassword, userEmail);
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	if (!isValidOldPassword) {
		return BAD_REQUEST(response, MessageType.USER.PASSWORD_NOT_MATCH_WITH_ACTUAL, apiVersionType.V1);
	}
	return next();
}

const validationEmailOrUsernameRejectOnNotExist = async (request, response, next) => {
	let {emailOrUsername} = request.body;
	let userData;
	try {
		userData = await getAccountLoginData(emailOrUsername);
		if (!userData) {
			return CONFLICT(response, MessageType.USER.USERNAME_NOT_FOUND, apiVersionType.V1);
		}
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	return next();
}

const validationUpdateEmailAndUsernameData = async (request, response, next) => {
	const token = (request.headers.authorization).split(" ")[1];
	const {username, email} = request.body;
	let tokenDataId = (await verifyToken(token)).id;
	let userData = await getAccountLoginDataById(tokenDataId);
	if (username && username != userData.username) {
		let doesExistAnotherUserWithSameUsername = await isUsernameRegistered(username);
		if (doesExistAnotherUserWithSameUsername) {
			return CONFLICT(response, MessageType.USER.USER_ALREADY_REGISTERED);
		}
	}
	if (email && email != userData.email) {
		let doesExistAnotherUserWithSameEmail = await isEmailRegistered(email);
		if (doesExistAnotherUserWithSameEmail) {
			return CONFLICT(response, MessageType.USER.EMAIL_ALREADY_REGISTERED);
		}
	}
	return next();
};

const validationPersonalRoleData = async (request, response, next) => {
	const {gender, idCareer} = request.body;
	if (!Object.values(GenderType).includes(gender)) {
		return BAD_REQUEST(response, MessageType.USER.INVALID_GENDER_TYPE_PROVIDED, apiVersionType.V1);
	}
	let doesExistCareer = await isEducationalProgramRegistered(idCareer);
	if (!doesExistCareer) {
		return BAD_REQUEST(response, MessageType.USER.INVALID_IDCAREER_TYPE_PROVIDED, apiVersionType.V1);
	}
	return next();
};

const validationBusinessRoleData = async (request, response, next) => {
	const {category} = request.body;
	if (!Object.values(CategoryType).includes(category)) {
		return BAD_REQUEST(response, MessageType.USER.INVALID_CATEGORY_TYPE_PROVIDED, apiVersionType.V1);
	}
	return next();
};

const validationAdminRoleData = async (request, response, next) => {
	return next();
};

const validationModeratorRoleData = async (request, response, next) => {
	return next();
};

const validationSecretKey = async (request, response, next) => {
	const {key} = request.body;
	let isValidKey
	try {
		isValidKey = (decryptAES(key) == process.env.SERVER_KEY);
		if (!isValidKey) {
			return UNAUTHORIZED(response, MessageType.USER.UNAUTHORIZED, apiVersionType.V1);
		}
	} catch (error) {
		return UNAUTHORIZED(response, MessageType.USER.UNAUTHORIZED, apiVersionType.V1);
	}
	next();
};

const validationUserPrivacy = async (request, response, next) => {
	const token = (request.headers.authorization).split(" ")[1];
	const {privacy} = request.body;
	try {
		let userDataId = await verifyToken(token).then(data => {return data.id});
		let result = await getActualPrivacyType(userDataId);
		if (result == privacy) {
			return CONFLICT(response, MessageType.USER.ACCOUNT_PRIVACY_IS_ALREADY_TAKEN.replace("$", privacy), apiVersionType.V1);
		}
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	next();
};

module.exports = {
	validationisEmailRegisteredWithNext, validationIsUsernameRegisteredWithNext,
	validationIsUsernameRegistered, validationIsEmailRegistered, validationNotGeneratedVerificationCode,
	validationVerificationCodeMatches, validationChangePasswordLoggedUser, validationEmailOrUsernameRejectOnNotExist,
	validationUpdateEmailAndUsernameData, validationPersonalRoleData, validationAdminRoleData, validationModeratorRoleData,
	validationBusinessRoleData, validationSecretKey, validationUserPrivacy
}



