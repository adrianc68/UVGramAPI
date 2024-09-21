const {Sequelize, Op} = require("sequelize");
const {sequelize} = require("../database/connectionDatabaseSequelize");
const {Message} = require("../models/Message");
const {Chat} = require("../models/Chat");
const {generateUUIDv4} = require("../helpers/generateCodeHelper");
const {User} = require("../models/User");


const getAllMessagesFromChat = async (id_chat) => {
	let messages = null;
	messages = await Message.findAll({
		where: {
			id_chat
		},
		include: [{
			model: User
		}]
	});
	messages = messages.map(message => message.get({plain: true}));
	return messages;
}

const getChatByUuid = async (uuid) => {
	let chat = null;
	chat = await Chat.findOne({
		where: {
			uuid
		}
	});
	return chat;
}

const getAllChats = async (id_user) => {
	let chats = null
	chats = await Chat.findAll({
		where: {
			[Op.or]: [
				{id_user1: id_user},
				{id_user2: id_user}
			]
		}
	})
	return chats;
}

const getAllChatsWithLastMessage = async (id_user) => {
	let chats = null
	chats = await Chat.findAll({
		where: {
			[Op.or]: [
				{id_user1: id_user},
				{id_user2: id_user}
			]
		},
		include: [{
			model: Message,
			required: false,
			limit: 1,
			order: [['sent_at', 'DESC']],
			include: [{
				model: User,
			}]
		}, {
			model: User,
			as: "initiator",
		}, {
			model: User,
			as: "receiver",
		}],
	})
	chats = chats.map(chat => chat.get({plain: true}));
	return chats
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


module.exports = {
	createChatIfNotExists, sendMessage, getAllChats,
	getAllChatsWithLastMessage, getAllMessagesFromChat, getChatByUuid
}
