const { sequelize } = require("../database/connectionDatabaseSequelize");
const { DataTypes } = require("sequelize");
const { Comment } = require("./Comment");

const NestedComment = sequelize.define("NestedComment", {
    parent_id_comment: {
        type: DataTypes.STRING,
    },
    child_id_comment: {
        type: DataTypes.STRING
    },
}, {
    timestamps: false,
    freezeTableName: true
});

NestedComment.removeAttribute("id");

Comment.hasMany(NestedComment, {
    foreignKey: "child_id_comment",
    sourceKey: "id",
});

NestedComment.belongsTo(Comment, {
    foreignKey: "child_id_comment",
    targetKey: "id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

Comment.hasOne(NestedComment, {
    foreignKey: "parent_id_comment",
    targetKey: "id"
});

NestedComment.belongsTo(Comment, {
    foreignKey: "parent_id_comment",
    targetKey: "id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
})

module.exports = { NestedComment };