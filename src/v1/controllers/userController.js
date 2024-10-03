const MessageType = require("../../types/MessageType");
const {deleteAllCommentsOfUserFromAllUserPost, deleteAllUserLikesFromUserComments, getCommentsCountById} = require("../../dataaccess/commentDataAccess");
const {getAllPostFromUserId, deleteAllLikesOfUserFromAllPost, getIdPostByPostUUID, getPostFilenamesById, countPost, getPostFilenameById} = require("../../dataaccess/postDataAccess");
const {followUser: followUserUserDataAccess, getIdByUsername, unfollowUser: unfollowUserUserDataAccess, getFollowedByUser: getFollowedUsersOfUserUserDataAccess, getFollowersOfUser: getFollowersOfUserUserDataAccess, getUserProfile: getUserProfileUserDataAccess
	, blockUser: blockUserUserDataAccess, unblockUser: unblockUserUserDataAccess, deleteFollowerAndFollowing, getActualPrivacyType, sendRequestFollowToUser, getAllFollowerRequestByUserId, getAllBlockedUsers, isUserFollowedByUser, isRequestFollowerSent, isUserBlockingToUser, getAllUsersByFilter} = require("../../dataaccess/userDataAccess");
const {logger} = require("../../helpers/logger");
const {verifyToken} = require("../../helpers/token");
const {PrivacyType} = require("../../models/enum/PrivacyType");
const {OK, INTERNAL_SERVER_ERROR, CONFLICT} = require("../../services/httpResponsesService");
const {apiVersionType} = require("../../types/apiVersionType");
const UserErrorException = require("../../types/exception/UserErrorException");
const {createURLResource} = require("../../dataaccess/urlRecoverDataAccess");

const followUser = async (request, response) => {
	const token = (request.headers.authorization).split(" ")[1];
	let {username} = request.body;
	const idUserFollowed = await getIdByUsername(username).then(id => {return id});
	const idUserFollower = await verifyToken(token).then(data => {return data.id});
	let message;
	try {
		let userStateType = await getActualPrivacyType(idUserFollowed);
		if (userStateType == PrivacyType.PRIVATE) {
			let resultData = await sendRequestFollowToUser(idUserFollower, idUserFollowed);
			if (resultData) {
				message = MessageType.USER.FOLLOWER_REQUEST_SENT_TO;
				message.message.replace("$", username);

			} else {
				message = MessageType.USER.CANNOT_SEND_FOLLOWER_REQUEST_TO;
				message.message.replace("$", username);
			}
		} else {
			let resultData = await followUserUserDataAccess(idUserFollower, idUserFollowed);
			if (resultData) {
				message = MessageType.USER.FOLLOWING_TO;
				message.message.replace("$", username);
			} else {
				message = MessageType.USER.UNABLE_TO_FOLLOW_TO;
				message.message.replace("$", username);
			}
		}
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	message = {...message, boolValue: true};
	return OK(response, message, apiVersionType.V1);
};

const unfollowUser = async (request, response) => {
	const token = (request.headers.authorization).split(" ")[1];
	let {username} = request.body;
	const idUserFollowed = await getIdByUsername(username).then(id => {return id});
	const idUserFollower = await verifyToken(token).then(data => {return data.id});
	let message;
	try {
		message = await unfollowUserUserDataAccess(idUserFollower, idUserFollowed);
		if (message) {
			message = MessageType.USER.UNFOLLOWED_TO;
			message.message.replace("$", username);
		}
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	message = {...message, boolValue: true};
	return OK(response, message, apiVersionType.V1);
};

const deleteFollower = async (request, response) => {
	const token = (request.headers.authorization).split(" ")[1];
	let {username} = request.body;
	const idUserFollower = await getIdByUsername(username).then(id => {return id});
	const userDataId = await verifyToken(token).then(data => {return data.id});
	let message;
	try {
		message = await unfollowUserUserDataAccess(idUserFollower, userDataId);
		if (message) {
			message = MessageType.USER.DELETED_TO.replace("$", username);
		}
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	return OK(response, message, apiVersionType.V1);
};

const getFollowedByUser = async (request, response) => {
	let username = request.params.username;
	const idUser = await getIdByUsername(username).then(id => {return id});
	let users = [];
	try {
		users = await getFollowedUsersOfUserUserDataAccess(idUser);
		await Promise.all(users.map(async function (user) {
			user.url = await createURLResource(user.filepath);
			delete user["filepath"];
		}));
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	let message = {...MessageType.USER.OK, users: users};
	return OK(response, message, apiVersionType.V1);
};

const getFollowersOfUser = async (request, response) => {
	let username = request.params.username;
	const idUser = await getIdByUsername(username).then(id => {return id});
	let users = [];
	try {
		users = await getFollowersOfUserUserDataAccess(idUser);
		await Promise.all(users.map(async function (user) {
			user.url = await createURLResource(user.filepath);
			delete user["filepath"];
		}));
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	let message = {...MessageType.USER.OK, users: users};
	return OK(response, message, apiVersionType.V1);
};

const getProfileOfUser = async (request, response) => {
	let username = request.params.username;
	let user;
	let idUser;
	try {
		idUser = await getIdByUsername(username).then(id => {return id});
		user = await getUserProfileUserDataAccess(idUser)
		await Promise.all([
			getFollowedUsersOfUserUserDataAccess(idUser).then(value => user.followed = value.length),
			getFollowersOfUserUserDataAccess(idUser).then(value => user.followers = value.length),
			getActualPrivacyType(idUser).then(value => user.privacyType = value),
			countPost(idUser).then(value => user.postsCreated = value),
			createURLResource(user.filepath).then(value => {
				delete user["filepath"];
				user.url = value;
			})
		]);
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	let accessToken = request.headers.authorization;
	let userLoggedId;
	if (accessToken != null) {
		try {
			userLoggedId = await verifyToken(accessToken.split(" ")[1]).then(data => {return data.id});
			await Promise.all([
				isUserFollowedByUser(userLoggedId, idUser).then(value => user.isFollowed = value),
				isRequestFollowerSent(idUser, userLoggedId).then(value => user.hasSubmittedFollowerRequest = value),
				isRequestFollowerSent(userLoggedId, idUser).then(value => user.isFollowerRequestSent = value),
				isUserBlockingToUser(userLoggedId, idUser).then(value => user.isBlocked = value),
				isUserBlockingToUser(idUser, userLoggedId).then(value => user.isBlocker = value),
				isUserFollowedByUser(idUser, userLoggedId).then(value => user.isFollower = value)
			]);
		} catch (error) {
			// Probably has any bug or maybe we need something more to do here
			logger.info(error);
		}
	}

	try {
		if (!user.isBlocked) {
			if (PrivacyType.PUBLIC === user.privacyType || user.isFollowed || idUser == userLoggedId) {
				user.posts = await getAllPostFromUserId(idUser);
				await Promise.all(user.posts.map(async post => {
					await Promise.all([
						getCommentsCountById(post.id).then(value => post.comments = value),
						getPostFilenameById(post.id).then(value => post.files = value)
					])
					delete post["id_user"];
					delete post["id"];
				}));
			}
		} else {
			user.followers = 0;
			user.followed = 0;
			user.postsCreated = 0;
		}
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	return OK(response, user, apiVersionType.V1);
};

const blockUser = async (request, response) => {
	const token = (request.headers.authorization).split(" ")[1];
	let {username} = request.body;
	const idUserToBlock = await getIdByUsername(username).then(id => {return id});
	const idUserBlocker = await verifyToken(token).then(data => {return data.id});
	try {
		await blockUserUserDataAccess(idUserBlocker, idUserToBlock);
		await deleteFollowerAndFollowing(idUserBlocker, idUserToBlock);
		await deleteAllCommentsOfUserFromAllUserPost(idUserToBlock, idUserBlocker);
		await deleteAllLikesOfUserFromAllPost(idUserToBlock, idUserBlocker);
		await deleteAllUserLikesFromUserComments(idUserToBlock, idUserBlocker);
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	let message = {boolValue: true, ...MessageType.USER.BLOCKED_TO}
	return OK(response, message, apiVersionType.V1);
};

const unblockUser = async (request, response) => {
	const token = (request.headers.authorization).split(" ")[1];
	let {username} = request.body;
	const idUserToUnblock = await getIdByUsername(username).then(id => {return id});
	const idUserBlocker = await verifyToken(token).then(data => {return data.id});
	let message;
	try {
		message = await unblockUserUserDataAccess(idUserBlocker, idUserToUnblock);
		if (!message) {
			throw new UserErrorException(MessageType.USER.CANNOT);
		}
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	let payload = {boolValue: true, ...message}
	return OK(response, payload, apiVersionType.V1);
};

const getPendingFollowRequest = async (request, response) => {
	const token = (request.headers.authorization).split(" ")[1];
	let followersRequest = []
	try {
		const userDataId = await verifyToken(token).then(data => {return data.id});
		followersRequest = await getAllFollowerRequestByUserId(userDataId);
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	return OK(response, followersRequest, apiVersionType.V1);
};

const getBlockedUsers = async (request, response) => {
	const token = (request.headers.authorization).split(" ")[1];
	let blocked = [];
	try {
		const userDataId = await verifyToken(token).then(data => {return data.id});
		blocked = await getAllBlockedUsers(userDataId);
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	return OK(response, blocked, apiVersionType.V1);
};

const checkIfUserLoggedIsBlockedByUser = async (request, response) => {
	const token = (request.headers.authorization).split(" ")[1];
	let username = request.params.username;
	let isBlocked = false;
	let isBlocker = false;
	try {
		const userDataId = await verifyToken(token).then(data => {return data.id});
		const idUserBlocker = await getIdByUsername(username).then(id => {return id});
		isBlocked = await isUserBlockingToUser(idUserBlocker, userDataId);
		isBlocker = await isUserBlockingToUser(userDataId, idUserBlocker);
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	let message = MessageType.USER.USER_IS_NOT_BLOCKING_YOU;
	if (isBlocker) {
		message = {boolValue: isBlocker, ...MessageType.USER.USER_HAS_BLOCKED_YOU}
	}
	if (isBlocked) {
		message = {boolValue: isBlocked, ...MessageType.USER.USER_BLOCKED}
	}
	return OK(response, message, apiVersionType.V1);
};

const findByFilter = async (request, response) => {
	const filter = request.params.filter;
	let users = [];
	try {
		users = await getAllUsersByFilter(filter)
			.then(async usersData => {
				await Promise.all(usersData.map(async user => {
					return createURLResource(user.filepath)
						.then(urlResult => {
							user.url = urlResult;
							delete user["filepath"];
						});
				}));
				return usersData;
			})

	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	let messageTypes = (users) ? MessageType.USER.USERS_FOUND : MessageType.USER.NOT_FOUND;
	let message = {...messageTypes, users: users};
	return OK(response, message, apiVersionType.V1);
};

module.exports = {
	followUser, unfollowUser, getFollowedByUser,
	getFollowersOfUser, getProfileOfUser, blockUser,
	unblockUser, getPendingFollowRequest, deleteFollower,
	getBlockedUsers, checkIfUserLoggedIsBlockedByUser,
	findByFilter
}
