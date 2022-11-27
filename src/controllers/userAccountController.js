const { sendEmailCodeVerification, sendEmailChangeURLConfirmation, sendEmailPasswordURLConfirmation } = require("../dataaccess/mailDataAccess");
const { verifyToken, deleteAllSessionsByUserId } = require("../dataaccess/tokenDataAccess");
const { generateURLChangeEmailConfirmation, doesURLVerificationAlreadyGenerated, removeURLVerification, generateURLUpdatePasswordConfirmation } = require("../dataaccess/urlRecoverDataAccess");
const { deleteUserByUsername, createUser, generateCodeVerification, removeVerificationCode,
    getAllUsers: getAllUsersDataAccess, changePassword: changePasswordUserDataAccess, updateUserPersonalData, updateAdministratorData, updateModeratorData, getAccountLoginDataById, updateBusinessData, getAccountLoginData, changeUserRoleType, changePrivacyTypeUser } = require("../dataaccess/userDataAccess");
const { httpResponseInternalServerError, httpResponseOk, httpResponseForbidden } = require("../helpers/httpResponses");
const { logger } = require("../helpers/logger");
const createURL = require("../helpers/urlHelper");
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
    let emailMessage;
    const { email, name, presentation, username, phoneNumber, birthdate } = request.body;
    const accessToken = (request.headers.authorization).split(" ")[1];
    let accessTokenData;
    let oldUserData;
    try {
        accessTokenData = await verifyToken(accessToken);
        let basicData = { name, presentation, username, phoneNumber, email, birthdate };
        let idUser = accessTokenData.id;
        let userRole = accessTokenData.userRole;
        oldUserData = await getAccountLoginDataById(idUser);
        if (userRole == UserRoleType.PERSONAL) {
            const { gender, idCareer } = request.body;
            let personalData = { gender, idCareer }
            isUpdated = await updateUserPersonalData(basicData, personalData, idUser);
        } else if (userRole == UserRoleType.BUSINESS) {
            const { category, city, postalCode, postalAddress, contactEmail, phoneContact, organizationName } = request.body;
            let businessData = { category, city, postalCode, postalAddress, contactEmail, phoneContact, organizationName };
            isUpdated = await updateBusinessData(basicData, businessData, idUser);
        } else if (userRole == UserRoleType.MODERATOR) {
            const { updateDate } = request.body;
            let moderatorData = { updateDate }
            isUpdated = await updateModeratorData(basicData, moderatorData, idUser);
        } else if (userRole == UserRoleType.ADMINISTRATOR) {
            const { createdTime } = request.body;
            let adminData = { createdTime }
            isUpdated = await updateAdministratorData(basicData, adminData, idUser);
        }
    } catch (error) {
        throw httpResponseInternalServerError(response, error);
    }
    try {
        if (isUpdated && email != oldUserData.email) {
            let isAlreadyURLGenerated = await doesURLVerificationAlreadyGenerated(oldUserData.id);
            if (!isAlreadyURLGenerated) {
                let address = createURL(request.socket.encrypted, request.socket.remoteAddress, request.socket.localPort);
                let url = await generateURLChangeEmailConfirmation(oldUserData.id, email, address);
                if (url) {
                    let result = await sendEmailChangeURLConfirmation(url, email);
                    if (!result) {
                        throw new Error("can not send email");
                    }
                    emailMessage = "a confirmation address has been sent to the new email";
                } else {
                    throw new Error("can not generate a new url");
                }
            } else {
                emailMessage = "please wait 5 minutes to generate another confirmation address";
            }
        }
    } catch (error) {
        await removeURLVerification(oldUserData.id);
        logger.warn(error);
        emailMessage = "cannot change email, try later";
    }
    const payload = { isUpdated, newAccessToken, emailMessage }
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

const createURLVerification = async (request, response) => {
    let { emailOrUsername } = request.body;
    let message;
    try {
        let userData = await getAccountLoginData(emailOrUsername);
        let address = createURL(request.socket.encrypted, request.socket.remoteAddress, request.socket.localPort);
        let urlResult = await generateURLUpdatePasswordConfirmation(userData.id, emailOrUsername, address);
        if (urlResult) {
            let emailResult = await sendEmailPasswordURLConfirmation(urlResult, userData.email);
            if (!emailResult) {
                throw new Error("can not send email");
            }
            message = "a confirmation address has been sent to the new email";
        } else {
            throw new Error("can not generate a new url");
        }
    } catch (error) {
        await removeURLVerification(userData.id);
        logger.warn(error);
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, message);
}

const createVerificationCode = async (request, response) => {
    let { username, email } = request.body;
    let isGenerated = false;
    try {
        let verificationCode = await generateCodeVerification(username);
        if (verificationCode) {
            let isSentToEmail = await sendEmailCodeVerification(verificationCode, email);
            isGenerated = isSentToEmail;
        }
    } catch (error) {
        if (verificationCode) await removeVerificationCode(verificationCode);
        return httpResponseInternalServerError(response, error);
    }
    if (!isGenerated) {
        return httpResponseForbidden(response, "can not generate verification code, try later");
    }
    return httpResponseOk(response, isGenerated);
};

const changePasswordOnLoggedUser = async (request, response) => {
    let { password } = request.body;
    let isUpdated;
    try {
        let token = (request.headers.authorization).split(" ")[1];
        let userLoggedId = await verifyToken(token).then(data => { return data.id });
        let userEmail = await getAccountLoginDataById(userLoggedId).then(data => { return data.email });
        isUpdated = await changePassword(userEmail, password);
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

const changeUserRoleByEmailOrUsername = async (request, response) => {
    const { emailOrUsername, newRoleType } = request.body;
    let isUpdated;
    try {
        let userData = await getAccountLoginData(emailOrUsername);
        isUpdated = await changeUserRoleType(userData.id, newRoleType.toUpperCase());
        if (isUpdated) {
            let resultSession = await deleteAllSessionsByUserId(userData.id);
        }
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, { isUpdated })
}

const changePrivacyType = async (request, response, next) => {
    const token = (request.headers.authorization).split(" ")[1];
    const { privacy } = request.body;
    let result = false;
    try {
        let userDataId = await verifyToken(token).then(data => { return data.id });
        result = await changePrivacyTypeUser(userDataId, privacy);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, result)
};

module.exports = {
    addUser, removeUserByUsername, createVerificationCode,
    getAllUsers, changePasswordOnLoggedUser, updateUser,
    createURLVerification, changeUserRoleByEmailOrUsername, changePrivacyType
}