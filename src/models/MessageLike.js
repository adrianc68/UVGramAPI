const {sequelize} = require("../database/connectionDatabaseSequelize");
const {DataTypes} = require("sequelize");
const {Message} = require("./Message");

const MessageLike = sequelize.define("MessageLike", {
	id_message: {
		type: DataTypes.BIGINT,
		allowNull: false
	},
	id_user: {
		type: DataTypes.BIGINT,
		allowNull: false
	},
	liked_at: {
		type: DataTypes.STRING
	}
}, {
	timestamps: false,
	freezeTableName: true
});

Message.hasMany(MessageLike, {
	foreignKey: "id_message",
	sourceKey: "id"
});

MessageLike.belongsTo(Message, {
	foreignKey: "id_message",
	targetKey: "id"
});

module.exports = {MessageLike}
