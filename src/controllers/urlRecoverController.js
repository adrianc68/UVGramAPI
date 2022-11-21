const { removeURLChangeEmailConfirmation } = require("../dataaccess/urlRecoverDataAccess");
const { updateUserEmail } = require("../dataaccess/userDataAccess");
const { httpResponseInternalServerError } = require("../helpers/httpResponses");
const { logger } = require("../helpers/logger");

const changeEmailDataOnConfirmation = async (request, response) => {
    let isUpdated = false;
    let resultData = response.locals.data;
    logger.debug(resultData);
    try {
        let resultRemoveURL = await removeURLChangeEmailConfirmation(resultData.uuid);
        if (resultRemoveURL) {
            isUpdated = await updateUserEmail(resultData.email, resultData.email.id_user);
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