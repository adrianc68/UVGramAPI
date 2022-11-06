const { deleteUserByUsername, createUser, generateCodeVerification, removeVerificationCode } = require("../dataaccess/userDataAccess");
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
    let isVerificationCodeGenerated = false;
    try {
        isVerificationCodeGenerated = await generateCodeVerification(username);
        // SEND THE VERIFICATION CODE TO EMAIL!!!!
        // BY NOW RETURN THE CODE TO CLIENT
    } catch (error) {
        await removeVerificationCode(isVerificationCodeGenerated);
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, { isGenerated: isVerificationCodeGenerated });
};

module.exports = { addUser, removeUserByUsername, createVerificationCode }