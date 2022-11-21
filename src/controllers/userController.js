const { followUser: followUserUserDataAccess, getIdByUsername, unfollowUser: unfollowUserUserDataAccess, getFollowedByUser: getFollowedUsersOfUserUserDataAccess, getFollowersOfUser: getFollowersOfUserUserDataAccess, getUserProfile: getUserProfileUserDataAccess
    , blockUser: blockUserUserDataAccess, unblockUser: unblockUserUserDataAccess } = require("../dataaccess/userDataAccess");
const { httpResponseOk, httpResponseInternalServerError } = require("../helpers/httpResponses");
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
    return httpResponseOk(response, `user is now following to ${username}`);
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
    return httpResponseOk(response, `user has unfollow to ${username}`);
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
    let message;
    try {
        message = await blockUserUserDataAccess(idUserBlocker, idUserToBlock);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, `user has blocked to ${username}`);
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
    return httpResponseOk(response, `user has unblocked to ${username}`);
}



module.exports = { followUser, unfollowUser, getFollowedByUser, getFollowersOfUser, getProfileOfUser, blockUser, unblockUser }