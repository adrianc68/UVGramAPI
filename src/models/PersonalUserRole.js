const { sequelize } = require("../database/connectionDatabaseSequelize");
const { DataTypes } = require("sequelize");
const { UserRole } = require("./UserRole");

const PersonalUserRole = sequelize.define("Personal", {
    facultad: {
        type: DataTypes.STRING
    },
    programa_educativo: {
        type: DataTypes.STRING
    },
    sexo: {
        type: DataTypes.ENUM("MASCULINO", "FEMENINO", "INDIFERENTE")
    },
    id_usuario: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
    }
}, {
    timestamps: false,
    freezeTableName: true
});

PersonalUserRole.hasOne(UserRole, {
    foreignKey: "id_usuario",
    sourceKey: "id_usuario",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

UserRole.belongsTo(PersonalUserRole, {
    foreignKey: "id_usuario",
    targetKey: "id_usuario"
});

module.exports = { PersonalUserRole };