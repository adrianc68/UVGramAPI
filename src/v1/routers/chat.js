const {UserRoleType} = require("../../models/enum/UserRoleType")
const {checkAccessTokenAndAuthRoleMiddleware} = require('../../middleware/authentication');
const {sendMessageController} = require('../controllers/chatController');
const {validateChatDataFormat} = require('../../validators/formatValidators/chatValidator');
const {mapFileIfExistIntoFileModel} = require("../controllers/fileController");
const router = require('express').Router();

router.post("/chat/message",
	checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
	validateChatDataFormat,
	mapFileIfExistIntoFileModel,
	sendMessageController
);


router.delete("/chat/message",
	checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
	validateChatDataFormat
);



module.exports = router;
