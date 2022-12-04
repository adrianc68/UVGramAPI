const { acceptFollowerRequest, denyFollowerRequest } = require('../controllers/userAccountController');
const { followUser, unfollowUser, getFollowersOfUser,
    getProfileOfUser, blockUser, unblockUser, getFollowedByUser, getPendingFollowRequest, deleteFollower, getBlockedUsers } = require('../controllers/userController');
const { checkAccessTokenAndAuthRoleMiddleware } = require('../middleware/authentication');
const { UserRoleType } = require('../models/enum/UserRoleType');
const { formatValidationAccountUsername } = require('../validators/formatValidators/userAccountFormatValidator');
const { validationFollowingUser, validationUnfollowingUser, validationBlockingUser,
    validationUnblockingUser, validationRejectOnUsernameNotRegistered, validationDoesUserBlockedActualUser, validationDoesUserIsPrivateAndUnfollowedByActualUser, validationAcceptOrDenyFollowerRequest, validationRemoveUserFromFollowers } = require('../validators/userValidation');
const router = require('express').Router();

router.post("/user/follow/",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    formatValidationAccountUsername,
    validationRejectOnUsernameNotRegistered,
    validationDoesUserBlockedActualUser,
    validationFollowingUser,
    followUser,
);

router.delete("/user/unfollow/",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    formatValidationAccountUsername,
    validationRejectOnUsernameNotRegistered,
    validationDoesUserBlockedActualUser,
    validationUnfollowingUser,
    unfollowUser
);

router.get("/user/followers/pending/",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    getPendingFollowRequest
);

router.post("/user/followers/accept/",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    formatValidationAccountUsername,
    validationRejectOnUsernameNotRegistered,
    validationAcceptOrDenyFollowerRequest,
    acceptFollowerRequest
);

router.delete("/user/followers/deny/",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    formatValidationAccountUsername,
    validationRejectOnUsernameNotRegistered,
    validationAcceptOrDenyFollowerRequest,
    denyFollowerRequest
);

router.delete("/user/followers/delete",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    formatValidationAccountUsername,
    validationRejectOnUsernameNotRegistered,
    validationRemoveUserFromFollowers,
    deleteFollower
);

router.get("/user/followed-by/:username/",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    formatValidationAccountUsername,
    validationRejectOnUsernameNotRegistered,
    validationDoesUserBlockedActualUser,
    validationDoesUserIsPrivateAndUnfollowedByActualUser,
    getFollowedByUser
);

router.get("/user/followers-of/:username",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    formatValidationAccountUsername,
    validationRejectOnUsernameNotRegistered,
    validationDoesUserBlockedActualUser,
    validationDoesUserIsPrivateAndUnfollowedByActualUser,
    getFollowersOfUser
);

router.post("/user/block/",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    formatValidationAccountUsername,
    validationRejectOnUsernameNotRegistered,
    validationDoesUserBlockedActualUser,
    validationBlockingUser,
    blockUser
);

router.delete("/user/unblock/",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    formatValidationAccountUsername,
    validationRejectOnUsernameNotRegistered,
    validationDoesUserBlockedActualUser,
    validationUnblockingUser,
    unblockUser
);

router.get("/user/blocked/all",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    getBlockedUsers
);

// Need to get profile image
router.get("/:username/",
    formatValidationAccountUsername,
    validationRejectOnUsernameNotRegistered,
    getProfileOfUser
);

module.exports = router;