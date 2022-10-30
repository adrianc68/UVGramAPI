const { sequelize } = require("../database/connectionDatabaseSequelize");
const { DataTypes } = require("sequelize");
const { UserRole } = require("./UserRole");

const AdministratorUserRole = sequelize.define("Administrador", {
    fecha_creacion: {
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

AdministratorUserRole.hasOne(UserRole, {
    foreignKey: "id_usuario",
    sourceKey: "id_usuario",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

UserRole.belongsTo(AdministratorUserRole, {
    foreignKey: "id_usuario",
    targetKey: "id_usuario"
});

module.exports = { AdministratorUserRole };