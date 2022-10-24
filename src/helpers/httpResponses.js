const { StatusCodes } = require("http-status-codes");
const { logger } = require("./logger");


const httpResponse = (response, error) => {
    logger.error(error);
    return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error"});
}

module.exports = { httpResponse }