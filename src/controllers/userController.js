const { deleteAllCommentsOfUserFromAllUserPost, deleteAllUserLikesFromUserComments, getCommentsCountById } = require("../dataaccess/commentDataAccess");
const { getAllPostFromUserId, deleteAllLikesOfUserFromAllPost, getIdPostByPostUUID } = require("../dataaccess/postDataAccess");
const { followUser: followUserUserDataAccess, getIdByUsername, unfollowUser: unfollowUserUserDataAccess, getFollowedByUser: getFollowedUsersOfUserUserDataAccess, getFollowersOfUser: getFollowersOfUserUserDataAccess, getUserProfile: getUserProfileUserDataAccess
    , blockUser: blockUserUserDataAccess, unblockUser: unblockUserUserDataAccess, deleteFollowerAndFollowing, isUserBlockedByUser } = require("../dataaccess/userDataAccess");
const { httpResponseOk, httpResponseInternalServerError, httpResponseForbidden } = require("../helpers/httpResponses");
const { logger } = require("../helpers/logger");
const { verifyToken } = require("../helpers/token");

const followUser = async (request, response) => {
    const token = (request.headers.authorization).split(" ")[1];
    let { username } = request.body;
    const idUserFollowed = await getIdByUsername(username).then(id => { return id });
    const idUserFollower = await verifyToken(token).then(data => { return data.id });
    let message;
    try {
        message = await followUserUserDataAccess(idUserFollower, idUserFollowed);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, `you are now following to ${username}`);
}

const unfollowUser = async (request, response) => {
    const token = (request.headers.authorization).split(" ")[1];
    let { username } = request.body;
    const idUserFollowed = await getIdByUsername(username).then(id => { return id });
    const idUserFollower = await verifyToken(token).then(data => { return data.id });
    let message;
    try {
        message = await unfollowUserUserDataAccess(idUserFollower, idUserFollowed);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, `you have unfollowed to ${username}`);
}

const getFollowedByUser = async (request, response) => {
    let username = request.params.username;
    const idUser = await getIdByUsername(username).then(id => { return id });
    let message;
    try {
        message = await getFollowedUsersOfUserUserDataAccess(idUser);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, message);
}

const getFollowersOfUser = async (request, response) => {
    let username = request.params.username;
    const idUser = await getIdByUsername(username).then(id => { return id });
    let message;
    try {
        message = await getFollowersOfUserUserDataAccess(idUser);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, message);
}

const getProfileOfUser = async (request, response) => {
    let username = request.params.username;
    let user;
    try {
        const idUser = await getIdByUsername(username).then(id => { return id });
        // Methods separated because findAll only returns first element on inner array
        // find with include and raw support:
        // https://github.com/sequelize/sequelize/issues/3885 #3885 <--- Issue
        user = await getUserProfileUserDataAccess(idUser);
        user.followers = (await getFollowedUsersOfUserUserDataAccess(idUser)).length;
        user.followed = (await getFollowersOfUserUserDataAccess(idUser)).length;
        user.posts = await getAllPostFromUserId(idUser);

        await Promise.all(user.posts.map(async function (post) {
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
    return httpResponseOk(response, user);
}

const blockUser = async (request, response) => {
    const token = (request.headers.authorization).split(" ")[1];
    let { username } = request.body;
    const idUserToBlock = await getIdByUsername(username).then(id => { return id });
    const idUserBlocker = await verifyToken(token).then(data => { return data.id });
    try {
        let resultBlock = await blockUserUserDataAccess(idUserBlocker, idUserToBlock);
        let resultRemoveFollower = await deleteFollowerAndFollowing(idUserBlocker, idUserToBlock);
        let resultRemoveComments = await deleteAllCommentsOfUserFromAllUserPost(idUserToBlock, idUserBlocker);
        let resultRemovePostLikes = await deleteAllLikesOfUserFromAllPost(idUserToBlock, idUserBlocker);
        let resultRemoveCommentLikes = await deleteAllUserLikesFromUserComments(idUserToBlock, idUserBlocker);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, `you have blocked to ${username}`);
}

const unblockUser = async (request, response) => {
    const token = (request.headers.authorization).split(" ")[1];
    let { username } = request.body;
    const idUserToUnblock = await getIdByUsername(username).then(id => { return id });
    const idUserBlocker = await verifyToken(token).then(data => { return data.id });
    let message;
    try {
        message = await unblockUserUserDataAccess(idUserBlocker, idUserToUnblock);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, `you have unblocked to ${username}`);
}

module.exports = {
    followUser, unfollowUser, getFollowedByUser,
    getFollowersOfUser, getProfileOfUser, blockUser,
    unblockUser
}