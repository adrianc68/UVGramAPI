const { sequelize } = require("../database/connectionDatabaseSequelize");
const { DataTypes } = require("sequelize");

const VerificationCode = sequelize.define("VerificationCode", {
    verification_code: {
        type: DataTypes.STRING
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = { VerificationCode };