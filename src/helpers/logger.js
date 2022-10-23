const winston = require('winston');
const { combine, timestamp, colorize, align, printf, errors, prettyPrint } = winston.format;

const consoleFormat = printf((info) => `\n\n [${info.timestamp}] ${info.level}: ${info.message} '\n ${info.stack} \n\n`);
const logLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        debug: 4,
        trace: 5,
    },
    colors: {
        fatal: 'bold redBG',
        error: 'bold yellowBG',
        warn: 'blueBG',
        info: 'green',
        debug: 'green',
        trace: 'green'
    }
};

winston.addColors( logLevels.colors );

const logger = winston.createLogger({
    levels: logLevels.levels,
    level: process.env.LOG_LEVEL || 'info',
    format: combine(timestamp({ format: "YYYY-MM-DD hh:mm:ss A" }), errors({ stack: true }), prettyPrint()),
    transports: [
        new winston.transports.Console({
            format: combine(
                colorize({ all:true}),
                timestamp({ format: "YYYY-MM-DD hh:mm:ss A" }),
                consoleFormat,
            )
        }),
        new winston.transports.File({
            filename: "messages.log",
            level: 'warn',
        }),
    ],
});

module.exports = { logger }