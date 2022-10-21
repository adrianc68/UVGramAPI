const { sequelize } = require("../database/connectionDatabaseSequelize");
const { DataTypes } = require("sequelize");

const User = sequelize.define("Usuario", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING
    },
    presentacion: {
        type: DataTypes.STRING
    },
    usuario: {
        type: DataTypes.STRING
    }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = {User};