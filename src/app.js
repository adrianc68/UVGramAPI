require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const { logger } = require("./helpers/logger");
const { redisClient } = require("./database/connectionRedis");
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

async function main() {
    try {
        await sequelize.sync({ force: false });

        redisClient.on("connect", (err) => {
            logger.info(`Successful connnection to Redis on port ${process.env.REDIS_PORT}`);
        });
        await redisClient.connect();

        app.listen(app.get("port"), () => {
            logger.info(`Server initialized on port ${app.get("port")}`);
        });
    } catch (error) {
        logger.fatal(error);
    }
}

main();

