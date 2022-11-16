const { verifyToken } = require("../dataaccess/tokenDataAccess");
const { isUsernameRegistered, isUserFollowedByUser, getIdByUsername } = require("../dataaccess/userDataAccess");
const { httpResponseInternalServerError, httpResponseOk, httpResponseForbidden } = require("../helpers/httpResponses");

const doesUsernameIsRegistered = async (username) => {
    let isRegistered = false;
    try {
        isRegistered = await isUsernameRegistered(username);
    } catch (error) {
        throw new Error(error);
    }
    return isRegistered;
}

const isFollowerFollowingUser = async (idUserFollower, idUserFollowed) => {
    let isFollowed = false;
    try {
        isFollowed = await isUserFollowedByUser(idUserFollower, idUserFollowed);
    } catch (error) {
        throw new Error(error);
    }
    return isFollowed;
}

const validationFollowingUser = async (request, response, next) => {
    const token = (request.headers.authorization).split(" ")[1];
    let idUserFollowed;
    let idUserFollower;

    let { username } = request.body;
    try {
        let isUsernameRegistered = await doesUsernameIsRegistered(username);
        if (!isUsernameRegistered) {
            return httpResponseForbidden(response, "username is not registered");
        }
        idUserFollower = await verifyToken(token).then(data => { return data.id });
        idUserFollowed = await getIdByUsername(username).then(id => { return id });
        if (idUserFollowed == idUserFollower) {
            return httpResponseForbidden(response, "user can not follow himself");
        }
        isAlreadyFollowed = await isFollowerFollowingUser(idUserFollower, idUserFollowed);
        if (isAlreadyFollowed) {
            return httpResponseForbidden(response, "user is already followed");
        }
    } catch (error) {
        return httpResponseInternalServerError(error);
    }
    return next();
}

const validationUnfollowingUser = async (request, response, next) => {
    const token = (request.headers.authorization).split(" ")[1];
    let idUserFollowed;
    let idUserFollower;

    let { username } = request.body;
    try {
        let isUsernameRegistered = await doesUsernameIsRegistered(username);
        if (!isUsernameRegistered) {
            return httpResponseForbidden(response, "username is not registered");
        }
        idUserFollower = await verifyToken(token).then(data => { return data.id });
        idUserFollowed = await getIdByUsername(username).then(id => { return id });
        if (idUserFollowed == idUserFollower) {
            return httpResponseForbidden(response, "user can not unfollow himself");
        }
        isAlreadyUnfollowed = !(await isFollowerFollowingUser(idUserFollower, idUserFollowed));
        if (isAlreadyUnfollowed) {
            return httpResponseForbidden(response, "user is already unfollowed");
        }
    } catch (error) {
        return httpResponseInternalServerError(error);
    }
    return next();
}

module.exports = { validationFollowingUser, validationUnfollowingUser }