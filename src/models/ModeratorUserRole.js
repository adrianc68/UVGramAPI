const { sequelize } = require("../database/connectionDatabaseSequelize");
const { DataTypes } = require("sequelize");
const { UserRole } = require("./UserRole");

const ModeratorUserRole = sequelize.define("Moderador", {
    fecha_cambio: {
        type: DataTypes.DATE
    },
    id_usuario: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
    }
}, {
    timestamps: false,
    freezeTableName: true
});

ModeratorUserRole.hasOne(UserRole, {
    foreignKey: "id_usuario",
    sourceKey: "id_usuario",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

UserRole.belongsTo(ModeratorUserRole, {
    foreignKey: "id_usuario",
    targetKey: "id_usuario"
});

module.exports = { ModeratorUserRole };