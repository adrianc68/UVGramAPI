const {UNAVAILABLE} = require("../../services/httpResponsesService");
const {apiVersionType} = require("../../types/apiVersionType");
const {deleteAllSessionsByUserId} = require("../../dataaccess/tokenDataAccess");
const {removeURLVerification, createURLRedirectionToChangePasswordRoute} = require("../../dataaccess/urlRecoverDataAccess");
const {updateUserEmail, getAccountLoginDataById, changePassword} = require("../../dataaccess/userDataAccess");

const changeEmailDataOnURLConfirmation = async (request, response) => {
	let isUpdated = false;
	let resultData = response.locals.data;
	try {
		isUpdated = await updateUserEmail(resultData.data.newEmail, resultData.idUser);
		if (isUpdated) {
			await removeURLVerification(resultData.idUser);
		} else {
			return UNAVAILABLE(response, apiVersionType.V1);
		}
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	return OK(response, {isUpdated}, apiVersionType.V1);
}

const changePasswordOnUnloggedUserOnURLConfirmation = async (request, response) => {
	let {password} = request.body;
	let isUpdated;
	try {
		let localData = response.locals.data;
		let userData = await getAccountLoginDataById(localData.idUser);
		await deleteAllSessionsByUserId(userData.id);
		isUpdated = await changePassword(userData.email, password);
		if (!isUpdated) {
			return UNAVAILABLE(response, apiVersionType.V1);
		}
		await removeURLVerification(userData.id);
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	return OK(response, {isUpdated}, apiVersionType.V1);
};

const getRedirectionURLOnConfirmation = async (request, response) => {
	let resultData = response.locals.data;
	let URL = createURLRedirectionToChangePasswordRoute(resultData.uuid, resultData.idUser);
	return OK(response, {redirect: URL}, apiVersionType.V1);
}

module.exports = {changeEmailDataOnURLConfirmation, getRedirectionURLOnConfirmation, changePasswordOnUnloggedUserOnURLConfirmation}
