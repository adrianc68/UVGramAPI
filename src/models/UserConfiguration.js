const { sequelize } = require("../database/connectionDatabaseSequelize");
const { DataTypes } = require("sequelize");
const { User } = require("./User");
const { PrivacyType } = require("./enum/PrivacyType");

const UserConfiguration = sequelize.define("UserConfiguration", {
    privacy: {
        type: DataTypes.ENUM(PrivacyType.PUBLIC, PrivacyType.PRIVATE)
    },
    id_user: {
        type: DataTypes.STRING
    }
}, {
    timestamps: false,
    freezeTableName: true
});

UserConfiguration.removeAttribute("id");

UserConfiguration.hasOne(User, {
    foreignKey: "id",
    sourceKey: "id_user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

User.belongsTo(UserConfiguration, {
    foreignKey: "id",
    targetKey: "id_user"
});

module.exports = { UserConfiguration };