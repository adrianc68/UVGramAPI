const {INTERNAL_SERVER_ERROR, OK} = require("../../services/httpResponsesService");
const {createCommentInPost, getAllCommentsByIdPost, getIdCommentByUUID, likeCommentByIds, dislikeCommentByIds, getUsersWhoLikeCommentById, getCommentByUUID, deleteCommentById, createAnswerComment, getCommentParentById} = require("../../dataaccess/commentDataAccess");
const {getIdPostByPostUUID} = require("../../dataaccess/postDataAccess");
const {verifyToken} = require("../../dataaccess/tokenDataAccess");
const {isUserFollowedByUser} = require("../../dataaccess/userDataAccess");
const MessageType = require("../../types/MessageType");
const {apiVersionType} = require("../../types/apiVersionType");
const {createURLResource} = require("../../dataaccess/urlRecoverDataAccess");

const createCommentPost = async (request, response) => {
	const token = (request.headers.authorization).split(" ")[1];
	const {comment, uuid} = request.body;
	let isCreated = false;
	let commentDetails;
	try {
		const userDataId = await verifyToken(token).then(data => {return data.id});
		let postDataId = await getIdPostByPostUUID(uuid);
		commentDetails = await createCommentInPost(comment, postDataId, userDataId);
		if (commentDetails) {
			isCreated = true;
		}
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	let message = {boolValue: isCreated, ...MessageType.USER.DATA_CREATED, commentDetails: commentDetails};
	return OK(response, message, apiVersionType.V1);
};

const createAnswerToComment = async (request, response) => {
	const token = (request.headers.authorization).split(" ")[1];
	const {comment, uuid} = request.body;
	let commentDetails;
	let isCreated;
	try {
		const userDataId = await verifyToken(token).then(data => {return data.id});
		const commentReplyId = await getIdCommentByUUID(uuid);
		let commentRootParentData = await getCommentParentById(commentReplyId);
		commentDetails = await createAnswerComment(commentRootParentData.id, comment, commentRootParentData.id_post, userDataId);
		commentDetails.isReplyInnerComment = commentRootParentData.isParent;
		commentDetails.rootCommentUUID = commentRootParentData.uuid;
		if (commentDetails) {
			isCreated = true;
		}
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	let message = {boolValue: isCreated, ...MessageType.USER.DATA_CREATED, commentDetails}
	return OK(response, message, apiVersionType.V1);
};

const getAllCommentsOfUUIDPost = async (request, response) => {
	const uuid = request.params.uuid;
	let comments = [];
	try {
		let postDataId = await getIdPostByPostUUID(uuid);
		comments = await getAllCommentsByIdPost(postDataId);
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	return OK(response, comments, apiVersionType.V1);
};

const likeComment = async (request, response) => {
	const token = (request.headers.authorization).split(" ")[1];
	const {uuid} = request.body;
	let isLiked = false;
	try {
		const userDataId = await verifyToken(token).then(data => {return data.id});
		const commentId = await getIdCommentByUUID(uuid);
		isLiked = await likeCommentByIds(userDataId, commentId);
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	let message = {boolValue: isLiked, ...MessageType.USER.DATA_UPDATED}
	return OK(response, message, apiVersionType.V1);
};

const dislikeComment = async (request, response) => {
	const token = (request.headers.authorization).split(" ")[1];
	const {uuid} = request.body;
	let isDisliked = false;
	try {
		const userDataId = await verifyToken(token).then(data => {return data.id});
		const commentId = await getIdCommentByUUID(uuid);
		isDisliked = await dislikeCommentByIds(userDataId, commentId);
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	let message = {boolValue: isDisliked, ...MessageType.USER.DATA_UPDATED}
	return OK(response, message, apiVersionType.V1);
};

const getUsersWhoLikesComment = async (request, response) => {
	const token = (request.headers.authorization).split(" ")[1];
	const uuid = request.params.uuid;
	let likedBy = [];
	try {
		const userDataId = await verifyToken(token).then(data => {return data.id});
		const commetId = await getIdCommentByUUID(uuid);
		let usersResult = await getUsersWhoLikeCommentById(commetId);
		await Promise.all(usersResult.map(async function (data) {
			try {
				data.isFollowed = await isUserFollowedByUser(userDataId, data.id);
				data.url = await createURLResource(data.filepath);
				delete data["filepath"];
				delete data["id"];
				delete data["presentation"]
			} catch (error) {
				throw error;
			}
		}));
		likedBy = usersResult;
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	return OK(response, {likedBy}, apiVersionType.V1);
}

const deleteComment = async (request, response) => {
	const {uuid} = request.body;
	let isDeleted = false;
	try {
		const commentData = await getCommentByUUID(uuid);
		isDeleted = await deleteCommentById(commentData.id);
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	return OK(response, isDeleted, apiVersionType.V1);
}

module.exports = {
	createCommentPost, getAllCommentsOfUUIDPost, likeComment,
	dislikeComment, getUsersWhoLikesComment, deleteComment,
	createAnswerToComment
}
