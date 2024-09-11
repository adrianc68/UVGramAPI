const {getFileFromStorage} = require("../../dataaccess/storageDataAccess");
const {getURLResourceData} = require("../../dataaccess/urlRecoverDataAccess");
const {getExtensionFromMimeType} = require("../../helpers/fileHelper");
const {generateRandomCode} = require("../../helpers/generateCode");
const File = require("../../models/File");
const {SEND_SINGLE_FILE, INTERNAL_SERVER_ERROR} = require("../../services/httpResponsesService");
const {apiVersionType} = require("../../types/apiVersionType");

const mapFilesIntoFileModel = (request, response, next) => {
	const filesData = [].concat(request.files["files[]"]);
	const files = [];
	// The content is not saved in memory, because can consume a lot of main memory
	// The content is read when uploading from storageDataAccess.js and The
	// file in /tmp is removed.
	// So the File.content is null or undefined.
	filesData.forEach(file => {
		let extension = getExtensionFromMimeType(file.mimetype);
		let fileData = new File(null, {filepath: file.tempFilePath, filename: `${generateRandomCode(16)}.${extension}`, size: file.size, mimetype: file.mimetype});
		files.push(fileData);
	});
	request.files["files[]"] = files;
	return next();
}

const mapFileIntoFileModel = (request, response, next) => {
	const fileData = request.files["file"];
	let extension = getExtensionFromMimeType(fileData.mimetype);
	let file = new File(null, {filepath: fileData.tempFilePath, filename: `${generateRandomCode(16)}.${extension}`, size: fileData.size, mimetype: fileData.mimetype});
	request.files["file"] = file;
	return next();
}

const mapFileIfExistIntoFileModel = (request, response, next) => {
	if (request.files != null) {
		const fileData = request.files["file"];
		if (fileData != null) {
			let extension = getExtensionFromMimeType(fileData.mimetype);
			let file = new File(null, {filepath: fileData.tempFilePath, filename: `${generateRandomCode(16)}.${extension}`, size: fileData.size, mimetype: fileData.mimetype});
			request.files["file"] = file;
		}
	}
	return next();
}

const getFileFromURL = async (request, response, _) => {
	let url = request.query;
	let file;
	try {
		let data = await getURLResourceData(url)
			.then(data => data)
			.catch(error => {throw error});
		file = await getFileFromStorage(data.filename);
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	return SEND_SINGLE_FILE(response, file);
}

module.exports = {mapFilesIntoFileModel, getFileFromURL, mapFileIntoFileModel, mapFileIfExistIntoFileModel}
