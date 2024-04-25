const {sftpClient} = require("../database/connectionSftpServer");

const mkdir = async (path, recursive) => {
	return sftpClient.mkdir(path, recursive)
		.then(dirCreated => dirCreated === `${path} directory created`)
		.catch(error => {throw error});
}

const exists = async (path) => {
	return sftpClient.exists(path)
		.then(type => type === "d")
		.catch(error => {throw error});
}

const uploadFile = async (file, path) => {
	return sftpClient.put(file, path)
		.then(upload => upload === `Uploaded data stream to ${path}`)
		.catch(error => {throw error});
}

const downloadFile = async (path) => {
	return sftpClient.get(path)
		.then(file => file)
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
		.then(deleteFile => deleteFile === `Successfully deleted ${path}`)
		.catch(error => {throw error});
}

const listFiles = async (path) => {
	return sftpClient.list(path);
}

const rmdir = async (path, recursive) => {
	return sftpClient.rmdir(path, recursive)
		.then(deleteFile => deleteFile === "Successfully removed directory")
		.catch(error => {throw error});
}

module.exports = {
	listFiles, uploadFile, downloadFile, downloadFilePassThrough,
	deleteFile, mkdir, exists, rmdir
}
