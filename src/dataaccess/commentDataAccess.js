const { Sequelize } = require("sequelize");
const { sequelize } = require("../database/connectionDatabaseSequelize");
const { generateRandomUUID } = require("../helpers/generateCode");
const { Comment } = require("../models/Comment");
const { CommentLike } = require("../models/CommentLike");
const { User } = require("../models/User");

/**
 * Create a new comment in a post
 * @param {*} comment data
 * @param {*} id_post the post id which will be commented
 * @param {*} id_user the user who is commenting.
 * @returns object with data or undefined
 */
const createCommentInPost = async (comment, id_post, id_user) => {
    let result;
    const t = await sequelize.transaction();
    try {
        let uuid = generateRandomUUID(11);
        object = await Comment.create({
            comment,
            id_post,
            id_user,
            uuid
        }, { transaction: t })
        await t.commit();
        result = {
            commet: object.comment,
            uuid: object.uuid,
            created_time: object.created_time
        }
    } catch (error) {
        await t.rollback();
        throw error;
    }
    return result;
};

/**
 * Get all comments of post
 * @param {*} id_post the post to get the comments.
 * @returns [data] or [] with 0 elements. */
const getAllCommentsByIdPost = async (id_post) => {
    let posts = [];
    try {
        posts = await Comment.findAll({
            where: { id_post },
            attributes: {
                include: ["comment", "created_time", "uuid", "User.username",
                    [Sequelize.fn('COUNT', Sequelize.col("id_comment")), 'likes']
                ],
                exclude: ["id", "id_post", "id_user"]
            },
            include: [{
                model: User,
                attributes: [],
            }, {
                model: CommentLike,
                attributes: []
            }
            ],
            group: ["comment", "created_time", "uuid", "username"],
            raw: true,
        });
    } catch (error) {
        throw error;
    }
    return posts;
}

/**
 * Like a comment by IDS
 * @param {*} id_user the user who is liking a comment.
 * @param {*} id_comment the comment that is being liked 
 * @returns true if comment was liked otherwise false
 */
const likeCommentByIds = async (id_user, id_comment) => {
    let isLiked = false;
    const t = await sequelize.transaction();
    try {
        let result = await CommentLike.create({
            id_user,
            id_comment
        }, {
            transaction: t
        });
        await t.commit();
        isLiked = true;
    } catch (error) {
        await t.rollback();
        throw error;
    }
    return isLiked;
};

/**
 * Dislike a comment by IDS
 * @param {*} id_user the user who is disliking a comment
 * @param {*} id_comment the comment that is being disliked
 * @returns true if comment was disliked otherwise false
 */
const dislikeCommentByIds = async (id_user, id_comment) => {
    let isDisliked = false;
    const t = await sequelize.transaction();
    try {
        let result = await CommentLike.destroy({
            where: {
                id_user,
                id_comment
            }
        }, {
            transaction: t
        });
        await t.commit();
        isDisliked = true;
    } catch (error) {
        await t.rollback();
        throw error;
    }
    return isDisliked;
}

/**
 * Get comment ID by UUID identifier
 * @param {*} uuid the uuuid identifier
 * @returns id or undefined
 */
const getIdCommentByUUID = async (uuid) => {
    let id;
    try {
        let commentData = await Comment.findOne({
            where: { uuid },
            attributes: ["id"],
            raw: true
        });
        if (commentData != null) {
            id = commentData.id;
        }
    } catch (error) {
        throw error;
    }
    return id;
};

/**
 * Get comment by UUID
 * @param {*} uuid the uuid identifier
 * @returns all comment data or undefined
 */
const getCommentByUUID = async (uuid) => {
    let comment;
    try {
        comment = await Comment.findOne({
            where: { uuid },
            raw: true
        });
    } catch (error) {
        throw error;
    }
    return comment;
}

/**
 * Check if comment is already liked by user
 * @param {*} id_user the user who liked a comment
 * @param {*} id_comment the comment that is liked
 * @returns true if liked otherwise false.
 */
const isCommentLikedByUser = async (id_user, id_comment) => {
    let isAlreadyLikedByUser = false;
    try {
        let result = await CommentLike.findOne({
            where: { id_comment, id_user },
            raw: true
        });
        if (result != null) {
            isAlreadyLikedByUser = true;
        }
    } catch (error) {
        throw error;
    }
    return isAlreadyLikedByUser;
}


const getCommentsLikesById = async (id_comment) => {
    let count = 0;
    try {
        count = await CommentLike.count({
            where: { id_comment }
        })
    } catch (error) {
        throw error;
    }
    return count;
}

/**
 * Get the users who like a specific comment
 * @param {*} id_comment the specific comment
 * @returns [users] or [] (empty array).
 */
const getUsersWhoLikeCommentById = async (id_comment) => {
    let users = [];
    try {
        users = await CommentLike.findAll({
            where: { id_comment },
            attributes: ["User.*"],
            include: {
                model: User,
                attributes: []
            },
            raw: true,
        });
    } catch (error) {
        throw error;
    }
    return users;
}

/**
 * Delete a comment by id
 * @param {*} id the comment id
 * @returns true if removed otherwise false
 */
const deleteCommentById = async (id) => {
    let isDeleted = false;
    const t = await sequelize.transaction();
    try {
        let data = await Comment.destroy({
            where: { id },
            transaction: t
        });
        await t.commit();
        if (data > 0) {
            isDeleted = true;
        }
    } catch (error) {
        throw error;
    }
    return isDeleted;
}


module.exports = {
    createCommentInPost, getAllCommentsByIdPost, likeCommentByIds,
    dislikeCommentByIds, getIdCommentByUUID, getCommentByUUID,
    isCommentLikedByUser, getUsersWhoLikeCommentById, getCommentsLikesById,
    deleteCommentById
}