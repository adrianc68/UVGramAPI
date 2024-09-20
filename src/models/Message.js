const {sequelize} = require("../database/connectionDatabaseSequelize");
const {DataTypes} = require("sequelize");
const {MessageType} = require("./enum/MessageType");
const {MessageStatusType} = require("./enum/MessageStatusType");
const {User} = require("./User");
const {Chat} = require("./Chat");
const {ChatGroup} = require("./ChatGroup");

const Message = sequelize.define("Message", {
	id: {
		type: DataTypes.BIGINT,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	uuid: {
		type: DataTypes.STRING,
		allowNull: false
	},
	content: {
		type: DataTypes.TEXT
	},
	sent_at: {
		type: DataTypes.STRING
	},
	message_type: {
		type: DataTypes.ENUM(MessageType.TEXT, MessageType.IMAGE, MessageType.VIDEO)
	},
	id_user: {
		type: DataTypes.BIGINT,
		allowNull: false
	},
	message_status: {
		type: DataTypes.ENUM(MessageStatusType.POLICY_VIOLATION, MessageStatusType.READ, MessageStatusType.REMOVED, MessageStatusType.SENT)
	},
	delivery_at: {
		type: DataTypes.STRING
	},
	id_chatgroup: {
		type: DataTypes.BIGINT
	},
	id_chat: {
		type: DataTypes.BIGINT
	}
}, {
	timestamps: false,
	freezeTableName: true
});

User.hasMany(Message, {
	foreignKey: "id_user",
	sourceKey: "id"
});

Message.belongsTo(User, {
	foreignKey: "id_user",
	targetKey: "id"
});

Message.belongsTo(Chat, {
	foreignKey: "id_chat",
	targetKey: "id"
});

Chat.hasMany(Message, {
	foreignKey: "id_chat",
	sourceKey: "id"
});

Message.belongsTo(ChatGroup, {
	foreignKey: "id_chatgroup",
	targetKey: "id"
});

ChatGroup.hasMany(Message, {
	foreignKey: "id_chatgroup",
	sourceKey: "id"
});


module.exports = {Message}
