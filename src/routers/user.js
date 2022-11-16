const { followUser, unfollowUser } = require('../controllers/userController');
const { checkTokenAndAuthRoleMiddleware } = require('../middleware/authentication');
const { UserRoleType } = require('../models/enum/UserRoleType');
const { formatValidationAccountUsername } = require('../validators/formatValidators/userAccountFormatValidator');
const { validationFollowingUser, validationUnfollowingUser } = require('../validators/userValidation');

const router = require('express').Router();

router.post("/user/follow/",
    checkTokenAndAuthRoleMiddleware(UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERADOR, UserRoleType.PERSONAL),
    formatValidationAccountUsername,
    validationFollowingUser,
    followUser
);

router.delete("/user/unfollow/",
    checkTokenAndAuthRoleMiddleware(UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERADOR, UserRoleType.PERSONAL),
    formatValidationAccountUsername,
    validationUnfollowingUser,
    unfollowUser
);

module.exports = router;