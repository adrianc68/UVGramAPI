const { sequelize } = require("../database/connectionDatabaseSequelize");
const { DataTypes } = require("sequelize");
const { UserRole } = require("./UserRole");

const BusinessUserRole = sequelize.define("Business", {
    category: {
        type: DataTypes.ENUM("BLOG_PERSONAL", "PRODUCTO_O_SERVICIO", "ARTE", "MUSICO_O_BANDA", "COMPRAS_VENTAS_MINORISTAS", "SALUD_BELLEZA", "TIENDAS_COMESTIBLES")
    },
    city: {
        type: DataTypes.STRING
    },
    postal_code: {
        type: DataTypes.STRING
    },
    postal_address: {
        type: DataTypes.STRING
    },
    contact_email: {
        type: DataTypes.STRING
    },
    phone_contact: {
        type: DataTypes.STRING
    },
    organization_name: {
        type: DataTypes.STRING
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

BusinessUserRole.hasOne(UserRole, {
    foreignKey: "id_user",
    sourceKey: "id_user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

UserRole.belongsTo(BusinessUserRole, {
    foreignKey: "id_user",
    targetKey: "id_user"
});

module.exports = { BusinessUserRole };