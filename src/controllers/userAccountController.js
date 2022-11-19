const { verifyToken, refreshAccessToken, removeToken, refreshLoginAndRemoveOldAccessToken } = require("../dataaccess/tokenDataAccess");
const { deleteUserByUsername, createUser, generateCodeVerification, removeVerificationCode,
    getAllUsers: getAllUsersDataAccess, changePassword: changePasswordUserDataAccess, updateUserPersonalData, getIdByUsername, updateAdministratorData, updateModeratorData } = require("../dataaccess/userDataAccess");
const { httpResponseInternalServerError, httpResponseOk, httpResponseNotImplement } = require("../helpers/httpResponses");
const { logger } = require("../helpers/logger");
const { UserRoleType } = require("../models/enum/UserRoleType");

const addUser = async (request, response) => {
    const { password, email, name, presentation, username, phoneNumber, birthdate, verificationCode } = request.body;
    let user = {
        password,
        email,
        name,
        presentation,
        username,
        phoneNumber,
        birthdate
    }
    try {
        message = await createUser(user);
        await removeVerificationCode(username);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, message)
};

const updateUser = async (request, response) => {
    let isUpdated = false;
    let newAccessToken;
    const { email, name, presentation, username, phoneNumber, birthdate } = request.body;
    let basicData = { name, presentation, username, phoneNumber, email, birthdate };
    const accessToken = (request.headers.authorization).split(" ")[1];
    const refreshToken = (request.headers.refreshtoken).split(" ")[1];
    try {
        let refreshTokenData = await verifyToken(refreshToken);
        let accessTokenData = await verifyToken(accessToken);
        if (accessTokenData.userRole == UserRoleType.PERSONAL) {
            const { gender, idCareer } = request.body;
            let personalData = { gender, idCareer }
            isUpdated = await updateUserPersonalData(basicData, personalData, accessTokenData.userId);
        } else if (accessTokenData.userRole == UserRoleType.BUSINESS) {
            const { category, city, postalCode, postalAddress, contactEmail, phoneContact, organizationName } = request.body;
            let businessData = { category, city, postalCode, postalAddress, contactEmail, phoneContact, organizationName };
            isUpdated = await updateBusinessData(basicData, businessData, accessTokenData.userId);
        } else if (accessTokenData.userRole == UserRoleType.MODERADOR) {
            const { updateDate } = request.body;
            let moderatorData = { updateDate }
            isUpdated = await updateModeratorData(basicData, moderatorData, accessTokenData.userId);
        } else if (accessTokenData.userRole == UserRoleType.ADMINISTRATOR) {
            const { createdTime } = request.body;
            let adminData = { createdTime }
            isUpdated = await updateAdministratorData(basicData, adminData, accessTokenData.userId);
        }
        if (isUpdated && username != accessTokenData.username) {
            newAccessToken = await refreshLoginAndRemoveOldAccessToken(accessToken, username, accessTokenData.userId, accessTokenData.userRole, accessTokenData.email, refreshTokenData.jti);
            newAccessToken = newAccessToken.accessToken.token;
        }

        if (isUpdated && email != accessTokenData.email) {
            logger.debug(email);
            logger.debug(accessTokenData.email);
            // GENERATE URL AND SEND TO EMAIL
        }

    } catch (error) {
        throw httpResponseInternalServerError(response, error);
    }
    const payload = {
        isUpdated,
        newAccessToken
    }
    return httpResponseOk(response, payload);
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
    const { username } = request.body;
    let message;
    try {
        message = await deleteUserByUsername(username);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, message)
};

const createVerificationCode = async (request, response) => {
    let { username } = request.body;
    let verificationCode;
    try {
        verificationCode = await generateCodeVerification(username);
        // ********************************************
        // SEND THE VERIFICATION CODE TO EMAIL!!!!
        // BY NOW RETURN THE CODE TO CLIENT
        // IF CODE WILL BE SEND TO EMAIL THEN CHANGE THE TEST OR THEY WILL FAIL.
        // ********************************************
    } catch (error) {
        if (verificationCode) await removeVerificationCode(verificationCode);
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, { verificationCode });
};

const changePasswordOnLoggedUser = async (request, response) => {
    let { password } = request.body;
    let isUpdated;
    try {
        let token = (request.headers.authorization).split(" ")[1];
        email = await verifyToken(token).then(data => { return data.email });
        isUpdated = await changePassword(email, password);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, isUpdated);
};

const changePasswordOnUnloggedUser = async (request, response) => {
    let { password, emailOrUsername } = request.body;
    let isUpdated;
    try {
        isUpdated = await changePassword(emailOrUsername, password);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, isUpdated);
};

const getAllUsers = async (request, response) => {
    let users;
    try {
        users = await getAllUsersDataAccess();
    } catch (error) {
        return httpResponseInternalServerError(error);
    }
    return httpResponseOk(response, users);
};


module.exports = {
    addUser, removeUserByUsername, createVerificationCode,
    getAllUsers, changePasswordOnLoggedUser, changePasswordOnUnloggedUser,
    updateUser
}