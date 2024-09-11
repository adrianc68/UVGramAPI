const {getFilenameFromPath, getMimeTypeFromFilename} = require("../helpers/fileHelper");
const File = require("../models/File");
const {mkdir, uploadFile, exists, downloadFile, deleteFile, listFiles, rmdir} = require("./sftpClient");
const fs = require('fs');

const uploadFileImageProfile = async(file, idUser) => {
	let path = `${idUser}`;
	let filename = `${path}/${file.metadata.filename}`;
	let dirCreated =  await ensureDirCreated(path);
	if(!dirCreated) {
		return false;
	}
	let readStream = fs.createReadStream(file.metadata.filepath);
	readStream.on("error", (error) => {
		throw error;
	});
	return uploadFile(readStream, filename)
		.then(fileResult => fileResult ? filename : false)
		.catch(error => {throw error});
}

const uploadPostfile = async (file, idUser, idPost) => {
	let path = `${idUser}/${idPost}`;
	let filename = `${path}/${file.metadata.filename}`;
	let dirCreated = await ensureDirCreated(path);
	if (!dirCreated) {
		return false;
	}
	let readStream = fs.createReadStream(file.metadata.filepath);
	readStream.on("end", () => {
		readStream.close();
		fs.unlink(file.metadata.filepath, (error) => {
			if (error) throw error;
		});
	})

	readStream.on("error", (error) => {
		throw error;
	});

	return uploadFile(readStream, filename)
		.then(fileResult => fileResult ? filename : false)
		.catch(error => {throw error});
}

const uploadPostFiles = async (files, idUser, idPost) => {
	let path = `${idUser}/${idPost}`;
	let dirCreated = await ensureDirCreated(path);
	if (!dirCreated) {
		return false;
	}
	return Promise.all(files.map(async file => {
		let readStream = fs.createReadStream(file.metadata.filepath);
		readStream.on("end", () => {
			readStream.close();
			fs.unlink(file.metadata.filepath, (error) => {
				if (error) throw error;
			});
		});
		readStream.on("error", (error) => {
			throw error;
		});
		let filePath = `${path}/${file.metadata.filename}`;
		return uploadFile(readStream, filePath)
			.then(fileResult => fileResult ? filePath : false)
			.catch(error => {throw error});
	}));
}

const getFileFromStorage = async (path) => {
	let filename = getFilenameFromPath(path);
	let mimeType = getMimeTypeFromFilename(filename);
	return downloadFile(path)
		.then(buffer => new File(buffer, {filename: filename, mimetype: mimeType, filepath: path}))
		.catch(error => {throw error});
}

const getFilesFromStorage = async (path) => {
	let isValidPath = await exists(path);
	if (!isValidPath) {
		return false;
	}
	let files = await listFiles(path);
	let promises = await Promise.all(files.map(async file => {
		let pathFile = `${path}/${file.name}`;
		let mimeType = getMimeTypeFromFilename(file.name)
		return downloadFile(pathFile)
			.then(buffer => new File(buffer, {filename: file.name, mimetype: mimeType, filepath: pathFile}))
			.catch(error => {throw error});
	}));
	return promises;
}

const deleteFileFromStorage = async (path) => {
	return await deleteFile(path)
		.then(deleteResult => deleteResult)
		.catch(error => {throw error});
}

const deleteFilesFromStorage = async (path) => {
	let isValidPath = await exists(path);
	if (!isValidPath) {
		return false;
	}
	let files = await listFiles(path);
	let promises = await Promise.all(files.map(async file => {
		let pathFile = `${path}/${file.name}`;
		return deleteFile(pathFile);
	}));
	if (promises.every(result => result === true)) {
		return await rmdir(path, false);
	}
	return false;
}

const ensureDirCreated = async (path) => {
	return await exists(path)
		.then(exists => exists ? true : mkdir(path, true))
		.then(createDir => createDir)
		.catch(error => {throw error});
}

module.exports = {
	uploadPostfile, getFileFromStorage, uploadPostFiles,
	deleteFileFromStorage, deleteFilesFromStorage, getFilesFromStorage,
	uploadFileImageProfile
}
