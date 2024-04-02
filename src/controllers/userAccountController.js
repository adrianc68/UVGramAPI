const {sendEmailCodeVerification, sendEmailChangeURLConfirmation, sendEmailPasswordURLConfirmation} = require("../dataaccess/mailDataAccess");
const {verifyToken, deleteAllSessionsByUserId} = require("../dataaccess/tokenDataAccess");
const {generateURLToChangeEmailOnConfirmation, doesURLVerificationAlreadyGenerated, removeURLVerification, generateURLToUpdatePasswordOnConfirmation} = require("../dataaccess/urlRecoverDataAccess");
const {deleteUserByUsername, createUser, generateCodeVerification, removeVerificationCode,
	getAllUsers: getAllUsersDataAccess, changePassword: changePasswordUserDataAccess, updateUserPersonalData, updateAdministratorData, updateModeratorData, getAccountLoginDataById, updateBusinessData, getAccountLoginData, changeUserRoleType, changePrivacyTypeUser, acceptAllFollowerRequestById, acceptFollowerRequestByUserId, getIdByUsername, denyFollowerRequestByUserId, getAllAccountData} = require("../dataaccess/userDataAccess");
const {logger} = require("../helpers/logger");
const {PrivacyType} = require("../models/enum/PrivacyType");
const {UserRoleType} = require("../models/enum/UserRoleType");
const {INTERNAL_SERVER_ERROR, OK, UNAVAILABLE, CREATED} = require("../services/httpResponsesService");
const {apiVersionType} = require("../types/apiVersionType");
const ServiceErrorException = require("../types/exception/ServiceErrorException");
const MessageType = require("../types/MessageType");

const addUser = async (request, response) => {
	const {password, email, name, presentation, username, phoneNumber, birthdate} = request.body;
	let user = {
		password,
		email,
		name,
		presentation,
		username,
		phoneNumber,
		birthdate
	}
	let message;
	try {
		message = await createUser(user);
		await removeVerificationCode(username);
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, err, apiVersionType.V1);
	}
	return OK(response, message, apiVersionType.V1);
};

const updateUser = async (request, response) => {
	let isUpdated = false;
	let newAccessToken;
	let emailMessage;
	const {email, name, presentation, username, phoneNumber, birthdate} = request.body;
	const accessToken = (request.headers.authorization).split(" ")[1];
	let accessTokenData;
	let oldUserData;
	try {
		accessTokenData = await verifyToken(accessToken);
		let basicData = {name, presentation, username, phoneNumber, email, birthdate};
		let idUser = accessTokenData.id;
		let userRole = accessTokenData.userRole;
		oldUserData = await getAccountLoginDataById(idUser);
		if (userRole == UserRoleType.PERSONAL) {
			const {gender, idCareer} = request.body;
			let personalData = {gender, idCareer}
			isUpdated = await updateUserPersonalData(basicData, personalData, idUser);
		} else if (userRole == UserRoleType.BUSINESS) {
			const {category, city, postalCode, postalAddress, contactEmail, phoneContact, organizationName} = request.body;
			let businessData = {category, city, postalCode, postalAddress, contactEmail, phoneContact, organizationName};
			isUpdated = await updateBusinessData(basicData, businessData, idUser);
		} else if (userRole == UserRoleType.MODERATOR) {
			const {updateDate} = request.body;
			let moderatorData = {updateDate}
			isUpdated = await updateModeratorData(basicData, moderatorData, idUser);
		} else if (userRole == UserRoleType.ADMINISTRATOR) {
			const {createdTime} = request.body;
			let adminData = {createdTime}
			isUpdated = await updateAdministratorData(basicData, adminData, idUser);
		}
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	try {
		if (isUpdated && email != oldUserData.email) {
			let isAlreadyURLGenerated = await doesURLVerificationAlreadyGenerated(oldUserData.id);
			if (!isAlreadyURLGenerated) {
				let url = await generateURLToChangeEmailOnConfirmation(oldUserData.id, email);
				if (url) {
					let result = await sendEmailChangeURLConfirmation(url, email);
					if (!result) {
						throw new ServiceErrorException(MessageType.USER.ERROR_SEND_CODE_VERIFICATION);
					}
					emailMessage = MessageType.USER.CONFIRMATION_CODE_SENT;
				} else {
					throw new ServiceErrorException(MessageType.USER.ERROR_GENERATE_URL);
				}
			} else {
				emailMessage = MessageType.USER.WAITFOR_GENERATE_VERIFICATION_CODE;
			}
		}
	} catch (error) {
		await removeURLVerification(oldUserData.id);
		logger.warn(error);
		emailMessage = MessageType.USER.ERROR_CANNOT_CHANGE_EMAIL;
	}
	const payload = {isUpdated, newAccessToken, emailMessage}
	return OK(response, payload, apiVersionType.V1);
};

const changePassword = async (emailOrUsername, newPassword) => {
	let isChanged = false;
	try {
		isChanged = await changePasswordUserDataAccess(emailOrUsername, newPassword);
	} catch (error) {
		throw new Error(error);
	}
	return isChanged;
};

const removeUserByUsername = async (request, response) => {
	const {username} = request.body;
	let message;
	try {
		message = await deleteUserByUsername(username);
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	return OK(response, message, apiVersionType.V1);
};

const createURLVerification = async (request, response) => {
	let {emailOrUsername} = request.body;
	let message;
	let userData
	try {
		userData = await getAccountLoginData(emailOrUsername);
		let urlResult = await generateURLToUpdatePasswordOnConfirmation(userData.id, emailOrUsername);
		if (!urlResult) {
			throw new ServiceErrorException(MessageType.USER.ERROR_GENERATE_URL);
		}
		let emailResult = await sendEmailPasswordURLConfirmation(urlResult, userData.email);
		if (!emailResult) {
			throw new ServiceErrorException(MessageType.USER.ERROR_SEND_CODE_VERIFICATION);
		}
		message = MessageType.USER.CONFIRMATION_CODE_SENT;
	} catch (error) {
		await removeURLVerification(userData.id);
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	return CREATED(response, message, apiVersionType.V1);
}

const createVerificationCode = async (request, response) => {
	let {username, email} = request.body;
	let isGenerated = false;
	let verificationCode;
	try {
		verificationCode = await generateCodeVerification(username);
		if (verificationCode) {
			let isSentToEmail = await sendEmailCodeVerification(verificationCode, email);
			isGenerated = isSentToEmail;
		}
	} catch (error) {
		if (verificationCode) await removeVerificationCode(verificationCode);
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	if (!isGenerated) {
		return UNAVAILABLE(response, apiVersionType.V1);
	}
	return CREATED(response, isGenerated, apiVersionType.V1);
};

const changePasswordOnLoggedUser = async (request, response) => {
	let {password} = request.body;
	let isUpdated;
	try {
		let token = (request.headers.authorization).split(" ")[1];
		let userLoggedId = await verifyToken(token).then(data => {return data.id});
		let userEmail = await getAccountLoginDataById(userLoggedId).then(data => {return data.email});
		isUpdated = await changePassword(userEmail, password);
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	return OK(response, isUpdated, apiVersionType.V1);
};

const getAllUsers = async (request, response) => {
	let users;
	try {
		users = await getAllUsersDataAccess();
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	return OK(response, users, apiVersionType.V1);
};

const changeUserRoleByEmailOrUsername = async (request, response) => {
	const {emailOrUsername, newRoleType} = request.body;
	let isUpdated;
	try {
		let userData = await getAccountLoginData(emailOrUsername);
		isUpdated = await changeUserRoleType(userData.id, newRoleType.toUpperCase());
		if (isUpdated) {
			await deleteAllSessionsByUserId(userData.id);
		}
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	return OK(response, isUpdated, apiVersionType.V1);
}

const changePrivacyType = async (request, response) => {
	const token = (request.headers.authorization).split(" ")[1];
	const {privacy} = request.body;
	let result = false;
	try {
		let userDataId = await verifyToken(token).then(data => {return data.id});
		result = await changePrivacyTypeUser(userDataId, privacy);
		if (privacy == PrivacyType.PUBLIC) {
			await acceptAllFollowerRequestById(userDataId);
		}
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	return OK(response, result, apiVersionType.V1);
};

const acceptFollowerRequest = async (request, response) => {
	const token = (request.headers.authorization).split(" ")[1];
	const {username} = request.body;
	let result = false;
	try {
		let userDataId = await verifyToken(token).then(data => {return data.id});
		let userFollowerId = await getIdByUsername(username);
		result = await acceptFollowerRequestByUserId(userFollowerId, userDataId);
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	return OK(response, result, apiVersionType.V1);
};

const denyFollowerRequest = async (request, response) => {
	const token = (request.headers.authorization).split(" ")[1];
	const {username} = request.body;
	let result = false;
	try {
		let userDataId = await verifyToken(token).then(data => {return data.id});
		let userFollowerId = await getIdByUsername(username);
		result = await denyFollowerRequestByUserId(userFollowerId, userDataId);
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	return OK(response, result, apiVersionType.V1);
};

const getUserAccountData = async (request, response) => {
	const token = (request.headers.authorization).split(" ")[1];
	let result;
	try {
		let userData = await verifyToken(token);
		result = await getAllAccountData(userData.id);
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	return OK(response, result, apiVersionType.V1);
}

module.exports = {
	addUser, removeUserByUsername, createVerificationCode,
	getAllUsers, changePasswordOnLoggedUser, updateUser,
	createURLVerification, changeUserRoleByEmailOrUsername,
	changePrivacyType, acceptFollowerRequest, denyFollowerRequest,
	getUserAccountData
}
