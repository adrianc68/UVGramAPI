const { sequelize } = require("../database/connectionDatabaseSequelize");
const { DataTypes } = require("sequelize");
const { UserRole } = require("./UserRole");

const BusinessUserRole = sequelize.define("Empresarial", {
    categoria: {
        type: DataTypes.ENUM("BLOG_PERSONAL", "PRODUCTO_O_SERVICIO", "ARTE", "MUSICO_O_BANDA", "COMPRAS_VENTAS_MINORISTAS", "SALUD_BELLEZA", "TIENDAS_COMESTIBLES")
    },
    ciudad: {
        type: DataTypes.STRING
    },
    codigo_postal: {
        type: DataTypes.STRING
    },
    direccion_postal: {
        type: DataTypes.STRING
    },
    correo_contacto: {
        type: DataTypes.STRING
    },
    telefono_contacto: {
        type: DataTypes.STRING
    },
    nombre_completo: {
        type: DataTypes.STRING
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

BusinessUserRole.hasOne(UserRole, {
    foreignKey: "id_usuario",
    sourceKey: "id_usuario",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

UserRole.belongsTo(BusinessUserRole, {
    foreignKey: "id_usuario",
    targetKey: "id_usuario"
});

module.exports = { BusinessUserRole };