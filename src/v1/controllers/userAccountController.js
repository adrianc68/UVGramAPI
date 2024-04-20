const {sendEmailCodeVerification, sendEmailChangeURLConfirmation, sendEmailPasswordURLConfirmation} = require("../../dataaccess/mailDataAccess");
const {verifyToken, deleteAllSessionsByUserId} = require("../../dataaccess/tokenDataAccess");
const {generateURLToChangeEmailOnConfirmation, doesURLVerificationAlreadyGenerated, removeURLVerification, generateURLToUpdatePasswordOnConfirmation} = require("../../dataaccess/urlRecoverDataAccess");
const {deleteUserByUsername, createUser, generateCodeVerification, removeVerificationCode,
	getAllUsers: getAllUsersDataAccess, changePassword: changePasswordUserDataAccess, updateUserPersonalData, updateAdministratorData, updateModeratorData, getAccountLoginDataById, updateBusinessData, getAccountLoginData, changeUserRoleType, changePrivacyTypeUser, acceptAllFollowerRequestById, acceptFollowerRequestByUserId, getIdByUsername, denyFollowerRequestByUserId, getAllAccountData} = require("../../dataaccess/userDataAccess");
const {logger} = require("../../helpers/logger");
const {PrivacyType} = require("../../models/enum/PrivacyType");
const {UserRoleType} = require("../../models/enum/UserRoleType");


const {OK, INTERNAL_SERVER_ERROR, CONFLICT, UNAVAILABLE, CREATED} = require("../../services/httpResponsesService");
const {apiVersionType} = require("../../types/apiVersionType");
const ServiceErrorException = require("../../types/exception/ServiceErrorException");
const MessageType = require("../../types/MessageType");

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
	let result;
	try {
		result = await createUser(user);
		await removeVerificationCode(username);
		if(!result){
			return UNAVAILABLE(response, apiVersionType.V1);
		}
	} catch (error) {
		await removeVerificationCode(username);
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	let message = {boolValue: true, ...MessageType.USER.USER_REGISTERED}
	return CREATED(response, message, apiVersionType.V1);
};

const updateUser = async (request, response) => {
	let isUpdated = false;
	let newAccessToken;
	const {email, name, presentation, username, phoneNumber, birthdate} = request.body;
	const accessToken = (request.headers.authorization).split(" ")[1];
	let accessTokenData;
	let oldUserData;
	let userDataUpdateMessage;
	let emailChangeMessage;
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
						throw new Error("can not send email");
					}
					emailChangeMessage = {boolValue: true, ...MessageType.USER.URL_VERIFICATION_SENT}
				} else {
					throw new Error("can not generate a new url");
				}
			} else {
				emailChangeMessage = {boolValue: false, ...MessageType.USER.WAITFOR_GENERATE_URL}
			}
		}
	} catch (error) {
		await removeURLVerification(oldUserData.id);
		logger.warn(error);
		emailChangeMessage = {boolValue: false, ...MessageType.USER.UNAVAILABLE}
	}

	if(isUpdated) {
		userDataUpdateMessage = {boolValue: isUpdated, ...MessageType.USER.DATA_UPDATED}
	} else {
		userDataUpdateMessage = {boolValue: isUpdated, ...MessageType.UNAVAILABLE}
	}
const payload = {userDataUpdateMessage:userDataUpdateMessage, emailChangeUpdateMessage: emailChangeMessage, newAccessToken}
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
		if (urlResult) {
			let emailResult = await sendEmailPasswordURLConfirmation(urlResult, userData.email);
			if (!emailResult) {
				throw new ServiceErrorException(MessageType.USER.ERROR_CANNOT_CHANGE_PASSWORD);
			}
			message = {boolValue: true, ...MessageType.USER.CONFIRMATION_CODE_SENT}
		} else {
			throw new ServiceErrorException(MessageType.USER.ERROR_GENERATE_URL);
		}
	} catch (error) {
		await removeURLVerification(userData.id);
		if (error instanceof ServiceErrorException) {
			return UNAVAILABLE(response, apiVersionType.V1);
		}
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	return OK(response, message, apiVersionType.V1);
}

const createVerificationCode = async (request, response) => {
	let {username, email} = request.body;
	let isRegistered = false;
	let verificationCode;
	try {
		verificationCode = await generateCodeVerification(username);
		if (verificationCode) {
			let isSentToEmail = await sendEmailCodeVerification(verificationCode, email);
			isRegistered = isSentToEmail;
		}
	} catch (error) {
		if (verificationCode) await removeVerificationCode(verificationCode);
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	if (!isRegistered) {
		return CONFLICT(response, MessageType.USER.ERROR_CANNOT_GENERATE_VERIFICATION_CODE, apiVersionType.V1);
	}
	let message = {boolValue: true, ...MessageType.USER.CONFIRMATION_CODE_SENT}
	return OK(response, message, apiVersionType.V1);
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
	let message = {boolValue: isUpdated, ...MessageType.USER.PASSWORD_CHANGED}
	return OK(response, message, apiVersionType.V1);
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
	let payload = {boolValue: result, ...MessageType.USER.DATA_UPDATED}
	return OK(response, payload, apiVersionType.V1);
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
	let payload = {boolValue: result, ...MessageType.USER.DATA_UPDATED};
	return OK(response, payload, apiVersionType.V1);
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
	let payload = {boolValue: result, ...MessageType.USER.DATA_UPDATED};
	return OK(response, payload, apiVersionType.V1);
};

const getUserAccountData = async (request, response) => {
	const token = (request.headers.authorization).split(" ")[1];
	let userInfo;
	try {
		let userData = await verifyToken(token);
		userInfo = await getAllAccountData(userData.id);
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	return OK(response, userInfo, apiVersionType.V1);
}

module.exports = {
	addUser, removeUserByUsername, createVerificationCode,
	getAllUsers, changePasswordOnLoggedUser, updateUser,
	createURLVerification, changeUserRoleByEmailOrUsername,
	changePrivacyType, acceptFollowerRequest, denyFollowerRequest,
	getUserAccountData
}
