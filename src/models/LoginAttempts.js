const { sequelize } = require("../database/connectionDatabaseSequelize");
const { DataTypes } = require("sequelize");

const LoginAttempts = sequelize.define("LoginAttempts", {
    attempts: {
        type: DataTypes.STRING
    },
    session_state: {
        type: DataTypes.ENUM("BLOQUEADO", "NO_BLOQUEADO"),
        allowNull: false,
        primaryKey: true
    },
    mac_address: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = { LoginAttempts };