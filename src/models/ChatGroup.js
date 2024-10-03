const {sequelize} = require("../database/connectionDatabaseSequelize");
const {DataTypes} = require("sequelize");

const ChatGroup = sequelize.define("ChatGroup", {
	id: {
		type: DataTypes.BIGINT,
		primaryKey: true,
		autoIncrement: true
	},
	name: {
		type: DataTypes.STRING,
	},
	uuid: {
		type: DataTypes.STRING,
		allowNull: false
	},
	created_time: {
		type: DataTypes.STRING,
	},
	id_administrator: {
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

module.exports = {ChatGroup}
