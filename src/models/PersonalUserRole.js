const { sequelize } = require("../database/connectionDatabaseSequelize");
const { DataTypes } = require("sequelize");
const { UserRole } = require("./UserRole");

const PersonalUserRole = sequelize.define("Personal", {
    faculty: {
        type: DataTypes.STRING
    },
    career: {
        type: DataTypes.STRING
    },
    gender: {
        type: DataTypes.ENUM("MASCULINO", "FEMENINO", "INDIFERENTE")
    },
    id_user: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
    }
}, {
    timestamps: false,
    freezeTableName: true
});

PersonalUserRole.hasOne(UserRole, {
    foreignKey: "id_user",
    sourceKey: "id_user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

UserRole.belongsTo(PersonalUserRole, {
    foreignKey: "id_user",
    targetKey: "id_user"
});

module.exports = { PersonalUserRole };