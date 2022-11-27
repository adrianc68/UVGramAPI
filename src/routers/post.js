const { getPostsByUsername, createPost, getPostDataByUUID, likePost, dislikePost, getUsersWhoLikesPost } = require('../controllers/postController');
const { checkAccessTokenAndAuthRoleMiddleware } = require('../middleware/authentication');
const { UserRoleType } = require('../models/enum/UserRoleType');
const { formatValidationPostData, formatValidationUUIDPostData } = require('../validators/formatValidators/postFormatValidator');
const { formatValidationAccountUsername } = require('../validators/formatValidators/userAccountFormatValidator');
const { validationDoesExistPostUUID, validationIsPostAlreadyLikedByUser, validationIsPostAlreadyDislikedByUser } = require('../validators/postValidation');
const { validationRejectOnUsernameNotRegistered, validationDoesUserBlockedActualUser } = require('../validators/userValidation');
const router = require('express').Router();

router.post("/post/create/",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    formatValidationPostData,
    createPost
);

router.get("/post/user/:username",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    formatValidationAccountUsername,
    validationRejectOnUsernameNotRegistered,
    validationDoesUserBlockedActualUser,
    getPostsByUsername
);

router.post("/post/like",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    formatValidationUUIDPostData,
    validationDoesExistPostUUID,
    validationDoesUserBlockedActualUser,
    validationIsPostAlreadyLikedByUser,
    likePost
);

router.post("/post/dislike",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    formatValidationUUIDPostData,
    validationDoesExistPostUUID,
    validationDoesUserBlockedActualUser,
    validationIsPostAlreadyDislikedByUser,
    dislikePost,
);

router.get("/post/details/likes/:uuid",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    formatValidationUUIDPostData,
    validationDoesExistPostUUID,
    validationDoesUserBlockedActualUser,
    getUsersWhoLikesPost
);

router.get("/post/details/:uuid",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    formatValidationUUIDPostData,
    validationDoesExistPostUUID,
    validationDoesUserBlockedActualUser,
    getPostDataByUUID
);


module.exports = router;