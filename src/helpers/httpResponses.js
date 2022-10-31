const { StatusCodes } = require("http-status-codes");
const { logger } = require("./logger");
const { validationResult } = require("express-validator");
const { generateRandomCode } = require("./generateCode");

/**
 * 400 Bad Request (Just for validations)
 * Invalid syntax where errors will be loaded to payload message.
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
const httpResponseValidation = (request, response, next) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        let payload = {
            errors: errors.array()
        }
        return response.status(StatusCodes.BAD_REQUEST).json(payload);
    }
    return next();
};

/**
 * 200 OK
 * The request has succeeded.
 * @param {*} response epresents the HTTP response
 * @param {*} message message to send the HTTP response.
 */
const httpResponseOk = (response, message) => {
    let payload = {
        message
    };
    return response.status(StatusCodes.OK).json(payload);

}
/**
 * 404 Not Found
 * Can not find requested resource.
 * Due to: 
 *  URL not recognized.
 *  Resource does not exist.
 * @param {*} response represents the HTTP response
 * @param {*} message message to send the HTTP response.
 */
const httpResponseNotFound = (response, message) => {
    let payload = {
        message
    };
    return response.status(StatusCodes.NOT_FOUND).json(payload);
};
/**
 * 401 Unathorized
 * Client must authenticate to get the requested response.
 * @param {*} response represents the HTTP response
 * @param {*} message message to send the HTTP response.
 */
const httpResponseUnauthorized = (response, message) => {
    let payload = {
        message: "You don't have permissions to do this action!",
        error: message
    };
    return response.status(StatusCodes.UNAUTHORIZED).json(payload);

};
/**
 * 403 Forbidden for Token
 * Client does not have right access to the content.
 * @param {*} response represents the HTTP response.
 * @param {*} message message to send the HTTP response.
 */
const httpResponseErrorToken = (response, message) => {
    let payload = {
        message,
        type: "token"
    };
    return response.status(StatusCodes.FORBIDDEN).json(payload);
}
/**
 * 403 Forbidden
 * Client does not have right access to the content.
 * @param {*} response represents the HTTP response.
 * @param {*} message message to send the HTTP response.
 */
const httpResponseForbidden = (response, message) => {
    let payload = {
        message
    }
    return response.status(StatusCodes.FORBIDDEN).json(payload);
}
/**
 * 501 Not implemented
 * Request method is not supported by server.
 * @param {*} response represents the HTTP response.
 * @param {*} message message to send the HTTP response.
 */
const httpResponseNotImplement = (response, message) => {
    let payload = {
        message
    };
    return response.status(StatusCodes.NOT_IMPLEMENTED).json(payload);
}
/**
 * 400 Bad Request
 * Server could not understand the request due to invalid syntax
 * @param {*} response represents the HTTP response.
 * @param {*} message message to send the HTTP response.
 */
const httpResponseBadRequest = (response, message) => {
    logger.warn(message);
    let payload = {
        message
    };
    return response.status(StatusCodes.BAD_REQUEST).json(payload);

}
/**
 * 500 Internal Server Error
 * Unexpected condition that prevented it from fulfilling the request.
 * @param {*} response represents the HTTP response.
 * @param {*} error message to log.
 */
const httpResponseInternalServerError = (response, error) => {
    error.identifier = generateRandomCode(12);
    logger.fatal(error);
    let payload = {
        error: "Internal Server Error",
        identifier: error.identifier
    };
    return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(payload);

};

module.exports = {
    httpResponseInternalServerError, httpResponseValidation, httpResponseUnauthorized,
    httpResponseNotFound, httpResponseOk, httpResponseBadRequest,
    httpResponseErrorToken, httpResponseForbidden
}