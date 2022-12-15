const { generateTokens, deleteAllSessionsByUserId } = require("../dataaccess/tokenDataAccess");
const { removeURLVerification, createURLRedirectionToChangePasswordRoute } = require("../dataaccess/urlRecoverDataAccess");
const { updateUserEmail, getAccountLoginDataById, changePassword } = require("../dataaccess/userDataAccess");
const { httpResponseInternalServerError, httpResponseOk, httpResponseForbidden } = require("../helpers/httpResponses");

const changeEmailDataOnURLConfirmation = async (request, response) => {
    let isUpdated = false;
    let resultData = response.locals.data;
    try {
        isUpdated = await updateUserEmail(resultData.data.newEmail, resultData.idUser);
        if (isUpdated) {
            await removeURLVerification(resultData.idUser);
        } else {
            return httpResponseForbidden(response, "can not change email now, try later");
        }
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    const payload = {
        isUpdated,
    }
    return httpResponseOk(response, payload);
}

const changePasswordOnUnloggedUserOnURLConfirmation = async (request, response) => {
    let { password } = request.body;
    let isUpdated;
    try {
        let localData = response.locals.data;
        let userData = await getAccountLoginDataById(localData.idUser);
        await deleteAllSessionsByUserId(userData.id);
        isUpdated = await changePassword(userData.email, password);
        if (!isUpdated) {
            return httpResponseForbidden(response, "can not change password, try later");
        }
        await removeURLVerification(userData.id);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, { isUpdated });
};

const getRedirectionURLOnConfirmation = async (request, response) => {
    let resultData = response.locals.data;
    let URL = createURLRedirectionToChangePasswordRoute(resultData.uuid, resultData.idUser);
    return httpResponseOk(response, { redirect: URL });
}

module.exports = { changeEmailDataOnURLConfirmation, getRedirectionURLOnConfirmation, changePasswordOnUnloggedUserOnURLConfirmation }