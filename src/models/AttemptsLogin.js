const { sequelize } = require("../database/connectionDatabaseSequelize");
const { DataTypes } = require("sequelize");

const AttemptsLogin = sequelize.define("IntentoInicioSesion", {
    intentos_realizados: {
        type: DataTypes.STRING
    },
    estado_sesion: {
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

module.exports = { AttemptsLogin };