require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const {logger} = require("./helpers/logger");
const {redisClient, REDIS_PORT_CONNECTED_TO} = require("./database/connectionRedis");
const {sequelize} = require("./database/connectionDatabaseSequelize");
const {mailer} = require("./database/connetionEmail");
const {handleJSON} = require("./middleware/jsonValidation");
const fileUpload = require("express-fileupload");
const {connectToSftpServer} = require("./database/connectionSftpServer");
const os = require("os");
const path = require("path");


const corsOptions = {
    origin: '*',  // Permite todas las solicitudes desde cualquier origen
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],  // Permite métodos específicos
    allowedHeaders: ['Content-Type', 'Authorization']  // Permite headers específicos
};

app.set("port", process.env.SV_PORT);
app.set("host", process.env.SV_HOST);
// middlewares
app.disable("x-powered-by");
app.use(helmet({crossOriginResourcePolicy: false,}));
app.use(cors(corsOptions));
app.disable("etag");
app.use(morgan("dev"));
app.use(express.urlencoded({extended: false}));
app.use(express.json())
app.use(handleJSON);
app.use(fileUpload({
	useTempFiles: true,
	tempFileDir: "./tmp/"
	// tempFileDir: path.join(os.tmpdir(), 'app_uploads') Use this is better than other
}));

app.use(require("./v1/routers/userAccount"));
app.use(require("./v1/routers/authentication"));
app.use(require("./v1/routers/user"));
app.use(require("./v1/routers/data"));
app.use(require("./v1/routers/urlVerification"));
app.use(require("./v1/routers/post"));
app.use(require("./v1/routers/comment"));
app.use(require("./v1/routers/resource"));

const connetionToServers = async () => {
	await sequelize.authenticate().then(async () => {
		await sequelize.sync({force: false});
		logger.info(`PostgreSQL Client initialized on port ${sequelize.config.port}`)
	}).then(async () => {
		await redisClient.connect().then(() => {
			logger.info(`Redis Client initialized on port ${REDIS_PORT_CONNECTED_TO}`);
		});
	}).then(async () => {
		await mailer.verify().then(() => {
			logger.info(`Nodemailer initialized on port ${mailer.options.port}`);
		});
	}).then(async () => {
		await connectToSftpServer().then(async (sftpClient) => {
			// await sftpClient.end();
			logger.info('SFTP Client is OK');
		})
	}).catch(error => {
		logger.error(error);
	})

}

module.exports = {app, connetionToServers};
