const { sequelize } = require("../database/connectionDatabaseSequelize");
const { DataTypes } = require("sequelize");
const { Account } = require("./Account");

const AccountVerification = sequelize.define("VerificacionCuenta", {
    codigo_verificacion: {
        type: DataTypes.STRING
    },
    intentos_realizados: {
        type: DataTypes.INTEGER
    },
    estado_cuenta: {
        type: DataTypes.ENUM("BLOQUEADO", "NO_BLOQUEADO")
    },
    correo_cuenta: {
        type: DataTypes.STRING,
    }
}, {
    timestamps: false,
    freezeTableName: true
});

AccountVerification.removeAttribute("id");

AccountVerification.hasOne(Account, {
    foreignKey: "correo",
    sourceKey: "correo_cuenta",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

Account.belongsTo(AccountVerification, {
    foreignKey: "correo",
    targetKey: "correo_cuenta"
});

module.exports = {AccountVerification};