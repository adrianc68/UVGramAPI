const {sequelize} = require("../database/connectionDatabaseSequelize");
const {DataTypes} = require("sequelize");
const {Message} = require("./Message");

const MessageFile = sequelize.define("MessageFile", {
	id_message: {
		type: DataTypes.BIGINT,
		allowNull: false
	},
	filepath: {
		type: DataTypes.STRING
	}
}, {
	timestamps: false,
	freezeTableName: true
});


Message.hasOne(MessageFile, {
	foreignKey: "id_message",
	sourceKey: "id"
});

MessageFile.belongsTo(Message, {
	foreignKey: "id_message",
	targetKey: "id"
});

module.exports = {MessageFile};
