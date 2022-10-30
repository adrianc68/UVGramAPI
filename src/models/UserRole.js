const { sequelize } = require("../database/connectionDatabaseSequelize");
const { DataTypes } = require("sequelize");
const { User } = require("./User");

const UserRole = sequelize.define("RolUsuario", {
    id_usuario: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
    },
    rol_usuario: {
        type: DataTypes.ENUM("PERSONAL", "EMPRESARIAL", "MODERADOR", "ADMINISTRADOR")
    }
}, {
    timestamps: false,
    freezeTableName: true
});

UserRole.hasOne(User, {
    foreignKey: "id",
    sourceKey: "id_usuario",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

User.belongsTo(UserRole, {
    foreignKey: "id",
    targetKey: "id_usuario",
});

module.exports = { UserRole };