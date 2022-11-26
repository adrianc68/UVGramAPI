const { getPostsByUsername, createPost, getPostDataByUUID, likePost, dislikePost, getUsersWhoLikesPost } = require('../controllers/postController');
const { getAllPostFromUserId } = require('../dataaccess/postDataAccess');
const { checkAccessTokenAndAuthRoleMiddleware } = require('../middleware/authentication');
const { UserRoleType } = require('../models/enum/UserRoleType');
const { formatValidationPostData, formatValidationUUIDPostData } = require('../validators/formatValidators/postFormatValidator');
const { formatValidationAccountUsername } = require('../validators/formatValidators/userAccountFormatValidator');
const { validationDoesExistPostUUID, validationIsPostAlreadyLikedByUser, validationIsPostAlreadyDislikedByUser } = require('../validators/postValidation');
const { validationRejectOnUsernameNotRegistered } = require('../validators/userValidation');
const router = require('express').Router();

router.get("/post/details/:uuid",
    formatValidationUUIDPostData,
    validationDoesExistPostUUID,
    getPostDataByUUID
);

router.get("/post/user/:username",
    formatValidationAccountUsername,
    validationRejectOnUsernameNotRegistered,
    getPostsByUsername
);

router.post("/post/create/",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    formatValidationPostData,
    createPost
);

router.post("/post/like",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    formatValidationUUIDPostData,
    validationDoesExistPostUUID,
    validationIsPostAlreadyLikedByUser,
    likePost
);

router.post("/post/dislike",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    formatValidationUUIDPostData,
    validationDoesExistPostUUID,
    validationIsPostAlreadyDislikedByUser,
    dislikePost,
);

router.get("/post/details/likes/:uuid",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    formatValidationUUIDPostData,
    validationDoesExistPostUUID,
    getUsersWhoLikesPost
);

module.exports = router;