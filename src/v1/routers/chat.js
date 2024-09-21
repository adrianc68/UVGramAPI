const {UserRoleType} = require("../../models/enum/UserRoleType")
const {checkAccessTokenAndAuthRoleMiddleware} = require('../../middleware/authentication');
const {sendMessageController, getAllChatsCreated, getAllMessagesByChatUuid} = require('../controllers/chatController');
const {validateChatDataFormat} = require('../../validators/formatValidators/chatValidator');
const {mapFileIfExistIntoFileModel} = require("../controllers/fileController");
const {validationDoesChatExistByUuid} = require("../../validators/chatValidation");
const router = require('express').Router();

router.get("/chat/all", 
	checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
	getAllChatsCreated
);

router.get("/chat/messages/:uuid",
	checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
	validationDoesChatExistByUuid,
	getAllMessagesByChatUuid
);


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
