const {sequelize} = require("../database/connectionDatabaseSequelize");
const {DataTypes} = require("sequelize");
const {User} = require("./User");
const {ChatGroup} = require("./ChatGroup");

const ChatGroupMembership = sequelize.define("ChatGroupMembership", {
	id_user: {
		type: DataTypes.BIGINT,
		allowNull: false
	},
	id_chatgroup: {
		type: DataTypes.BIGINT,
		allowNull: false
	},
	added_at: {
		type: DataTypes.STRING
	}
}, {
	timestamps: false,
	freezeTableName: true
});

ChatGroupMembership.belongsTo(User, {
	foreignKey: "id_user",
	targetKey: "id"
});

User.hasOne(ChatGroupMembership, {
	foreignKey: "id_user",
	sourceKey: "id"
});

ChatGroup.hasOne(ChatGroupMembership, {
	foreignKey: "id_chatgroup",
	sourceKey: "id"
});

ChatGroupMembership.belongsTo(ChatGroup, {
	foreignKey: "id_chatgroup",
	targetKey: "id"
});


module.exports = {ChatGroupMembership}
