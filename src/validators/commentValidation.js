const { getCommentByUUID, getIdCommentByUUID, isCommentLikedByUser } = require("../dataaccess/commentDataAccess");
const { verifyToken } = require("../dataaccess/tokenDataAccess");
const { httpResponseForbidden, httpResponseInternalServerError } = require("../helpers/httpResponses");

const validationDoesExistCommentUUID = async (request, response, next) => {
    let uuid = request.params.uuid;
    if (!uuid) uuid = request.body.uuid;
    try {
        let commentData = await getCommentByUUID(uuid);
        if (!commentData) {
            return httpResponseForbidden(response, "no comment found");
        }
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return next();
};

const validationIsCommentAlreadyLikedByUser = async (request, response, next) => {
    const token = (request.headers.authorization).split(" ")[1];
    const { uuid } = request.body;
    let isAlreadyLikedByUser;
    try {
        const userDataId = await verifyToken(token).then(data => { return data.id });
        const commentDataId = await getIdCommentByUUID(uuid);
        isAlreadyLikedByUser = await isCommentLikedByUser(userDataId, commentDataId);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    if (isAlreadyLikedByUser) {
        return httpResponseForbidden(response, "comment is already liked");
    }
    return next();
};

const validationIsCommentAlreadyDislikedByUser = async (request, response, next) => {
    const token = (request.headers.authorization).split(" ")[1];
    const { uuid } = request.body;
    let isAlreadydislikedByUser;
    try {
        const userDataId = await verifyToken(token).then(data => { return data.id });
        const commentDataId = await getIdCommentByUUID(uuid);
        isAlreadydislikedByUser = !(await isCommentLikedByUser(userDataId, commentDataId));
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    if (isAlreadydislikedByUser) {
        return httpResponseForbidden(response, "comment is already disliked");
    }
    return next();
}

module.exports = {
    validationDoesExistCommentUUID, validationIsCommentAlreadyLikedByUser, validationIsCommentAlreadyDislikedByUser
}