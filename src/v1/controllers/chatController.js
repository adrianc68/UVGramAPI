const {createChatIfNotExists, sendMessage, getAllChats, getAllChatsWithLastMessage, getAllMessagesFromChat} = require("../../dataaccess/chatDataAccess");
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

const getAllChatsCreated = async (request, response, next) => {
	const token = (request.headers.authorization).split(" ")[1];
	let chats = null;
	try {
		const idUser = await verifyToken(token).then(data => data.id);
		chats = await getAllChatsWithLastMessage(idUser);
		await Promise.all(chats.map(async function (chat) {
			chat.initiator.url = await createURLResource(chat.initiator.filepath);
			delete chat["id"];
			delete chat["id_user1"];
			delete chat["id_user2"];
			delete chat.initiator["filepath"];
			delete chat.initiator["presentation"];
			delete chat.initiator["id"];
			chat.receiver.url = await createURLResource(chat.receiver.filepath);
			delete chat.receiver["filepath"];
			delete chat.receiver["presentation"];
			delete chat.receiver["id"];
			await Promise.all(chat.Messages.map(async function (message) {
				message.User.url = await createURLResource(message.User.filepath);
				delete message["id"];
				delete message["id_user"];
				delete message["id_chatgroup"];
				delete message["id_chat"];
				delete message.User["filepath"];
				delete message.User["presentation"];
				delete message.User["id"];
			}));
		}));

	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	let message = {...MessageType.USER.DATA_NOT_FOUND}
	if (chats) {
		message = {...MessageType.USER.DATA_FOUND}
	}
	let payload = {chats: chats, message}
	return OK(response, payload, apiVersionType.V1);
}

const getAllMessagesByChatUuid = async (request, response, next) => {
	let uuid = request.params.uuid;
	if (!uuid) uuid = request.body.uuid;
	let messages = null;
	try {
		let chatData = response.locals.chatData;
		messages = await getAllMessagesFromChat(chatData.id);

		await Promise.all(messages.map(async function (message) {
			message.User.url = await createURLResource(message.User.filepath);
			delete message["id"];
			delete message["id_user"];
			delete message["id_chatgroup"];
			delete message["id_chat"];
			delete message.User["filepath"];
			delete message.User["presentation"];
			delete message.User["id"];
		}));

	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	let payload = {messages, ...MessageType.USER.DATA_FOUND}
	return OK(response, payload, apiVersionType.V1);
}

module.exports = {sendMessageController, getAllChatsCreated, getAllMessagesByChatUuid}
