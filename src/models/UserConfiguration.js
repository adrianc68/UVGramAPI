const { sequelize } = require("../database/connectionDatabaseSequelize");
const { DataTypes } = require("sequelize");
const { User } = require("./User");

const UserConfiguration = sequelize.define("ConfiguracionUsuario", {
    tipo_privacidad: {
        type: DataTypes.ENUM("PUBLICO", "PRIVADO")
    },
    id_usuario: {
        type: DataTypes.STRING
    }
}, {
    timestamps: false,
    freezeTableName: true
});

UserConfiguration.removeAttribute("id");

UserConfiguration.hasOne(User, {
    foreignKey: "id",
    sourceKey: "id_usuario",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

User.belongsTo(UserConfiguration, {
    foreignKey: "id",
    targetKey: "id_usuario"
});

module.exports = { UserConfiguration };