const {Sequelize, Op} = require("sequelize");
const {sequelize} = require("../database/connectionDatabaseSequelize");
const {Message} = require("../models/Message");
const {Chat} = require("../models/Chat");
const {generateUUIDv4} = require("../helpers/generateCodeHelper");


const getAllMessagesFromChat = async (id_chat) => {

}

const getMessagesAfterTimestamp = async (id_chat, timestamp) => {

}

const sendMessage = async (id_sender, id_receiver, id_chat, message) => {
	let messageCreated = null;
	const uuid = generateUUIDv4();
	const t = await sequelize.transaction();
	try {
		messageCreated = await Message.create({
			id_user: id_sender,
			uuid,
			content: message.content,
			message_type: message.messageType,
			id_chat: id_chat
		}, {transaction: t});
		await t.commit();
	} catch (error) {
		await t.rollback();
		throw error;
	}
	messageCreated = messageCreated.get({plain: true});
	return messageCreated;
}

const createChatIfNotExists = async (id_user1, id_user2) => {
	let chat = null;
	const transaction = await sequelize.transaction();
	let uuid = generateUUIDv4();
	try {
		[chat] = await Chat.findOrCreate({
			where: {
				[Op.or]: [
					{id_user1: id_user1, id_user2: id_user2},
					{id_user1: id_user2, id_user2: id_user1}
				]
			},

			defaults: {
				uuid,
				id_user1: id_user1,
				id_user2: id_user2
			},
			transaction
		});
		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
	chat = chat.get({plain: true});
	return chat;
}

const deleteMessageById = async (id_message) => {

}


module.exports = {createChatIfNotExists, sendMessage}



