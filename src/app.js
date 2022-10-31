require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const { logger } = require("./helpers/logger");
const { handleJSON } = require("./helpers/jsonValidationMiddleware");
const { redisClient } = require("./database/connectionRedis");

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
        redisClient.on("connect", (err) => {
            logger.info(`Successful connnection to Redis on port ${process.env.REDIS_PORT}`);
        });
        await redisClient.connect();

        app.listen(app.get("port"), () => {
            logger.info(`Server initialized on port ${app.get("port")}`);
        });

        // const payload = {
        //     username: "adrianc68",
        //     userID: 1,
        //     userRole: "PERSONAL"
        // }
        // const accessToken = await generateAccessToken(payload, "5m");
        // // // const refreshToken = await generateAccessToken(payload, "12h");
        // await addToken(payload.userID, accessToken);
        // await addToken(payload.userID, refreshToken);
        // console.log(accessToken);
        // //console.log(refreshToken);
        // console.log("VERIFY TOKEN: " + JSON.stringify(await verifyToken(accessToken)));
        // console.log("CHECK TOKEN: " + await checkToken("1", accessToken))
        // // await sequelize.sync({ force: false });

        // console.log("BLACK LIST TOKEN: " + await blacklistToken(payload.userID, accessToken));
        // console.log("VERIFY TOKEN: " + JSON.stringify(await verifyToken(accessToken)));
        // console.log("CHECK TOKEN: " + await checkToken("1", accessToken));
        // logger.trace("*********GET ALL TOKENS FROM REDIS ******");
        // await getAllTokens()
    } catch (error) {
        logger.fatal(error);
    }
}

main();

