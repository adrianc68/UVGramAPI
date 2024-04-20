const { NODE_ENV} = process.env;
const Client = require("ssh2-sftp-client");
const sftpClient = new Client();

const connectToSftpServer = async () => {
	if (NODE_ENV === "TEST") {
		await sftpClient.connect({
			host: 'localhost',
			port: '2222',
			username: 'sftpuser',
			privateKey: require('fs').readFileSync("./dev/docker_ssh_client")
		});
	} else {
		await sftpClient.connect({
			host: 'localhost',
			port: '2222',
			username: 'sftpuser',
			privateKey: require('fs').readFileSync("./dev/docker_ssh_client")
		});	
	}
	return sftpClient;
}

module.exports = {connectToSftpServer, sftpClient};
