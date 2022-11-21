const { httpResponseOk } = require("../helpers/httpResponses");
const { logger } = require("../helpers/logger")

const sendResponseToClient = async (request, response) => {
    logger.debug("GET DATA FROM BEFORE Controller")
    logger.debug(response.locals.data);
    return httpResponseOk(response, "WAIT FOR ME");
}


module.exports = { sendResponseToClient }