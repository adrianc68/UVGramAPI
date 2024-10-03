const {sequelize} = require("../database/connectionDatabaseSequelize");
const {DataTypes} = require("sequelize");
const {User} = require("./User");

const Chat = sequelize.define("Chat", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	uuid: {
		type: DataTypes.STRING,
		allowNull: false
	},
	id_user1: {
		type: DataTypes.BIGINT,
		allowNull: false
	},
	id_user2: {
		type: DataTypes.BIGINT,
		allowNull: false
	},
	created_at: {
		type: DataTypes.STRING
	}
}, {
	timestamps: false,
	freezeTableName: true
});

Chat.belongsTo(User, {
	foreignKey: "id_user1",
	targetKey: "id",
	as: "initiator"
});

Chat.belongsTo(User, {
	foreignKey: "id_user2",
	targetKey: "id",
	as: "receiver"
});


module.exports = {Chat}

