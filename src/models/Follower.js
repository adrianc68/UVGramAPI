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

Follower.belongsTo(User, {
    as: "follower",
    foreignKey: "id_user_follower",
    sourceKey: "id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

Follower.belongsTo(User, {
    as: "followed",
    foreignKey: "id_user_followed",
    sourceKey: "id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

User.hasOne(Follower, {
    as: "follower",
    foreignKey: "id_user_follower",
    targetKey: "id"
});

User.hasOne(Follower, {
    as: "followed",
    foreignKey: "id_user_followed",
    targetKey: "id"
})

module.exports = { Follower };