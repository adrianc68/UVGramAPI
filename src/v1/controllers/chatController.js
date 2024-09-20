const {createChatIfNotExists, sendMessage} = require("../../dataaccess/chatDataAccess");
const {uploadMessageFile} = require("../../dataaccess/storageDataAccess");
const {verifyToken} = require("../../dataaccess/tokenDataAccess");
const {createURLResource} = require("../../dataaccess/urlRecoverDataAccess");
const {getIdByUsername} = require("../../dataaccess/userDataAccess");
const {MessageType: MessageTypeEnum} = require("../../models/enum/MessageType");
const {INTERNAL_SERVER_ERROR, OK} = require("../../services/httpResponsesService");
const MessageType = require("../../types/MessageType");
const {apiVersionType} = require("../../types/apiVersionType");

const sendMessageController = async (request, response, next) => {
	const {username, messageType} = request.body;
	let {content} = request.body;
	const token = (request.headers.authorization).split(" ")[1];
	let isCreated = false;
	let chatInfo = null;
	let messageCreated = null;

	try {
		const idSender = await verifyToken(token).then(data => data.id);
		const idReceiver = await getIdByUsername(username);
		chatInfo = await createChatIfNotExists(idSender, idReceiver);

		if (messageType !== MessageTypeEnum.TEXT) {
			let file = request.files["file"];
			content = await uploadMessageFile(file, idSender, chatInfo.id);
		}
		let message = {content: content, messageType: messageType}
		messageCreated = await sendMessage(idSender, idReceiver, chatInfo.id, message);
		if (messageType !== MessageTypeEnum.TEXT) {
			messageCreated.content = await createURLResource(messageCreated.content);
		}
		delete chatInfo["id"];
		delete chatInfo["id_user1"];
		delete chatInfo["id_user2"];
		delete messageCreated["id"];
		delete messageCreated["id_user"];
		delete messageCreated["id_chat"];
		delete messageCreated["id_chatgroup"];
		isCreated = true;
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	let payload = {isCreated, ...MessageType.USER.DATA_CREATED, chatInfo, messageCreated}
	return OK(response, payload, apiVersionType.V1);
}

const getAllMessagesController = async (request, response, next) => {

}

module.exports = {sendMessageController}
