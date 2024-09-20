const {sequelize} = require("../database/connectionDatabaseSequelize");
const {DataTypes} = require("sequelize");
const {Message} = require("./Message");

const MessageSeen = sequelize.define("MessageSeen", {
	id_message: {
		type: DataTypes.BIGINT,
		allowNull: false,
	},
	id_user: {
		type: DataTypes.BIGINT,
		allowNull: false,
	},
	seen_at: {
		type: DataTypes.STRING,
	}
}, {
	timestamps: false,
	freezeTableName: true
});

Message.hasMany(MessageSeen, {
	foreignKey: "id_message",
	sourceKey: "id"
});

MessageSeen.belongsTo(Message, {
	foreignKey: "id_message",
	targetKey: "id"
});

module.exports = {MessageSeen};
