const { verifyToken } = require("../dataaccess/tokenDataAccess");
const { isUserFollowedByUser, getIdByUsername, isUserBlockedByUser, isUsernameRegistered } = require("../dataaccess/userDataAccess");
const { httpResponseInternalServerError, httpResponseForbidden } = require("../helpers/httpResponses");

const isUserAlreadyFollowedByUser = async (idUserFollower, idUserFollowed) => {
    let isFollowed = false;
    try {
        isFollowed = await isUserFollowedByUser(idUserFollower, idUserFollowed);
    } catch (error) {
        throw new Error(error);
    }
    return isFollowed;
}

const isUserAlreadyBlockedByUser = async (idUserBlocker, idUserBlocked) => {
    let isBlocked = false;
    try {
        isBlocked = await isUserBlockedByUser(idUserBlocker, idUserBlocked);
    } catch (error) {
        throw new Error(error);
    }
    return isBlocked;
}

const validationRejectOnUsernameNotRegistered = async (request, response, next) => {
    let { username } = request.body;
    if (!username) username = request.params.username;
    try {
        let isRegistered = await isUsernameRegistered(username);;
        if (!isRegistered) {
            return httpResponseForbidden(response, "username does not exist");
        }
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return next();
}

const validationFollowingUser = async (request, response, next) => {
    const token = (request.headers.authorization).split(" ")[1];
    let idUserFollowed;
    let idUserFollower;
    let { username } = request.body;
    try {
        idUserFollower = await verifyToken(token).then(data => { return data.id });
        idUserFollowed = await getIdByUsername(username).then(id => { return id });
        if (idUserFollowed == idUserFollower) {
            return httpResponseForbidden(response, "user can not follow himself");
        }
        isAlreadyFollowed = await isUserAlreadyFollowedByUser(idUserFollower, idUserFollowed);
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
        idUserFollower = await verifyToken(token).then(data => { return data.id });
        idUserFollowed = await getIdByUsername(username).then(id => { return id });
        if (idUserFollowed == idUserFollower) {
            return httpResponseForbidden(response, "user can not unfollow himself");
        }
        isAlreadyUnfollowed = !(await isUserAlreadyFollowedByUser(idUserFollower, idUserFollowed));
        if (isAlreadyUnfollowed) {
            return httpResponseForbidden(response, "user is already unfollowed");
        }
    } catch (error) {
        return httpResponseInternalServerError(error);
    }
    return next();
}

const validationBlockingUser = async (request, response, next) => {
    const token = (request.headers.authorization).split(" ")[1];
    let idUserBlocked;
    let idUserBlocker;
    let { username } = request.body;
    try {
        idUserBlocker = await verifyToken(token).then(data => { return data.id });
        idUserBlocked = await getIdByUsername(username).then(id => { return id });
        if (idUserBlocked == idUserBlocker) {
            return httpResponseForbidden(response, "user can not block himself");
        }
        isAlreadyBlocked = await isUserAlreadyBlockedByUser(idUserBlocker, idUserBlocked);
        if (isAlreadyBlocked) {
            return httpResponseForbidden(response, "user is already blocked");
        }
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return next();
}

const validationUnblockingUser = async (request, response, next) => {
    const token = (request.headers.authorization).split(" ")[1];
    let idUserBlocked;
    let idUserBlocker;
    let { username } = request.body;
    try {
        idUserBlocker = await verifyToken(token).then(data => { return data.id });
        idUserBlocked = await getIdByUsername(username).then(id => { return id });
        if (idUserBlocked == idUserBlocker) {
            return httpResponseForbidden(response, "user can not unblock himself");
        }
        isAlreadyBlocked = !(await isUserAlreadyBlockedByUser(idUserBlocker, idUserBlocked));
        if (isAlreadyBlocked) {
            return httpResponseForbidden(response, "user is already unblocked");
        }
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return next();
}

module.exports = {
    validationFollowingUser, validationUnfollowingUser, validationBlockingUser,
    validationUnblockingUser, validationRejectOnUsernameNotRegistered
}