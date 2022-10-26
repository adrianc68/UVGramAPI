const { sequelize } = require("../database/connectionDatabaseSequelize");
const { DataTypes } = require("sequelize");
const { User } = require("./User");

const UserRole = sequelize.define("RolUsuario", {
    fecha_nacimiento: {
        type: DataTypes.DATE,
        primaryKey: true
    },
    id_usuario: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    nombre_completo: {
        type: DataTypes.STRING,
        allowNull: true
    },
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