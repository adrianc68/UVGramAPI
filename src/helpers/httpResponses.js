const { StatusCodes } = require("http-status-codes");
const { logger } = require("./logger");
const {validationResult} = require("express-validator");

const httpResponseValidation = (request, response, next) => {
    const errors = validationResult(request);
    if(!errors.isEmpty()){
        return response.status(StatusCodes.BAD_REQUEST).json({errors: errors.array()});
    }
    return next();
};

const httpResponse = (response, error) => {
    logger.fatal(error);
    return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error"});
}

module.exports = { httpResponse, httpResponseValidation }