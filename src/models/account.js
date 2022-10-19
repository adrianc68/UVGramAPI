const { sequelize } = require("../database/connectionDatabaseSequelize");
const { DataTypes } = require("sequelize");
const { Users } = require("./User");

const Account = sequelize.define("Cuenta", {
    correo: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    contraseña: {
        type: DataTypes.STRING
    },
    id: {
        type: DataTypes.BIGINT
    }
}, {
    timestamps: false,
    freezeTableName: true
});

Account.hasOne(Users, {
    foreignKey: "id",
    sourceKey: "id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

Users.belongsTo(Account, {
    foreignKey: "id",
    targetKey: "id"
});

module.exports = {Account};