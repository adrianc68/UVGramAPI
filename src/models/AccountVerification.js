const { sequelize } = require("../database/connectionDatabaseSequelize");
const { DataTypes } = require("sequelize");
const { Account } = require("./Account");

const AccountVerification = sequelize.define("VerificacionCuenta", {
    estado_cuenta: {
        type: DataTypes.ENUM("BLOQUEADO", "NO_BLOQUEADO")
    },
    id_usuario: {
        type: DataTypes.BIGINT
    }
}, {
    timestamps: false,
    freezeTableName: true
});

AccountVerification.removeAttribute("id");

AccountVerification.hasOne(Account, {
    foreignKey: "id_usuario",
    sourceKey: "id_usuario",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

Account.belongsTo(AccountVerification, {
    foreignKey: "id_usuario",
    targetKey: "id_usuario"
});

module.exports = { AccountVerification };