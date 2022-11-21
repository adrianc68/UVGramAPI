const { app, connetionToServers, clearDatabase } = require("./app");
const { logger } = require("./helpers/logger");

const server = app.listen({
    port: app.get("port"),
    host: app.get("host")
}, async () => {
    if (process.env.NODE_ENV == "TEST") {
        logger.info("************** starting TEST environment **************");
        logger.info(`NodeJS Express Server initialized on port ${app.get("port")}`);
    } else {
        logger.info("************** starting PROD environment **************");
        await connetionToServers();
        logger.info(`NodeJS Express Server initialized on port ${app.get("port")}`);
        logger.info("*******************************************************");
    }
});

async function delayServerConnections() {
    await connetionToServers();
    logger.info("************** ************** **************");
};

module.exports = { server, delayServerConnections }