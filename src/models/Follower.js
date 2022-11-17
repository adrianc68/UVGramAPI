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
    },
}, {
    timestamps: false,
    freezeTableName: true
});

Follower.removeAttribute("id");

Follower.hasMany(User, {
    as: "followed",
    foreignKey: "id",
    sourceKey: "id_user_followed"
});

User.belongsTo(Follower, {
    as: "followed",
    foreignKey: "id",
    targetKey: "id_user_followed"
});

Follower.belongsTo(User, {
    as: "follower",
    foreignKey: "id_user_follower",
    targetKey: "id"
});

User.hasMany(Follower, {
    as: "follower",
    foreignKey: "id_user_follower",
    sourceKey: "id"
});

module.exports = { Follower };