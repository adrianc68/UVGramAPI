const app = require("./app");
const { logger } = require("./helpers/logger");

const server = app.listen(app.get("port"), () => {
    logger.info(`NodeJS Express Server initialized on port ${app.get("port")}`);
});

module.exports = { server }