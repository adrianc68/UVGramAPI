const { createCommentPost, getAllCommentsOfUUIDPost, likeComment, dislikeComment, getUsersWhoLikesComment, deleteComment, createAnswerToComment } = require('../controllers/commentController');
const { checkAccessTokenAndAuthRoleMiddleware } = require('../middleware/authentication');
const { UserRoleType } = require('../models/enum/UserRoleType');
const { validationDoesExistCommentUUID, validationIsCommentAlreadyLikedByUser, validationIsCommentAlreadyDislikedByUser, validationDeleteCommentIfOwner } = require('../validators/commentValidation');
const { formatValidationUUIDCommentData, formatValidationCommentData } = require('../validators/formatValidators/commentValidator');
const { validationDoesExistPostUUID } = require('../validators/postValidation');
const { validationDoesUserBlockedActualUser } = require('../validators/userValidation');
const router = require('express').Router();

router.post("/post/comment/create/",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    formatValidationUUIDCommentData,
    formatValidationCommentData,
    validationDoesExistPostUUID,
    validationDoesUserBlockedActualUser,
    createCommentPost
);

router.post("/post/comment/reply",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    formatValidationUUIDCommentData,
    formatValidationCommentData,
    validationDoesExistCommentUUID,
    validationDoesUserBlockedActualUser,
    createAnswerToComment
);

router.post("/post/comment/like/",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    formatValidationUUIDCommentData,
    validationDoesExistCommentUUID,
    validationDoesUserBlockedActualUser,
    validationIsCommentAlreadyLikedByUser,
    likeComment
);

router.post("/post/comment/dislike/",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    formatValidationUUIDCommentData,
    validationDoesExistCommentUUID,
    validationDoesUserBlockedActualUser,
    validationIsCommentAlreadyDislikedByUser,
    dislikeComment
);

router.get("/post/comment/details/likes/:uuid",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    formatValidationUUIDCommentData,
    validationDoesExistCommentUUID,
    validationDoesUserBlockedActualUser,
    getUsersWhoLikesComment
);

router.delete("/post/comment/delete/",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    formatValidationUUIDCommentData,
    validationDoesExistCommentUUID,
    validationDoesUserBlockedActualUser,
    validationDeleteCommentIfOwner,
    deleteComment
);

router.get("/post/comment/all/:uuid",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    formatValidationUUIDCommentData,
    validationDoesExistPostUUID,
    validationDoesUserBlockedActualUser,
    getAllCommentsOfUUIDPost
);


module.exports = router;