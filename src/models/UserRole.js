const { sequelize } = require("../database/connectionDatabaseSequelize");
const { DataTypes } = require("sequelize");
const { User } = require("./User");

const UserRole = sequelize.define("UserRole", {
    id_user: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
    },
    role: {
        type: DataTypes.ENUM("PERSONAL", "EMPRESARIAL", "MODERADOR", "ADMINISTRADOR")
    }
}, {
    timestamps: false,
    freezeTableName: true
});

UserRole.hasOne(User, {
    foreignKey: "id",
    sourceKey: "id_user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

User.belongsTo(UserRole, {
    foreignKey: "id",
    targetKey: "id_user",
});

module.exports = { UserRole };