const { followUser, unfollowUser, getFollowedUsersOfUser, getFollowersOfUser,
    getProfileOfUser, blockUser, unblockUser } = require('../controllers/userController');
const { checkTokenAndAuthRoleMiddleware } = require('../middleware/authentication');
const { UserRoleType } = require('../models/enum/UserRoleType');
const { formatValidationAccountUsername } = require('../validators/formatValidators/userAccountFormatValidator');
const { validationFollowingUser, validationUnfollowingUser, validationBlockingUser,
    validationUnblockingUser, validationRejectOnUsernameNotRegistered } = require('../validators/userValidation');
const router = require('express').Router();

router.post("/user/follow/",
    checkTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERADOR, UserRoleType.PERSONAL]),
    formatValidationAccountUsername,
    validationRejectOnUsernameNotRegistered,
    validationFollowingUser,
    followUser
);

router.delete("/user/unfollow/",
    checkTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERADOR, UserRoleType.PERSONAL]),
    formatValidationAccountUsername,
    validationRejectOnUsernameNotRegistered,
    validationUnfollowingUser,
    unfollowUser
);

router.get("/user/followed-by/:username/",
    checkTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERADOR, UserRoleType.PERSONAL]),
    formatValidationAccountUsername,
    validationRejectOnUsernameNotRegistered,
    getFollowedUsersOfUser
);

router.get("/user/followers-of/:username",
    checkTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERADOR, UserRoleType.PERSONAL]),
    formatValidationAccountUsername,
    validationRejectOnUsernameNotRegistered,
    getFollowersOfUser
);

router.post("/user/block/",
    checkTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERADOR, UserRoleType.PERSONAL]),
    formatValidationAccountUsername,
    validationRejectOnUsernameNotRegistered,
    validationBlockingUser,
    blockUser
);

router.post("/user/unblock/",
    checkTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERADOR, UserRoleType.PERSONAL]),
    formatValidationAccountUsername,
    validationRejectOnUsernameNotRegistered,
    validationUnblockingUser,
    unblockUser
);






// Need to get profile image and publications
router.get("/:username/",
    formatValidationAccountUsername,
    validationRejectOnUsernameNotRegistered,
    getProfileOfUser
);

module.exports = router;