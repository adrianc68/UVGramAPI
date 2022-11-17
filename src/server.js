const { app, connetionToServers } = require("./app");
const { logger } = require("./helpers/logger");

const server = app.listen(app.get("port"), async () => {
    if(process.env.NODE_ENV == "TEST") {
        logger.info("************** Starting TEST environment **************");
    } else {
        logger.info("************** Starting PROD environment **************");
        await connetionToServers();
    }
    logger.info(`NodeJS Express Server initialized on port ${app.get("port")}`);
});

module.exports = { server }