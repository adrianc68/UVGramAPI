require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const { logger } = require("./helpers/logger");
const { redisClient, REDIS_PORT_CONNECTED_TO } = require("./database/connectionRedis");
const { sequelize } = require("./database/connectionDatabaseSequelize");
const { mailer } = require("./database/connetionEmail");
const { handleJSON } = require("./middleware/jsonValidation");

app.set("port", process.env.SV_PORT);
app.set("host", process.env.SV_HOST);
// middlewares
app.disable("x-powered-by");
app.use(helmet());
app.use(cors());
app.disable("etag");
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use(handleJSON);
// routers
app.use(require("./routers/userAccount"));
app.use(require("./routers/authentication"));
app.use(require("./routers/user"));
app.use(require("./routers/data"));
app.use(require("./routers/urlVerification"));

const connetionToServers = async () => {
    try {
        await sequelize.authenticate().then(async x => {
            await sequelize.sync({ force: false });
            logger.info(`PostgreSQL Client initialized on port ${sequelize.config.port}`)
        });
        await redisClient.connect().then(x => {
            logger.info(`Redis Client initialized on port ${REDIS_PORT_CONNECTED_TO}`);
        });

        await mailer.verify().then(x => {
            logger.info(`Nodemailer initialized on port ${mailer.options.port}`);
        });
    } catch (error) {
        logger.fatal(error);
    }
}

const clearDatabase = async () => {
    await sequelize.truncate({ cascade: true, restartIdentity: true });
    await sequelize.query("ALTER SEQUENCE user_id_seq RESTART WITH 1");
    await sequelize.query("ALTER SEQUENCE educationalprogram_id_seq RESTART WITH 1");
    await sequelize.query("ALTER SEQUENCE faculty_id_seq RESTART WITH 1");
    await sequelize.query("ALTER SEQUENCE region_id_seq RESTART WITH 1");
    await redisClient.flushAll("ASYNC");
}

module.exports = { app, connetionToServers, clearDatabase };