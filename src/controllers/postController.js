const { getAllCommentsByIdPost, getCommentsCountById } = require("../dataaccess/commentDataAccess");
const { getAllPostFromUserId, createPostByUserId, getPostByUUID, getIdPostByPostUUID, likePostByIds, dislikePostByIds, getPostLikesById, getUsersWhoLikePostById } = require("../dataaccess/postDataAccess");
const { verifyToken } = require("../dataaccess/tokenDataAccess");
const { getAccountLoginData, isUserFollowedByUser } = require("../dataaccess/userDataAccess");
const { httpResponseInternalServerError, httpResponseOk, httpResponseForbidden } = require("../helpers/httpResponses");
const { logger } = require("../helpers/logger");

const getPostsByUsername = async (request, response) => {
    const username = request.params.username;
    let posts = [];
    try {
        let userData = await getAccountLoginData(username);
        posts = await getAllPostFromUserId(userData.id);
        await Promise.all(posts.map(async function (post) {
            let postId = await getIdPostByPostUUID(post.uuid);
            if (!postId) {
                post.comments = 0;
                return;
            }
            post.comments = await getCommentsCountById(postId);
        }));
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, posts);
};

const getPostDataByUUID = async (request, response) => {
    const uuid = request.params.uuid;
    let postDetails = null;
    try {
        let postData = await getPostByUUID(uuid);
        let postID = await getIdPostByPostUUID(uuid);
        let commentData = await getAllCommentsByIdPost(postID);
        let countLikes = await getPostLikesById(postID);
        postDetails = {
            post: postData,
            likes: countLikes,
            comments: commentData
        }
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, postDetails);
}

const createPost = async (request, response) => {
    const { description, commentsAllowed, likesAllowed } = request.body;
    const file = request.file;
    const token = (request.headers.authorization).split(" ")[1];
    let isCreated = false;
    let postInfo;
    try {
        const userDataId = await verifyToken(token).then(data => { return data.id });
        let postDataCreated = await createPostByUserId(userDataId, description, commentsAllowed, likesAllowed, file);
        if (postDataCreated != null) {
            postInfo = postDataCreated;
            isCreated = true;
        }
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, { isCreated, postInfo });
};

const likePost = async (request, response) => {
    const token = (request.headers.authorization).split(" ")[1];
    const { uuid } = request.body;
    let isLiked = false;
    try {
        const userDataId = await verifyToken(token).then(data => { return data.id });
        const postDataId = await getIdPostByPostUUID(uuid);
        isLiked = await likePostByIds(userDataId, postDataId);

    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, isLiked);
};

const dislikePost = async (request, response) => {
    const token = (request.headers.authorization).split(" ")[1];
    const { uuid } = request.body;
    let isUnliked = false;
    try {
        const userDataId = await verifyToken(token).then(data => { return data.id });
        const postDataId = await getIdPostByPostUUID(uuid);
        isUnliked = await dislikePostByIds(userDataId, postDataId);

    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, isUnliked);
}

const getUsersWhoLikesPost = async (request, response) => {
    const token = (request.headers.authorization).split(" ")[1];
    const uuid = request.params.uuid;
    let likedBy = [];
    try {
        const userDataId = await verifyToken(token).then(data => { return data.id });
        const postDataId = await getIdPostByPostUUID(uuid);
        usersResult = await getUsersWhoLikePostById(postDataId);
        await Promise.all(usersResult.map(async function (data) {
            try {
                data.isFollowed = await isUserFollowedByUser(userDataId, data.id);
                delete data["id"];
                delete data["presentation"];
            } catch (error) {
                throw error;
            }
        }));
        likedBy = usersResult;
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, { likedBy });
}

module.exports = {
    getPostsByUsername, createPost, getPostDataByUUID,
    likePost, dislikePost, getUsersWhoLikesPost
}