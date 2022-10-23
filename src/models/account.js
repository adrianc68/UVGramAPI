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
        type: DataTypes.BIGINT,
        allowNull: false
    }
}, {
    timestamps: false,
    freezeTableName: true
});

Account.hasOne(User, {
    foreignKey: "id",
    sourceKey: "id_usuario",
    onDelete: "CASCADE",
});

User.belongsTo(Account, {
    foreignKey: "id",
    targetKey: "id_usuario", 
});

module.exports = {Account};