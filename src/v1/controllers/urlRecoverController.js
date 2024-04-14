const {UNAVAILABLE, OK, INTERNAL_SERVER_ERROR} = require("../../services/httpResponsesService");
const {apiVersionType} = require("../../types/apiVersionType");
const {deleteAllSessionsByUserId} = require("../../dataaccess/tokenDataAccess");
const {removeURLVerification, createURLRedirectionToChangePasswordRoute} = require("../../dataaccess/urlRecoverDataAccess");
const {updateUserEmail, getAccountLoginDataById, changePassword} = require("../../dataaccess/userDataAccess");
const MessageType = require("../../types/MessageType");

const changeEmailDataOnURLConfirmation = async (request, response) => {
	let isUpdated = false;
	let resultData = response.locals.data;
	let message;
	try {
		isUpdated = await updateUserEmail(resultData.data.newEmail, resultData.idUser);
		if (!isUpdated) {
			return UNAVAILABLE(response, apiVersionType.V1);
		}
		await removeURLVerification(resultData.idUser);
		message = {boolValue: true, ...MessageType.USER.PASSWORD_CHANGED}
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	return OK(response, message, apiVersionType.V1);
}

const changePasswordOnUnloggedUserOnURLConfirmation = async (request, response) => {
	let {password} = request.body;
	let isUpdated;
	let message;
	try {
		let localData = response.locals.data;
		let userData = await getAccountLoginDataById(localData.idUser);
		await deleteAllSessionsByUserId(userData.id);
		isUpdated = await changePassword(userData.email, password);
		if (!isUpdated) {
			return UNAVAILABLE(response, apiVersionType.V1);
		}
		await removeURLVerification(userData.id);
		message = {boolValue: true, ...MessageType.USER.PASSWORD_CHANGED}
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	return OK(response, message, apiVersionType.V1);
};

const getRedirectionURLOnConfirmation = async (request, response) => {
	let resultData = response.locals.data;
	let URL = createURLRedirectionToChangePasswordRoute(resultData.uuid, resultData.idUser);
	return OK(response, {redirect: URL}, apiVersionType.V1);
}

module.exports = {changeEmailDataOnURLConfirmation, getRedirectionURLOnConfirmation, changePasswordOnUnloggedUserOnURLConfirmation}
