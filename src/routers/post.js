const { getPostsByUsername, createPost, getPostDataByUUID, likePost, dislikePost, getUsersWhoLikesPost } = require('../controllers/postController');
const { checkAccessTokenAndAuthRoleMiddleware } = require('../middleware/authentication');
const { UserRoleType } = require('../models/enum/UserRoleType');
const { formatValidationPostData, formatValidationUUIDPostData } = require('../validators/formatValidators/postFormatValidator');
const { formatValidationAccountUsername } = require('../validators/formatValidators/userAccountFormatValidator');
const { validationDoesExistPostUUID, validationIsPostAlreadyLikedByUser, validationIsPostAlreadyDislikedByUser } = require('../validators/postValidation');
const { validationRejectOnUsernameNotRegistered, validationDoesUserBlockedActualUser, validationDoesUserIsPrivateAndUnfollowedByActualUser } = require('../validators/userValidation');
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
    validationDoesUserIsPrivateAndUnfollowedByActualUser,
    getPostsByUsername
);

router.post("/post/like",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    formatValidationUUIDPostData,
    validationDoesExistPostUUID,
    validationDoesUserBlockedActualUser,
    validationDoesUserIsPrivateAndUnfollowedByActualUser,
    validationIsPostAlreadyLikedByUser,
    likePost
);

router.post("/post/dislike",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    formatValidationUUIDPostData,
    validationDoesExistPostUUID,
    validationDoesUserBlockedActualUser,
    validationDoesUserIsPrivateAndUnfollowedByActualUser,
    validationIsPostAlreadyDislikedByUser,
    dislikePost,
);

router.get("/post/details/likes/:uuid",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    formatValidationUUIDPostData,
    validationDoesExistPostUUID,
    validationDoesUserBlockedActualUser,
    validationDoesUserIsPrivateAndUnfollowedByActualUser,
    getUsersWhoLikesPost
);

router.get("/post/details/:uuid",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    formatValidationUUIDPostData,
    validationDoesExistPostUUID,
    validationDoesUserBlockedActualUser,
    validationDoesUserIsPrivateAndUnfollowedByActualUser,
    getPostDataByUUID
);


module.exports = router;