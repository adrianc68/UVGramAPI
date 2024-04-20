const {CREATED, UNAUTHORIZED, OK, INTERNAL_SERVER_ERROR} = require("../../services/httpResponsesService");
const {apiVersionType} = require("../../types/apiVersionType");
const MessageType = require("../../types/MessageType");
const {generateTokens, deleteAllSessionByAccessToken, verifyToken, removeToken, refreshAccessToken} = require("../../dataaccess/tokenDataAccess");
const {getAccountLoginData, getAccountLoginDataById} = require("../../dataaccess/userDataAccess");
const {uploadFile, uploadFiles, downloadFile, downloadFilePassThrough, deleteFile} = require("../../dataaccess/storageDataAccess");

const createTokens = async (request, response) => {
	let {emailOrUsername} = request.body;
	let tokens;
	try {
		let userData = await getAccountLoginData(emailOrUsername);
		let device_info = request.headers.host;
		tokens = await generateTokens(userData.id, userData.role, device_info);
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	return OK(response, tokens, apiVersionType.V1);
};

const refreshTokens = async (request, response) => {
	let newAccessToken;
	let refreshToken = (request.headers.authorization).split(" ")[1];
	let resultRemoveAccessToken;
	try {
		let refreshTokenData = await verifyToken(refreshToken);
		let userData = await getAccountLoginDataById(refreshTokenData.id);
		newAccessToken = await refreshAccessToken(userData.id, userData.role, refreshTokenData.jti);
		if (request.headers.accesstoken) {
			let optionalAccessToken = (request.headers.accesstoken).split(" ")[1];
			let optionalTokenData = await verifyToken(optionalAccessToken);
			if (optionalTokenData.refreshTokenJti == refreshTokenData.jti) {
				resultRemoveAccessToken = (optionalAccessToken) ? await removeToken(optionalAccessToken) : undefined;
			} else {
				resultRemoveAccessToken = MessageType.USER.UNAUTHORIZED;
			}
		}
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	const payload = {
		accessToken: newAccessToken.accessToken.token,
		optionalAccessTokenMessage: resultRemoveAccessToken
	}
	return OK(response, payload, apiVersionType.V1);
};

const logoutSession = async (request, response) => {
	let accessToken = (request.headers.authorization).split(" ")[1];
	try {
		await deleteAllSessionByAccessToken(accessToken);
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	return OK(response, MessageType.USER.LOGOUT_SUCESSFUL, apiVersionType.V1);
};

const checkRolesAuth = (roles) => async (request, response, next) => {
	const token = (request.headers.authorization).split(" ")[1];
	let userRoleData;
	try {
		userRoleData = (await verifyToken(token)).userRole;
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	let rolesAllowed = [].concat(roles);
	if (!rolesAllowed.includes(userRoleData)) {
		return UNAUTHORIZED(response, MessageType.USER.UNAUTHORIZED, apiVersionType.V1);
	}
	return next();
};

const sayHello = async (request, response) => {
	let file = require('fs').readFileSync("./tmp/subirlo.txt");
	let file2 = require('fs').readFileSync("./tmp/subirlo2.txt");
	let file3 = require('fs').readFileSync("./tmp/subirlo3.txt");
	let file4 = require('fs').readFileSync("./tmp/subirlo4.txt");
	let file5 = require('fs').readFileSync("./tmp/subirlo5.txt");
	let result = false;
	try {
		// result = await uploadFile(file, "subirlo.txt");
		//
		//
		//
		//
		//
		// Upload array files
		// let files = [file, file2, file3, file4, file5];
		// let i = 0;
		// let promises = Promise.all(files.map(fileData => {
		// 	i++;
		// 	return uploadFile(fileData, `${i}.txt`);
		// }));

		// await promises.then(results => {
		// 	console.log(results);
		// 	console.log("Archivos arriba");
		// 	result = true;
		// }).catch(error => {
		// 	console.log(error);
		// })


		// download file
		const filename = "adrianc68.txt";
		// let result = await downloadFile(filename);
		// response.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
		// response.setHeader('Content-Type', 'application/octet-stream');
		// response.send(result);


		// download file passthrough
		// await downloadFilePassThrough(filename, response);


		// delete file
		// result = await deleteFile("adrianc68.txt");



		// response.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
		// response.setHeader('Content-Type', 'application/octect-stream');
		// response.status(200).send(fileContent);
		// let result = new Promise((resolve, reject) => {
		// 	let promises = [];

		// });

		// result = await uploadFiles(files, "adrianc68.txt");
	} catch (error) {
		console.log(error);
		return response.send("error");
	}
	return response.status(200).send(result);
};

module.exports = {createTokens, refreshTokens, logoutSession, checkRolesAuth, sayHello}
