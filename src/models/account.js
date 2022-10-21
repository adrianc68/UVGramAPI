const { sequelize } = require("../database/connectionDatabaseSequelize");
const { DataTypes } = require("sequelize");
const { User } = require("./User");

const Account = sequelize.define("Cuenta", {
    correo: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    contraseña: {
        type: DataTypes.STRING
    },
    id_usuario: {
        type: DataTypes.BIGINT
    }
}, {
    timestamps: false,
    freezeTableName: true
});

Account.hasOne(User, {
    foreignKey: "id",
    sourceKey: "id_usuario",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

User.belongsTo(Account, {
    foreignKey: "id",
    targetKey: "id_usuario"
});

module.exports = {Account};