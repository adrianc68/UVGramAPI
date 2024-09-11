const {INTERNAL_SERVER_ERROR, OK, UNAVAILABLE} = require("../../services/httpResponsesService");
const {getAllCommentsByIdPost, getCommentsCountById, isCommentLikedByUser} = require("../../dataaccess/commentDataAccess");
const {getAllPostFromUserId, createPostByUserId, getPostByUUID, getIdPostByPostUUID, likePostByIds, dislikePostByIds, getPostLikesById, getUsersWhoLikePostById, getPostFilenamesById, isPostLikedByUser, deletePost} = require("../../dataaccess/postDataAccess");
const {verifyToken} = require("../../dataaccess/tokenDataAccess");
const {getAccountLoginData, isUserFollowedByUser, getUserProfile} = require("../../dataaccess/userDataAccess");
const {apiVersionType} = require("../../types/apiVersionType");
const {uploadPostFiles} = require("../../dataaccess/storageDataAccess");
const File = require("../../models/File");
const MessageType = require("../../types/MessageType");
const {createURLResource} = require("../../dataaccess/urlRecoverDataAccess");

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
			post.isLiked = await isPostLikedByUser(userData.id, postId);
			post.files = await getPostFilenamesById(post.id);
			delete post["id_user"];
			delete post["id"];
		}));
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	return OK(response, posts, apiVersionType.V1);
};

const getPostDataByUUID = async (request, response) => {
	const uuid = request.params.uuid;
	let postDetails = null;
	const token = (request.headers.authorization).split(" ")[1];
	try {
		const userDataId = await verifyToken(token).then(data => {return data.id});
		let postData = await getPostByUUID(uuid);
		postData.isLiked = await isPostLikedByUser(userDataId, postData.id);
		let commentData = await getAllCommentsByIdPost(postData.id);


		await Promise.all(commentData.map(async function (comment) {
			comment.isLiked = await isCommentLikedByUser(userDataId, comment.id);
			comment.url = await createURLResource(comment.filepath);
			await Promise.all(comment.replies.map(async function (reply) {
				reply.url = await createURLResource(reply.filepath);
				reply.isLiked = await isCommentLikedByUser(userDataId, reply.id);
				delete reply["id"];
				delete reply["filepath"];
			}));
			delete comment["filepath"];
			delete comment["id"];
		}));

		let ownerOfPost = await getUserProfile(postData.id_user);
		ownerOfPost.url = await createURLResource(ownerOfPost.filepath);
		delete ownerOfPost["filepath"];
		delete ownerOfPost["presentation"];
		let countLikes = await getPostLikesById(postData.id);
		let files = await getPostFilenamesById(postData.id);
		delete postData["id_user"];
		delete postData["id"];
		postDetails = {
			post: postData,
			likes: countLikes,
			comments: commentData,
			files: files,
			owner: ownerOfPost
		}
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	return OK(response, postDetails, apiVersionType.V1);
}

const createPost = async (request, response) => {
	const {description, commentsAllowed, likesAllowed} = request.body;
	const files = [].concat(request.files["files[]"]);
	const token = (request.headers.authorization).split(" ")[1];
	let isCreated = false;
	let postInfo;
	try {
		const userDataId = await verifyToken(token).then(data => data.id);
		let filepaths = await uploadPostFiles(files, userDataId, "1");
		let postDataCreated = await createPostByUserId(userDataId, description, commentsAllowed, likesAllowed, filepaths);
		if (!postDataCreated) {
			return UNAVAILABLE(response, apiVersionType.V1);
		}
		postInfo = postDataCreated;
		delete postInfo["id"];
		delete postInfo["id_user"];
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	return OK(response, {isCreated, ...MessageType.USER.DATA_CREATED, postInfo}, apiVersionType.V1);
};

const likePost = async (request, response) => {
	const token = (request.headers.authorization).split(" ")[1];
	const {uuid} = request.body;
	let isLiked = false;
	try {
		const userDataId = await verifyToken(token).then(data => {return data.id});
		const postDataId = await getIdPostByPostUUID(uuid);
		isLiked = await likePostByIds(userDataId, postDataId);

	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	let message = {boolValue: isLiked, ...MessageType.USER.DATA_UPDATED}
	return OK(response, message, apiVersionType.V1);
};

const dislikePost = async (request, response) => {
	const token = (request.headers.authorization).split(" ")[1];
	const {uuid} = request.body;
	let isUnliked = false;
	try {
		const userDataId = await verifyToken(token).then(data => {return data.id});
		const postDataId = await getIdPostByPostUUID(uuid);
		isUnliked = await dislikePostByIds(userDataId, postDataId);

	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	let message = {boolValue: isUnliked, ...MessageType.USER.DATA_UPDATED}
	return OK(response, message, apiVersionType.V1);
};

const getUsersWhoLikesPost = async (request, response) => {
	const token = (request.headers.authorization).split(" ")[1];
	const uuid = request.params.uuid;
	let likedBy = [];
	try {
		const userDataId = await verifyToken(token).then(data => {return data.id});
		const postDataId = await getIdPostByPostUUID(uuid);
		let usersResult = await getUsersWhoLikePostById(postDataId);
		await Promise.all(usersResult.map(async function (data) {
			try {
				data.isFollowed = await isUserFollowedByUser(userDataId, data.id);
				data.url = await createURLResource(data.filepath);
				delete data["filepath"];
				delete data["id"];
				delete data["presentation"];
			} catch (error) {
				throw error;
			}
		}));
		likedBy = usersResult;
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	return OK(response, {likedBy}, apiVersionType.V1);
};

const deletePostOfUser = async (request, response) => {
	const token = (request.headers.authorization).split(" ")[1];
	const uuid = request.body.uuid;
	let isRemoved = false;
	try {
		const userDataId = await verifyToken(token).then(data => {return data.id});
		const postDataId = await getIdPostByPostUUID(uuid);
		isRemoved = await deletePost(userDataId, postDataId);
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	return OK(response, {isRemoved}, apiVersionType.V1);
};

module.exports = {
	getPostsByUsername, createPost, getPostDataByUUID,
	likePost, dislikePost, getUsersWhoLikesPost, deletePostOfUser
}
