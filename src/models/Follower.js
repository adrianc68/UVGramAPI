const { sequelize } = require("../database/connectionDatabaseSequelize");
const { DataTypes } = require("sequelize");
const { User } = require("./User");

const Follower = sequelize.define("Follower", {
    id_user_follower: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    id_user_followed: {
        type: DataTypes.BIGINT,
        allowNull: false,
    }
}, {
    timestamps: false,
    freezeTableName: true
});

Follower.removeAttribute("id");

Follower.hasOne(User, {
    foreignKey: "id",
    sourceKey: "id_user_follower",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

Follower.hasOne(User, {
    foreignKey: "id",
    sourceKey: "id_user_followed",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

User.belongsTo(Follower, {
    foreignKey: "id",
    targetKey: "id_user_followed"
});

User.belongsTo(Follower, {
    foreignKey: "id",
    targetKey: "id_user_follower"
});


module.exports = { Follower };