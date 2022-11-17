const { followUser, unfollowUser, getFollowedUsersOfUser, getFollowersOfUser, getProfileOfUser } = require('../controllers/userController');
const { checkTokenAndAuthRoleMiddleware } = require('../middleware/authentication');
const { UserRoleType } = require('../models/enum/UserRoleType');
const { formatValidationAccountUsername } = require('../validators/formatValidators/userAccountFormatValidator');
const { validationFollowingUser, validationUnfollowingUser, validationExistFollowedOrFollowerUser } = require('../validators/userValidation');

const router = require('express').Router();

router.post("/user/follow/",
    checkTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERADOR, UserRoleType.PERSONAL]),
    formatValidationAccountUsername,
    validationFollowingUser,
    followUser
);

router.delete("/user/unfollow/",
    checkTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERADOR, UserRoleType.PERSONAL]),
    formatValidationAccountUsername,
    validationUnfollowingUser,
    unfollowUser
);

router.get("/user/followed-by/:username/",
    checkTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERADOR, UserRoleType.PERSONAL]),
    formatValidationAccountUsername,
    validationExistFollowedOrFollowerUser,
    getFollowedUsersOfUser
);

router.get("/user/followers-of/:username",
    checkTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERADOR, UserRoleType.PERSONAL]),
    formatValidationAccountUsername,
    validationExistFollowedOrFollowerUser,
    getFollowersOfUser
);

router.get("/:username/",
    getProfileOfUser
);


module.exports = router;