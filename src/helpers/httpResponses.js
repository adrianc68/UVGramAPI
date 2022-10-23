const { StatusCodes} = require("http-status-codes");

const httpResponse = (error, request, response, next) => {
    response.send("Nothing to send by now");
}

module.exports = { httpResponse }