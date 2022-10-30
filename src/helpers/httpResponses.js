const { StatusCodes } = require("http-status-codes");
const { logger } = require("./logger");
const { validationResult } = require("express-validator");

const httpResponseValidation = (request, response, next) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }
    return next();
};

const httpResponseOk = (response, message) => {
    return response.status(StatusCodes.OK).json({ message: message });
}

const httpResponseNotFound = (response, message) => {
    return response.status(StatusCodes.NOT_FOUND).json({ message: message });
};

const httpResponseUnauthorized = (response) => {
    return response.status(StatusCodes.UNAUTHORIZED).json({ message: "No authorization to perform this action!" });
};

const httpResponseErrorToken = (response, error) => {
    return response.status(StatusCodes.FORBIDDEN).json({ message: error, type: "token" });
}

const httpResponseBadRequest = (response, error) => {
    return response.status(StatusCodes.BAD_REQUEST).json({ message: error });
}

const httpResponseInternalServerError = (response, error) => {
    logger.fatal(error);
    return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
};

module.exports = {
    httpResponseInternalServerError, httpResponseValidation, httpResponseUnauthorized,
    httpResponseNotFound, httpResponseOk, httpResponseBadRequest,
    httpResponseErrorToken
}