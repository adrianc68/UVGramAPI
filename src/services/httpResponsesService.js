/**
 * httpResponseService.js - Service for generating HTTP responses in a web application or API.
 *
 * This file contains functions for generating HTTP responses with various status codes and optional messages. It simplifies the process of creating and sending responses to clients by providing a consistent format for success and error responses.
 */
const {StatusCodes} = require("http-status-codes");
const {logger} = require("./loggingService");
const {generateUUIDv4} = require("../helpers/generateCodeHelper");
const {apiVersionType} = require("../types/apiVersionType");
const httpContentType = require("../types/httpContentType");
const ExceptionType = require("../types/exceptionType");

/**
 * 200 OK
 * The request has succeeded.
 * @param {object} response represents the HTTP response
 * @param {object} message message to send the HTTP response.
 * @param {apiVersionType} version API's version.
 */
const OK = (response, message = null, version) => {
	let payload = {
		status: StatusCodes.OK,
		message: "Successful Request",
		data: buildMessageData(message),
		version,
	};
	sendResponse(response, payload);
};

/**
 * 201 CREATED
 * Resource created
 * @param {object} response represents the HTTP response
 * @param {object} message message to send the HTTP response.
 * @param {apiVersionType} version API's version.
 */
const CREATED = (response, message = null, version) => {
	let payload = {
		status: StatusCodes.CREATED,
		message: "Resource created",
		data: buildMessageData(message),
		version,
	};
	sendResponse(response, payload);
}

/**
 * 204 NO CONTENT
 * No content in response
 * This create {} with no content.
 * @param {object} response represents the HTTP response
 * @param {object} message message to send the HTTP response.
 * @param {apiVersionType} version API's version.
 */
const NO_CONTENT = (response, message = null, version) => {
	let payload = {
		status: StatusCodes.NO_CONTENT,
		message: "No content",
		data: buildMessageData(message),
		version,
	};
	sendResponse(response, payload);
}

/**
 * 400 Bad Request
 * Server could not understand the request due to invalid syntax
 * @param {object} response represents the HTTP response.
 * @param {object} message message to send the HTTP response.
 * @param {apiVersionType} version API's version.
 */
const BAD_REQUEST = (response, message = null, version) => {
	let payload = {
		status: StatusCodes.BAD_REQUEST,
		message: "Invalid request",
		data: buildMessageData(message),
		version,
	};
	sendResponse(response, payload);
};

/**
 * 401 Unathorized
 * Client must authenticate to get the requested response.
 * @param {object} response represents the HTTP response
 * @param {apiVersionType} version API's version.
 */
const UNAUTHORIZED = (response, message = null, version) => {
	let payload = {
		status: StatusCodes.UNAUTHORIZED,
		message: "Authentication required",
		data: buildMessageData(message),
		version,
	};
	sendResponse(response, payload);
};

/**
 * 404 Not Found
 * Can not find requested resource.
 * @param {object} response represents the HTTP response
 * @param {object} message message to send the HTTP response.
 * @param {apiVersionType} version API's version.
 */
const NOT_FOUND = (response, message = null, version) => {
	let payload = {
		status: StatusCodes.NOT_FOUND,
		message: "Resource not found",
		data: buildMessageData(message),
		version,
	};
	sendResponse(response, payload);
};

/**
 * 403 forbidden 
 * client does not have right access to the content.
 * @param {object} response represents the http response.
 * @param {object} message message to send the HTTP response.
 * @param {apiVersionType} version API's version.
 */
const FORBIDDEN = (response, message, version) => {
	let payload = {
		status: StatusCodes.FORBIDDEN,
		message: message,
		data: null,
		version,
	};
	sendResponse(response, payload);
};

/**
 * 405 Method Not Allowed
 * Unsupported HTTP method
 * @param {object} response represents the HTTP response
 * @param {apiVersionType} version API's version.
 */
const METHOD_NOT_ALLOWED = (response, version) => {
	let payload = {
		status: StatusCodes.METHOD_NOT_ALLOWED,
		message: "Unsupported HTTP method",
		data: null,
		version
	};
	sendResponse(response, payload);
}

/**
 * 500 Internal Server Error
 * Unexpected condition that prevented it from fulfilling the request.
 * @param {object} response represents the HTTP response.
 * @param {object} error message to log.
 * @param {apiVersionType} version API's version.
 */
const INTERNAL_SERVER_ERROR = (response, error, version) => {
	let identifier = generateUUIDv4();
	error.identifier = identifier;
	logger.fatal(error);
	let payload = {
		status: StatusCodes.INTERNAL_SERVER_ERROR,
		error: "Internal Server Error",
		identifier,
		message: "Please contact an administrator and provide the identifier.",
		version,
	};
	sendResponse(response, payload);
};

/**
 * 501 Not implemented
 * Request method is not supported by server.
 * @param {object} response represents the HTTP response.
 * @param {object} message message to send the HTTP response.
 * @param {apiVersionType} version API's version.
 */
const NOT_IMPLEMENTED = (response, version) => {
	let payload = {
		status: StatusCodes.NOT_IMPLEMENTED,
		message: "Not implemented",
		data: null,
		version,
	};
	sendResponse(response, payload);
};

/**
 * 502 Bad Gateway
 * Invalid response from upstream server
 * @param {object} response represents the HTTP response
 * @param {object} message message to send the HTTP response.
 * @param {apiVersionType} version API's version.
 */
const BAD_GATEWAY = (response, version) => {
	let payload = {
		status: StatusCodes.BAD_GATEWAY,
		message: "Invalid response from upstream server",
		data: null,
		version,
	};
	sendResponse(response, payload);
}

/**
 * 503 Service unavailable
 * Server unavailable
 * @param {object} response represents the HTTP response
 * @param {object} message message to send the HTTP response.
 * @param {apiVersionType} version API's version.
 */
const UNAVAILABLE = (response, version) => {
	let payload = {
		status: StatusCodes.SERVICE_UNAVAILABLE,
		message: "Server unavailable",
		data: null,
		version
	};
	sendResponse(response, payload);
}

/**
 * Sends a single file as a response.
 *
 * @param {object} response - The HTTP response object.
 * @param {object} file - The file object containing metadata and content.
 * @param {Buffer} file.content - The content of the file as a Buffer.
 * @param {object} file.metadata - Metadata associated with the file.
 * @param {string} file.metadata.contentType - The content type of the file.
 * @param {string} file.metadata.filename - The filename of the file.
 * @throws {Error} Throws an error if there is any issue during the response.
 */
const SEND_SINGLE_FILE = (response, file) => {
	if (file === null) {
		throw new Error(ExceptionType.NO_FILE_PROVIDED);
	}
	response.setHeader('Content-Type', file.metadata.mimetype);
	response.setHeader('Content-Disposition', 'attachment; filename=' + file.metadata.filename);
	response.write(file.content);
	return response.end();
};

/**
 * Sends multiple files as a zip archive in the response.
 *
 * @param {object} response - The HTTP response object.
 * @param {object[]} files - An array of file objects, each containing metadata and content.
 * @param {Buffer} files[].content - The content of the file as a Buffer.
 * @param {object} files[].metadata - Metadata associated with the file.
 * @param {string} files[].metadata.contentType - The content type of the file.
 * @param {string} files[].metadata.filename - The filename of the file.
 * @throws {Error} Throws an error if there is any issue during the response.
 */
const SEND_MULTIPLE_FILES = (response, files) => {
	if (files === null || files.length === 0) {
		throw new Error(ExceptionType.NO_FILE_PROVIDED);
	}
	const archiver = require('archiver');
	const zip = archiver('zip');
	response.setHeader('Content-Type', httpContentType.ZIP);
	response.setHeader('Content-Disposition', 'attachment; filename=files.zip');
	zip.pipe(response);
	let uniqueNames = [];
	let counter = 0;
	for (const file of files) {
		let filename = file.metadata.filename;
		if (uniqueNames.includes(filename)) {
			let fileExtension = filename.split('.').pop();
			let basename = filename.substring(0, filename.lastIndexOf("."));
			do {
				counter = counter + 1;
				filename = `${basename}${counter}.${fileExtension}`;
			} while (uniqueNames.includes(filename));
			counter = 0;
		}
		uniqueNames.push(filename);
		zip.append(file.content, {name: filename});
	}
	return zip.finalize();
};

const buildMessageData = (message) => {
	let messageType = typeof message;
	if (messageType === "string") {
		return {message};
	} else if (messageType === "object") {
		return message;
	}
	return null;
};

const sendResponse = (response, payload) => {
	return response.status(payload.status).json(payload);
}

module.exports = {
	INTERNAL_SERVER_ERROR, UNAUTHORIZED, NOT_FOUND, OK, BAD_REQUEST,
	CREATED, FORBIDDEN, NOT_IMPLEMENTED, BAD_GATEWAY, UNAVAILABLE,
	NO_CONTENT, METHOD_NOT_ALLOWED, buildMessageData, SEND_SINGLE_FILE,
	SEND_MULTIPLE_FILES
}
