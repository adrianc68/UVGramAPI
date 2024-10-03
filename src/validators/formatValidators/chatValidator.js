const {validateError} = require("../../middleware/validationFormatMiddleware");
const {validateUsernameData, validateFileChatData, validateContentChatData} = require("./formatValidator");

const validateChatDataFormat = [
	validateUsernameData,
	validateFileChatData,
	validateContentChatData,
	(request, response, next) => {
	validateError(request,response, next)
	}
]

module.exports = {
	validateChatDataFormat
}
