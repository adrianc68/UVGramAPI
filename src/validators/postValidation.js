const { getPostByUUID, isPostLikedByUser, getIdPostByPostUUID, isUserOwnerOfPost } = require("../dataaccess/postDataAccess");
const { verifyToken } = require("../dataaccess/tokenDataAccess");
const { httpResponseInternalServerError, httpResponseForbidden } = require("../helpers/httpResponses");
const MessageType = require("../types/MessageType");

const validationDoesExistPostUUID = async (request, response, next) => {
    let uuid = request.params.uuid;
    if (!uuid) uuid = request.body.uuid;
    try {
        let postData = await getPostByUUID(uuid);
        if (!postData) {
            return httpResponseForbidden(response, "no post found");
        }
        let ownerResource = postData.id_user;
        response.locals.ownerResourceUserId = ownerResource;
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return next();
};

const validationIsPostAlreadyLikedByUser = async (request, response, next) => {
    const token = (request.headers.authorization).split(" ")[1];
    const { uuid } = request.body;
    let isAlreadyLikedByUser;
    try {
        const userDataId = await verifyToken(token).then(data => { return data.id });
        const postDataId = await getIdPostByPostUUID(uuid);
        isAlreadyLikedByUser = await isPostLikedByUser(userDataId, postDataId);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    if (isAlreadyLikedByUser) {
				let message = {boolValue: false, ...MessageType.USER.POST_ALREADY_LIKED}
        return httpResponseForbidden(response, message);
    }
    return next();
};

const validationIsPostAlreadyDislikedByUser = async (request, response, next) => {
    const token = (request.headers.authorization).split(" ")[1];
    const { uuid } = request.body;
    let isAlreadyDisliked;
    try {
        const userDataId = await verifyToken(token).then(data => { return data.id });
        const postDataId = await getIdPostByPostUUID(uuid);
        isAlreadyDisliked = await isPostLikedByUser(userDataId, postDataId);
        isAlreadyDisliked = !isAlreadyDisliked;
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    if (isAlreadyDisliked) {
				let message = {boolValue: false, ...MessageType.USER.POST_ALREADY_DISLIKED}
        return httpResponseForbidden(response, message);
    }
    return next();
};

const validationIsUserOwnerOfPost = async (request, response, next) => {
    const token = (request.headers.authorization).split(" ")[1];
    const { uuid } = request.body;
    try {
        const userDataId = await verifyToken(token).then(data => { return data.id });
        const postDataId = await getIdPostByPostUUID(uuid);
        let IsUserOwnerOfPost = await isUserOwnerOfPost(userDataId, postDataId);
        if (!IsUserOwnerOfPost) {
            return httpResponseForbidden(response, "you can not delete posts from other users");
        }
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return next();
};

module.exports = {
    validationDoesExistPostUUID, validationIsPostAlreadyLikedByUser,
    validationIsPostAlreadyDislikedByUser, validationIsUserOwnerOfPost
};
