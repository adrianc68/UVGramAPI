require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const { logger } = require("./helpers/logger");
const { redisClient, REDIS_PORT_CONNECTED_TO } = require("./database/connectionRedis");
const { sequelize } = require("./database/connectionDatabaseSequelize");
const { handleJSON } = require("./middleware/jsonValidation");

app.set("port", process.env.SV_PORT);
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

const connetionToServers = async () => {
    try {
    await sequelize.authenticate().then(async x => {
        await sequelize.sync({ force: false });
        logger.info(`PostgreSQL Client initialized on port ${sequelize.config.port}`)
    });
    await redisClient.connect().then(x => {
        logger.info(`Redis Client initialized on port ${REDIS_PORT_CONNECTED_TO}`);
    });
    } catch (error) {
        logger.fatal(error);
    }
}

// connetionToServers();

module.exports = { app, connetionToServers };