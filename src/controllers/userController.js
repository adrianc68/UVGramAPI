const { followUser: followUserUserDataAccess, getIdByUsername, unfollowUser: unfollowUserUserDataAccess, getFollowedUsersOfUser: getFollowedUsersOfUserUserDataAccess, getFollowersOfUser: getFollowersOfUserUserDataAccess } = require("../dataaccess/userDataAccess");
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

const getFollowedUsersOfUser = async (request, response) => {
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


module.exports = { followUser, unfollowUser, getFollowedUsersOfUser, getFollowersOfUser }