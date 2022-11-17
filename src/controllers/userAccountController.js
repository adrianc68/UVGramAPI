const { verifyToken } = require("../dataaccess/tokenDataAccess");
const { deleteUserByUsername, createUser, generateCodeVerification, removeVerificationCode,
    getAllUsers: getAllUsersDataAccess, changePassword: changePasswordUserDataAccess } = require("../dataaccess/userDataAccess");
const { httpResponseInternalServerError, httpResponseOk } = require("../helpers/httpResponses");
const { logger } = require("../helpers/logger");

const addUser = async (request, response) => {
    const { password, email, name, presentation, username, phoneNumber, birthdate, verificationCode } = request.body;
    const user = {
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

const changePassword = async (emailOrUsername, newPassword) => {
    let isChanged = false;
    try {
        isChanged = await changePasswordUserDataAccess(emailOrUsername, newPassword);
    } catch (error) {
        throw new Error(error);
    }
    return isChanged;
}

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
}

const changePasswordOnUnloggedUser = async (request, response) => {
    let { password, emailOrUsername } = request.body;
    let isUpdated;
    try {
        isUpdated = await changePassword(emailOrUsername, password);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, isUpdated);
}

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
    addUser, removeUserByUsername, createVerificationCode
    , getAllUsers, changePasswordOnLoggedUser, changePasswordOnUnloggedUser
}