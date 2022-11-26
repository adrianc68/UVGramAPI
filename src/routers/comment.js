const { createCommentPost, getAllCommentsOfUUIDPost, likeComment, dislikeComment, getUsersWhoLikesComment, deleteComment, createAnswerToComment } = require('../controllers/commentController');
const { checkAccessTokenAndAuthRoleMiddleware } = require('../middleware/authentication');
const { UserRoleType } = require('../models/enum/UserRoleType');
const { validationDoesExistCommentUUID, validationIsCommentAlreadyLikedByUser, validationIsCommentAlreadyDislikedByUser, validationDeleteCommentIfOwner } = require('../validators/commentValidation');
const { formatValidationUUIDCommentData, formatValidationCommentData } = require('../validators/formatValidators/commentValidator');
const { validationDoesExistPostUUID } = require('../validators/postValidation');
const router = require('express').Router();

router.post("/post/comment/create/",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    formatValidationUUIDCommentData,
    formatValidationCommentData,
    validationDoesExistPostUUID,
    createCommentPost
);

router.get("/post/comment/all/:uuid",
    formatValidationUUIDCommentData,
    validationDoesExistPostUUID,
    getAllCommentsOfUUIDPost
);

router.post("/post/comment/like/",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    formatValidationUUIDCommentData,
    validationDoesExistCommentUUID,
    validationIsCommentAlreadyLikedByUser,
    likeComment
);

router.post("/post/comment/dislike/",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    formatValidationUUIDCommentData,
    validationDoesExistCommentUUID,
    validationIsCommentAlreadyDislikedByUser,
    dislikeComment
);

router.get("/post/comment/details/likes/:uuid",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    formatValidationUUIDCommentData,
    validationDoesExistCommentUUID,
    getUsersWhoLikesComment
);

router.delete("/post/comment/delete/",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    formatValidationUUIDCommentData,
    validationDoesExistCommentUUID,
    validationDeleteCommentIfOwner,
    deleteComment
);

router.post("/post/comment/answer",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    formatValidationUUIDCommentData,
    formatValidationCommentData,
    validationDoesExistCommentUUID,
    createAnswerToComment
);

module.exports = router;