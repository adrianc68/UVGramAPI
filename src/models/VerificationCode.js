const { sequelize } = require("../database/connectionDatabaseSequelize");
const { DataTypes } = require("sequelize");

const VerificationCode = sequelize.define("VerificacionCodigo", {
    codigo_verificacion: {
        type: DataTypes.STRING
    },
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = { VerificationCode };