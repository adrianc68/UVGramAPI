const { deleteUserByUsername, createUser } = require("../dataaccess/UserDataAccess");
const { generateRandomCode } = require("../helpers/generateCode");
const { httpResponseInternalServerError, httpResponseOk } = require("../helpers/httpResponses");

const addUser = async (request, response) => {
    const { password, email, name, presentation, username, phoneNumber, birthdate } = request.body;
    let confirmationCode = generateRandomCode(8);
    const user = {
        password,
        email,
        name,
        presentation,
        username,
        phoneNumber,
        birthdate,
        confirmationCode
    }
    let userID;
    try {
        message = await createUser(user);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, message)
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
}

module.exports = { addUser, removeUserByUsername }