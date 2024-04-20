const {sftpClient} = require("../database/connectionSftpServer");
const MessageType = require("../types/MessageType");

const mkdir = async (path, recursive) => {
	return sftpClient.exists(path)
		.then(type => type.error ? Promise.reject(type.error) : type)
		.then(type => type === "d" ? true : sftpClient.mkdir(path, recursive))
		.then(dirCreated => dirCreated.error ? Promise.reject(dirCreated.error) : dirCreated)
		.then(dirCreated => dirCreated === `${path} directory created`)
		.catch(error => {throw error});
}

const uploadFile = async (file, path) => {
	return sftpClient.put(file, path)
		.then(upload => upload.error ? Promise.reject(upload.error) : upload)
		.then(upload => upload === `Uploaded data stream to ${path}`)
		.catch(error => {throw error});
}

const downloadFile = async (path) => {
	return sftpClient.get(path)
		.then(file => file.error ? Promise.reject(file.error) : file)
		.catch(error => {throw error});
}

const downloadFilePassThrough = async (path, response) => {
	return sftpClient.get(path)
		.then(fileStream => {
			response.setHeader('Content-Disposition', `attachment; filename="${path}"`);
			response.setHeader('Content-Type', 'application/octet-stream');
			response.write(fileStream);
			response.end();
		}).catch(error => {
			throw error;
		});
}

const deleteFile = async (path) => {
	return sftpClient.delete(path, true)
		.then(deleteFile => deleteFile.error ? Promise.reject(deleteFile.error) : deleteFile)
		.then(deleteFile => deleteFile === `Successfully deleted ${path}`)
		.catch(error => {throw error});
}

const listFiles = async (pathname) => {
	return sftpClient.listFiles(pathname);
}

module.exports = {listFiles, uploadFile, downloadFile, downloadFilePassThrough, deleteFile, mkdir}
