const { Sequelize } = require("sequelize");
const { sequelize } = require("../database/connectionDatabaseSequelize");
const { generateRandomUUID } = require("../helpers/generateCode");
const { logger } = require("../helpers/logger");
const { Post } = require("../models/Post");
const { PostLike } = require("../models/PostLike");
const { User } = require("../models/User");

/**
 * Get all posts created by user id
 * @param {*} id_user id of user
 * @returns [...] array with elements or empty array []
 */
const getAllPostFromUserId = async (id_user) => {
    let posts = [];
    try {
        posts = await Post.findAll({
            where: { id_user },
            attributes: {
                include: [[Sequelize.fn('COUNT', Sequelize.col("id_post")), 'likes']],
                exclude: ["id", "id_user"]
            },
            include: [{
                model: PostLike,
                attributes: []
            }],
            group: ["filepath", "description", "comments_allowed", "likes_allowed", "uuid", "Post.id"],
            raw: true,
        });
    } catch (error) {
        throw error;
    }
    return posts;
};

/**
 * Get only Post data model filepath, description, comments_allowed, likes_allowed, uuid and id
 * @param {*} uuid the post identifier
 * @returns post or undefined.
 */
const getPostByUUID = async (uuid) => {
    let post;
    try {
        post = await Post.findOne({
            where: { uuid },
            attributes: ["filepath", "description", "comments_allowed", "likes_allowed", "uuid"],
            raw: true
        });
    } catch (error) {
        throw error;
    }
    return post;
};

/**
 * Get all post data by id
 * @param {*} id the post id
 * @returns all data or undefined
 */
const getPostById = async (id) => {
    let post;
    try {
        post = await Post.findOne({
            where: { id },
            raw: true
        });
    } catch (error) {
        throw error;
    }
    return post;
}

/**
 * Get ID of post by uuid
 * @param {*} uuid the post identifier
 * @returns id or undefined
 */
const getIdPostByPostUUID = async (uuid) => {
    let id;
    try {
        let postData = await Post.findOne({
            where: { uuid },
            attributes: ["id"],
            raw: true
        });
        if (postData != null) {
            id = postData.id;
        }
    } catch (error) {
        throw error;
    }
    return id;
}

/**
 * Create a new post by user id
 * @param {*} id_user the user id who is creating the new post
 * @param {*} description post description
 * @param {*} comments_allowed boolean
 * @param {*} likes_allowed boolean
 * @param {*} file the file which is saving
 * @returns postData or null
 */
const createPostByUserId = async (id_user, description, comments_allowed, likes_allowed, file) => {
    let postData = null;
    const uuid = generateRandomUUID(11);
    let fileType = file.mimetype.replace(/(image\/|video\/)/g, '');
    let filepath = `/media/users/${id_user}/${uuid}.${fileType}`;
    const t = await sequelize.transaction();
    try {
        postData = await Post.create({
            filepath,
            description,
            comments_allowed,
            likes_allowed,
            id_user,
            uuid
        }, { transaction: t })
        await t.commit();
    } catch (error) {
        await t.rollback();
        throw error;
    }
    return postData;
};

/**
 * Like a post
 * @param {*} id_user the user who is liking the post
 * @param {*} id_post the post which is being liked.
 * @returns true if liked otherwise false
 */
const likePostByIds = async (id_user, id_post) => {
    let isLiked = false;
    const t = await sequelize.transaction();
    try {
        let result = await PostLike.create({
            id_user,
            id_post
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
}

/**
 * Dislike a post
 * @param {*} id_user the user who liked the post
 * @param {*} id_post the post which was liked by user
 * @returns true if remove liked otherwise false
 */
const dislikePostByIds = async (id_user, id_post) => {
    let isDisliked = false;
    const t = await sequelize.transaction();
    try {
        let result = await PostLike.destroy({
            where: {
                id_user,
                id_post
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
 * Check if post is alredy liked by user
 * @param {*} id_user the user id
 * @param {*} id_post the post id
 * @returns true if user already liked the post
 */
const isPostLikedByUser = async (id_user, id_post) => {
    let isAlreadyLikedByUser = false;
    try {
        let result = await PostLike.findOne({
            where: { id_post, id_user },
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

/**
 * Get post count likes
 * @param {*} id_post the post id to get count likes
 * @returns likes number or 0
 */
const getPostLikesById = async (id_post) => {
    let count = 0;
    try {
        count = await PostLike.count({
            where: { id_post }
        })
    } catch (error) {
        throw error;
    }
    return count;
}

/**
 * Get users who liked a Post using id
 * @param {*} id_post the post to get likes
 * @returns [users] or [] (empty array)
 */
const getUsersWhoLikePostById = async (id_post) => {
    let users = [];
    try {
        users = await PostLike.findAll({
            where: { id_post },
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

module.exports = {
    getAllPostFromUserId, createPostByUserId, getPostByUUID,
    getIdPostByPostUUID, likePostByIds, isPostLikedByUser,
    dislikePostByIds, getPostLikesById, getUsersWhoLikePostById,
    getPostById

}