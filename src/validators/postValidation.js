const { getPostByUUID, isPostLikedByUser, getIdPostByPostUUID } = require("../dataaccess/postDataAccess");
const { verifyToken } = require("../dataaccess/tokenDataAccess");
const { httpResponseInternalServerError, httpResponseForbidden } = require("../helpers/httpResponses");

const validationDoesExistPostUUID = async (request, response, next) => {
    let uuid = request.params.uuid;
    if (!uuid) uuid = request.body.uuid;
    try {
        let postData = await getPostByUUID(uuid);
        if (!postData) {
            return httpResponseForbidden(response, "no post found");
        }
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return next();
}

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
        return httpResponseForbidden(response, "post is already liked");
    }
    return next();
}

const validationIsPostAlreadyDislikedByUser = async (request, response, next) => {
    const token = (request.headers.authorization).split(" ")[1];
    const { uuid } = request.body;
    let isAlreadyUnlikedByUser;
    try {
        const userDataId = await verifyToken(token).then(data => { return data.id });
        const postDataId = await getIdPostByPostUUID(uuid);
        isAlreadyUnlikedByUser = !(await isPostLikedByUser(userDataId, postDataId));
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    if (isAlreadyUnlikedByUser) {
        return httpResponseForbidden(response, "post is already disliked");
    }
    return next();
}

module.exports = { validationDoesExistPostUUID, validationIsPostAlreadyLikedByUser, validationIsPostAlreadyDislikedByUser };