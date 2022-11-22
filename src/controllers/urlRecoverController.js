const { removeURLChangeEmailConfiguration } = require("../dataaccess/urlRecoverDataAccess");
const { updateUserEmail } = require("../dataaccess/userDataAccess");
const { httpResponseInternalServerError } = require("../helpers/httpResponses");
const { logger } = require("../helpers/logger");

const changeEmailDataOnConfirmation = async (request, response) => {
    let isUpdated = false;
    let resultData = response.locals.data;
    try {
        let resultRemoveURL = await removeURLChangeEmailConfiguration(resultData.id_user);
        if (resultRemoveURL) {
            isUpdated = await updateUserEmail(resultData.newEmail, resultData.id_user);
        };
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    const payload = {
        isUpdated,
    }
    return response.send(payload);
}

module.exports = { changeEmailDataOnConfirmation }