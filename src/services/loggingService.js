/**
 * LoggingService - Service for handling and configuring application logging.
 *
 * This file provides a logging service that enables the management and recording of various events and messages within an application. It offers flexible configuration options for log levels, custom formatting, and the choice of console or file-based logging.
 *
 * @module loggingService
 */
const winston = require('winston');
const {apiEnvironmentType} = require('../types/apiEnvironmentType');
const {combine, timestamp, colorize, printf, errors, json, prettyPrint} = winston.format;

const logLevels = {
	levels: {
		fatal: 0, // Statements representing the most severe of error conditions, assumedly resulting in program termination.
		error: 1, // Statements that describe non-fatal errors in the application; quite often for loggin handled exceptions.
		warn: 2,  // Statements that describe potentially harmful events or states in the program.
		info: 3,  // Statements concerning program state, representing program events or behavior tracking.
		debug: 4, // Fine-grained statements concerning program state, typically used for debugging.
		trace: 5, // Statements that provide context to understand the steps leading up to errors and warnings
	},
	colors: {
		fatal: 'bold redBG',
		error: 'bold yellowBG',
		warn: 'blueBG',
		info: 'green',
		debug: 'yellow',
		trace: 'blue'
	}
};

const consoleFormat = printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}` + `\n${info.stack}`);

const transportsTypes = {
	development: new winston.transports.Console({
		format: combine(
			colorize({all: true}),
			timestamp({format: "YYYY-MM-DD hh:mm:ss A"}),
			errors({stack: true}),
			json(),
			consoleFormat,
		)
	}),

	production: new winston.transports.Console({
		format: combine(
			timestamp({format: "YYYY-MM-DD hh:mm:ss A"}),
			errors({stack: true}),
			json(),
		),
	}),
}

/**
 * Create a logger with console and file configuration
 */
const createLogger = () => {
	winston.addColors(logLevels.colors);
	const logLevel = process.env.NODE_ENV === apiEnvironmentType.TESTING ? 'silent' : 'trace';
	const transport = process.env.NODE_ENV === apiEnvironmentType.DEVELOPMENT ? transportsTypes.development : transportsTypes.production;

	return winston.createLogger({
		levels: logLevels.levels,
		level: logLevel,
		format: combine(timestamp({format: "YYYY-MM-DD hh:mm:ss A"}), errors({stack: true}), prettyPrint()),
		transports: transport,
	});
}

const logger = createLogger();

module.exports = {logger, createLogger, consoleFormat, transportsTypes}
