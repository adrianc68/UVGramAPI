const { getRefreshTokenIdByAccessToken } = require("../dataaccess/tokenDataAccess");
const { getDataURLRecover, removeURLChangeEmailConfirmation } = require("../dataaccess/urlRecoverDataAccess");
const { updateUserEmail, getAccountLoginDataById } = require("../dataaccess/userDataAccess");
const { httpResponseForbidden, httpResponseInternalServerError } = require("../helpers/httpResponses");
const { logger } = require("../helpers/logger");

const changeEmailDataOnConfirmation = async (request, response) => {
    let resultUpdateEmail = false;
    let newAccessToken;
                let token = response.locals.data.result.token;
    newAccessToken = await getRefreshTokenIdByAccessToken(token);
    // try {
    //     let resultRemoveURL = await removeURLChangeEmailConfirmation(uuid);
    //     if (resultRemoveURL) {
    //         let id_user = response.locals.data.result.id_user;
    //         let token = response.locals.data.result.token;
    //         let newEmail = (JSON.parse(response.locals.data.data)).newEmail;
    //         let resultUpdateEmail = await updateUserEmail(newEmail, id_user);
    //         if (resultUpdateEmail) {
    //             // Update is true then return new access token only if has 1 session active and invalidate active accesstoken
    //             let userData = await getAccountLoginDataById(id_user);
    //             newAccessToken = await refreshLoginAndRemoveOldAccessToken(token, username, accessTokenData.userId, accessTokenData.userRole, accessTokenData.email, refreshTokenData.jti);
                
    //             logger.debug("actualizado");
    //         }
    //     }
    // } catch (error) {
    //     return httpResponseInternalServerError(response, error);
    // }
    const payload = {
        isUpdated: resultUpdateEmail,
        newAccessToken
    }
    return response.send(payload);
}

module.exports = { changeEmailDataOnConfirmation }