const { deleteUserByUsername, createUser, generateCodeVerification, removeVerificationCode, getAllUsers: getAllUsersDataAccess } = require("../dataaccess/userDataAccess");
const { httpResponseInternalServerError, httpResponseOk } = require("../helpers/httpResponses");

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
        // SEND THE VERIFICATION CODE TO EMAIL!!!!
        // BY NOW RETURN THE CODE TO CLIENT
    } catch (error) {
        if (verificationCode) await removeVerificationCode(verificationCode);
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, { verificationCode });
};

const getAllUsers = async (request, response) => {
    let users;
    try {
        users = await getAllUsersDataAccess();
    } catch (error) {
        return httpResponseInternalServerError(error);
    }
    return httpResponseOk(response, users);
}

module.exports = { addUser, removeUserByUsername, createVerificationCode, getAllUsers }