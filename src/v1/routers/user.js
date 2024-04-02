const { acceptFollowerRequest, denyFollowerRequest } = require('../controllers/userAccountController');
const { followUser, unfollowUser, getFollowersOfUser,
    getProfileOfUser, blockUser, unblockUser, getFollowedByUser, getPendingFollowRequest, deleteFollower, getBlockedUsers, checkIfUserLoggedIsBlockedByUser, findByFilter } = require('../controllers/userController');
const { checkAccessTokenAndAuthRoleMiddleware, checkAccessTokenAsOptionalMiddleware } = require('../../middleware/authentication');
const { UserRoleType } = require('../../models/enum/UserRoleType');
const { validateAccountUsernameFormat } = require('../../validators/formatValidators/userAccountFormatValidator');
const { validationFollowingUser, validationUnfollowingUser, validationBlockingUser,
    validationUnblockingUser, validationRejectOnUsernameNotRegistered, validationDoesUserBlocked, validationDoesUserIsPrivateAndUnfollowedByActualUser, validationAcceptOrDenyFollowerRequest, validationRemoveUserFromFollowers } = require('../../validators/userValidation');
const router = require('express').Router();

router.post("/user/follow/",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    validateAccountUsernameFormat,
    validationRejectOnUsernameNotRegistered,
    validationDoesUserBlocked,
    validationFollowingUser,
    followUser,
);

router.post("/user/unfollow/",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    validateAccountUsernameFormat,
    validationRejectOnUsernameNotRegistered,
    validationDoesUserBlocked,
    validationUnfollowingUser,
    unfollowUser
);

router.get("/user/followers/pending/",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    getPendingFollowRequest
);

router.post("/user/followers/accept/",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    validateAccountUsernameFormat,
    validationRejectOnUsernameNotRegistered,
    validationAcceptOrDenyFollowerRequest,
    acceptFollowerRequest
);

router.delete("/user/followers/deny/",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    validateAccountUsernameFormat,
    validationRejectOnUsernameNotRegistered,
    validationAcceptOrDenyFollowerRequest,
    denyFollowerRequest
);

router.delete("/user/followers/delete",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    validateAccountUsernameFormat,
    validationRejectOnUsernameNotRegistered,
    validationRemoveUserFromFollowers,
    deleteFollower
);

router.get("/user/followed-by/:username/",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    validateAccountUsernameFormat,
    validationRejectOnUsernameNotRegistered,
    validationDoesUserBlocked,
    validationDoesUserIsPrivateAndUnfollowedByActualUser,
    getFollowedByUser
);

router.get("/user/followers-of/:username",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    validateAccountUsernameFormat,
    validationRejectOnUsernameNotRegistered,
    validationDoesUserBlocked,
    validationDoesUserIsPrivateAndUnfollowedByActualUser,
    getFollowersOfUser
);

router.post("/user/block/",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    validateAccountUsernameFormat,
    validationRejectOnUsernameNotRegistered,
    validationDoesUserBlocked,
    validationBlockingUser,
    blockUser
);

router.post("/user/unblock/",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    validateAccountUsernameFormat,
    validationRejectOnUsernameNotRegistered,
    validationUnblockingUser,
    unblockUser
);

router.get("/user/blocked/all",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    getBlockedUsers
);

// Need to get profile image
router.get("/:username/",
    checkAccessTokenAsOptionalMiddleware(),
    validateAccountUsernameFormat,
    validationRejectOnUsernameNotRegistered,
    getProfileOfUser
);

router.get("/user/check/block/:username",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    validateAccountUsernameFormat,
    validationRejectOnUsernameNotRegistered,
    checkIfUserLoggedIsBlockedByUser
);

router.get("/users/:filter",
    findByFilter,
);

module.exports = router;
