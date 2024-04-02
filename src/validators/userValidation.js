const {verifyToken} = require("../dataaccess/tokenDataAccess");
const {isUserFollowedByUser, getIdByUsername, isUserBlockingToUser, isUsernameRegistered, getActualPrivacyType, isRequestFollowerSent} = require("../dataaccess/userDataAccess");
const {PrivacyType} = require("../models/enum/PrivacyType");
const {NOT_FOUND, BAD_REQUEST, CONFLICT} = require("../services/httpResponsesService");
const {apiVersionType} = require("../types/apiVersionType");
const MessageType = require("../types/MessageType");

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
		isBlocked = await isUserBlockingToUser(idUserBlocker, idUserBlocked);
	} catch (error) {
		throw new Error(error);
	}
	return isBlocked;
}

const validationRejectOnUsernameNotRegistered = async (request, response, next) => {
	let {username} = request.body;
	if (!username) username = request.params.username;
	try {
		let isRegistered = await isUsernameRegistered(username);
		if (!isRegistered) {
			return NOT_FOUND(response, MessageType.USER.USERNAME_NOT_FOUND, apiVersionType.V1);
		}
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	return next();
}

const validationFollowingUser = async (request, response, next) => {
	const token = (request.headers.authorization).split(" ")[1];
	let idUserFollowed;
	let idUserFollower;
	let {username} = request.body;
	try {
		idUserFollower = await verifyToken(token).then(data => {return data.id});
		idUserFollowed = await getIdByUsername(username).then(id => {return id});
		if (idUserFollowed == idUserFollower) {
			return BAD_REQUEST(response, MessageType.USER.CANNOT_FOLLOW_YOURSELF);
		}
		let isAlreadyFollowed = await isUserAlreadyFollowedByUser(idUserFollower, idUserFollowed);
		if (isAlreadyFollowed) {
			return CONFLICT(response, MessageType.USER.USER_IS_ALREADY_FOLLOWED);
		}
		let isFolloweRequestSent = await isRequestFollowerSent(idUserFollower, idUserFollowed);
		if (isFolloweRequestSent) {
			return CONFLICT(response, MessageType.USER.FOLLOWER_REQUEST_ALREADY_SENT, apiVersionType.V1);
		}
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	return next();
}

const validationUnfollowingUser = async (request, response, next) => {
	const token = (request.headers.authorization).split(" ")[1];
	let idUserFollowed;
	let idUserFollower;
	let {username} = request.body;
	try {
		idUserFollower = await verifyToken(token).then(data => {return data.id});
		idUserFollowed = await getIdByUsername(username).then(id => {return id});
		if (idUserFollowed == idUserFollower) {
			return CONFLICT(response, MessageType.USER.CANNOT_UNFOLLOW_YOURSELF, apiVersionType.V1);
		}
		let isRequestFollowerNotSent = !(await isRequestFollowerSent(idUserFollower, idUserFollowed));
		let isAlreadyUnfollowed = !(await isUserAlreadyFollowedByUser(idUserFollower, idUserFollowed));
		if (isAlreadyUnfollowed && isRequestFollowerNotSent) {
			return CONFLICT(response, MessageType.USER.USER_IS_ALREADY_UNFOLLOWED, apiVersionType.V1);
		}
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	return next();
}

const validationRemoveUserFromFollowers = async (request, response, next) => {
	const token = (request.headers.authorization).split(" ")[1];
	let {username} = request.body;
	try {
		let idUserFollowed = await verifyToken(token).then(data => {return data.id});
		let idUserFollower = await getIdByUsername(username).then(id => {return id});
		if (idUserFollowed == idUserFollower) {
			return CONFLICT(response, MessageType.USER.CANNOT_REMOVE_YOURSELF_FROM_FOLLOWERS, apiVersionType.V1);
		}
		let isUserAlreadyFollowed = await isUserAlreadyFollowedByUser(idUserFollower, idUserFollowed);
		if (!isUserAlreadyFollowed) {
			return CONFLICT(response, MessageType.USER.USER_IS_NOT_FOLLOWING_YOU.replace("$", username), apiVersionType.V1);
		}
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	return next();
}

const validationBlockingUser = async (request, response, next) => {
	const token = (request.headers.authorization).split(" ")[1];
	let idUserBlocked;
	let idUserBlocker;
	let {username} = request.body;
	try {
		idUserBlocker = await verifyToken(token).then(data => {return data.id});
		idUserBlocked = await getIdByUsername(username).then(id => {return id});
		if (idUserBlocked == idUserBlocker) {
			return CONFLICT(response, MessageType.USER.CANNOT_BLOCK_YOURSELF, apiVersionType.V1);
		}
		let isAlreadyBlocked = await isUserAlreadyBlockedByUser(idUserBlocker, idUserBlocked);
		if (isAlreadyBlocked) {
			return CONFLICT(response, MessageType.USER.USER_IS_ALREADY_BLOCKED, apiVersionType.V1);
		}
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	return next();
}

const validationUnblockingUser = async (request, response, next) => {
	const token = (request.headers.authorization).split(" ")[1];
	let {username} = request.body;
	try {
		let idUserBlocker = await verifyToken(token).then(data => {return data.id});
		let idUserBlocked = await getIdByUsername(username).then(id => {return id});
		if (idUserBlocked == idUserBlocker) {
			return CONFLICT(response, MessageType.USER.CANNOT_UNBLOCK_YOURSELF, apiVersionType.V1);
		}
		let isAlreadyBlocked = !(await isUserAlreadyBlockedByUser(idUserBlocker, idUserBlocked));
		if (isAlreadyBlocked) {
			return CONFLICT(response, MessageType.USER.USER_IS_ALREADY_UNBLOCKED, apiVersionType.V1);
		}
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	return next();
};

const validationAcceptOrDenyFollowerRequest = async (request, response, next) => {
	const token = (request.headers.authorization).split(" ")[1];
	let {username} = request.body;
	try {
		let idFollower = await getIdByUsername(username).then(id => {return id});
		let userDataId = await verifyToken(token).then(data => {return data.id});
		if (userDataId == idFollower) {
			return CONFLICT(response, MessageType.USER.CANNOT_ACCEPT_DENY_YOURSELF, apiVersionType.V1);
		}
		let isAlreadyAccepted = await isUserAlreadyFollowedByUser(idFollower, userDataId);
		if (isAlreadyAccepted) {
			return CONFLICT(response, MessageType.USER.USER_IS_ALREADY_ACCEPTED, apiVersionType.V1);
		}
		let isRequestSent = await isRequestFollowerSent(idFollower, userDataId);
		if (!isRequestSent) {
			return CONFLICT(response, MessageType.USER.NO_FOLLOWER_REQUEST_FROM_USER.replace("$", username), apiVersionType.V1);
		}
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	return next();
};

const validationDoesUserBlocked = async (request, response, next) => {
	const token = (request.headers.authorization).split(" ")[1];
	let ownerResourceUserId;
	let username = request.body.username;
	if (!username) username = request.params.username;
	if (!username) username = response.locals.username;
	if (!username) ownerResourceUserId = response.locals.ownerResourceUserId;
	let result;
	try {
		const userData = await verifyToken(token);
		if (!ownerResourceUserId) {
			ownerResourceUserId = await getIdByUsername(username);
		}
		if (userData.id == ownerResourceUserId) {
			return next();
		}
		result = await isUserBlockingToUser(ownerResourceUserId, userData.id);
		if (result) {
			return CONFLICT(response, MessageType.USER.USER_HAS_BLOCKED_YOU, apiVersionType.V1);
		}
		result = await isUserBlockingToUser(userData.id, ownerResourceUserId);
		if (result) {
			return CONFLICT(response, MessageType.USER.USER_BLOCKED, apiVersionType.V1);
		}
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}

	return next();
}

const validationDoesUserIsPrivateAndUnfollowedByActualUser = async (request, response, next) => {
	const token = (request.headers.authorization).split(" ")[1];
	let ownerResourceUserId;
	let username = request.body.username;
	if (!username) username = request.params.username;
	if (!username) username = response.locals.username;
	if (!username) ownerResourceUserId = response.locals.ownerResourceUserId;

	try {
		const userData = await verifyToken(token);
		if (!ownerResourceUserId) {
			ownerResourceUserId = await getIdByUsername(username);
		}
		if (userData.id == ownerResourceUserId) {
			return next();
		}
		let isAlreadyFollowed = await isUserFollowedByUser(userData.id, ownerResourceUserId);
		if (isAlreadyFollowed) {
			return next();
		}
		let isUserPrivate = await getActualPrivacyType(ownerResourceUserId);
		if (!isUserPrivate || isUserPrivate === PrivacyType.PRIVATE) {
			return CONFLICT(response, MessageType.USER.USER_HAS_PRIVATE_ACCOUNT, apiVersionType.V1);
		}
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	return next();
}

module.exports = {
	validationFollowingUser, validationUnfollowingUser, validationBlockingUser,
	validationUnblockingUser, validationRejectOnUsernameNotRegistered, validationDoesUserBlocked,
	validationDoesUserIsPrivateAndUnfollowedByActualUser, validationAcceptOrDenyFollowerRequest,
	validationRemoveUserFromFollowers
}
