const { httpResponseOk } = require("../helpers/httpResponses");
const { generateAccessToken } = require("../helpers/token");

const createToken = async (request, response, next) => {
    const user = request.userLogged;
    const token = await generateAccessToken(user.username, user.id, user.userRole);
    httpResponseOk(response, { user, token });
}

module.exports = { createToken }