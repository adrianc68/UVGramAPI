const MessageType = {
	USER: {
		USER_REGISTERED: {code:  "USER_REGISTERED", message: "User is registered"},
		BAD_PASSWORD: {code: "BAD_PASSWORD", message: "Password does not match"},
		EMAIL_ALREADY_REGISTERED: {code: "EMAIL_ALREADY_REGISTERED", message: "The email is already registered"},
		EMAIL_NOT_REGISTERED: {code: "EMAIL_NOT_REGISTERED", message: "The email is not registered"},
		USER_ALREADY_REGISTERED: {code: "USER_ALREADY_REGISTERED", message: "username is already registered"},
		USER_NOT_REGISTERED: {code: "USER_NOT_REGISTERED", message: "username not registered"},
		INVALID_INPUT: {code: "INVALID_INPUT", message: "The provided data input are invalid"},
		NOT_FOUND: {code: "NOT_FOUND", message: "User not found"},
		INVALID_DATA: {code: "INVALID_DATA", message: "The provided data are invalid"},
		MISSING_FIELD: {code: "MISSING_FIELD", message: "Falta uno o más campos obligatorios"},
		DATA_TOO_LONG: {code: "DATA_TOO_LONG", message: "Los datos proporcionados son demasiado largos"},
		INVALID_VERIFICATION_CODE: {code: "INVALID_VERIFICATION_CODE", message: "verification code is not valid"},
		WAITFOR_GENERATE_VERIFICATION_CODE: {code: "WAITFOR_GENERATE_VERIFICATION_CODE", message: "Please wait to generate another verification code"},
		WAITFOR_GENERATE_URL: {code: "WAITFOR_GENERATE_VERIFICATION_CODE", message: "please wait 5 minutes to generate another one"},
		USERNAME_NOT_FOUND: {code: "USERNAME_NOT_FOUND", message: "username not found"},
		USER_NOT_FOUND: {code: "USER_NOT_FOUND", message: "user not found"},
		URL_EXPIRED: {code: "URL_EXPIRED", message: "URL has expired"},
		URL_INVALID: {code: "URL_INVALID", message: "URL is not valid"},
		ERROR_SEND_CODE_VERIFICATION: {code: "ERROR_SEND_CODE_VERIFICATION", message: "Cannot send message to this address"},
		ERROR_GENERATE_URL: {code: "ERROR_GENERATE_URL", message: "Cannot generate a new url"},
		CONFIRMATION_CODE_SENT: {code: "CONFIRMATION_CODE_SENT", message: "a confirmation address has been sent to the email"},
		UNAUTHORIZED: {code: "UNAUTHORIZED", message: "You don't have permissions to perform this action!"},
		USER_BLOCKED: {code: "USER_BLOCKED", message: "The user has been blocked"},
		PASSWORD_NOT_MATCH_WITH_ACTUAL: {code: "PASSWORD_NOT_MATCH_WITH_ACTUAL", message: "The old password does not match actual password"},
		ACCOUNT_PRIVACY_IS_ALREADY_TAKEN: {code: "ACCOUNT_PRIVACY_IS_ALREADY_TAKEN", message: "Your account is already: $"},
		INVALID_CATEGORY_TYPE_PROVIDED: {code: "INVALID_CATEGORY_TYPE_PROVIDED", message: "category type provided does not exist"},
		INVALID_GENDER_TYPE_PROVIDED: {code: "INVALID_GENDER_TYPE_PROVIDED", message: "gender provided does not exist"},
		INVALID_IDCAREER_TYPE_PROVIDED: {code: "INVALID_IDCAREER_TYPE_PROVIDED", message: "idCareer provided does not exist"},
		ERROR_CANNOT_CHANGE_EMAIL: {code: "ERROR_CANNOT_CHANGE_EMAIL", message: "Cannot change email, try later"},
		ERROR_CANNOT_CHANGE_PASSWORD: {code: "ERROR_CANNOT_CHANGE_PASSWORD", message: "Cannot change password, try later"},
		LOGOUT_SUCESSFUL: {code: "LOGOUT_SUCESSFUL", message: "Logout sucessfull"},
		BLOCKED_TO: {code: "BLOCKED_TO", message: "You have blocked to $"},
		UNBLOCKED_TO: {code: "UNBLOCKED_TO", message: "You have unblocked to $"},
		DELETED_TO: {code: "DELETED_TO", message: "You have removed $ from your followers"},
		UNFOLLOWED_TO: {code: "UNFOLLOWED_TO", message: "You have unfollowed to $"},
		UNABLE_TO_FOLLOW_TO: {code: "UNABLE_TO_FOLLOW_TO", message: "Cannot follow to $"},
		FOLLOWING_TO: {code: "FOLLOWING_TO", message: "You are now following to $"},
		CANNOT_SEND_FOLLOWER_REQUEST_TO: {code: "CANNOT_SEND_FOLLOWER_REQUEST_TO", message: "Cannot send follower request to $"},
		FOLLOWER_REQUEST_SENT_TO: {code: "FOLLOWER_REQUEST_SENT_TO", message: "Follower request sent to $"},
		CANNOT_FOLLOW_YOURSELF: {code: "CANNOT_FOLLOW_YOURSELF", message: "You cannot follow yourself"},
		CANNOT_UNFOLLOW_YOURSELF: {code: "CANNOT_UNFOLLOW_YOURSELF", message: "You cannot unfollow yourself"},
		CANNOT_REMOVE_YOURSELF_FROM_FOLLOWERS: {code: "CANNOT_REMOVE_YOURSELF_FROM_FOLLOWERS", message: "You cannot delete yourself from your followers"},
		CANNOT_BLOCK_YOURSELF: {code: "CANNOT_BLOCK_YOURSELF", message: "You cannot block yourself"},
		CANNOT_UNBLOCK_YOURSELF: {code: "CANNOT_UNBLOCK_YOURSELF", message: "You cannot unblock yourself"},
		CANNOT_ACCEPT_DENY_YOURSELF: {code: "CANNOT_ACCEPT_DENY_YOURSELF", message: "You cannot accept or deny follower request from yourself"},
		USER_IS_ALREADY_FOLLOWED: {code: "USER_IS_ALREADY_FOLLOWED", message: "User is already followed"},
		USER_IS_ALREADY_UNFOLLOWED: {code: "USER_IS_ALREADY_UNFOLLOWED", message: "User is already unfollowed"},
		USER_IS_ALREADY_BLOCKED: {code: "USER_IS_ALREADY_BLOCKED", message: "User is already blocked"},
		USER_IS_ALREADY_UNBLOCKED: {code: "USER_IS_ALREADY_UNBLOCKED", message: "User is already unblocked"},
		USER_IS_ALREADY_ACCEPTED: {code: "USER_IS_ALREADY_ACCEPTED", message: "User is already accepted"},
		USER_HAS_PRIVATE_ACCOUNT: {code: "USER_HAS_PRIVATE_ACCOUNT", message: "User has private account"},
		USER_HAS_BLOCKED_YOU: {code: "USER_HAS_BLOCKED_YOU", message: "User has blocked you"},
		NO_FOLLOWER_REQUEST_FROM_USER: {code: "NO_FOLLOWER_REQUEST_FROM_USER", message: "There is no follower request from $"},
		USER_IS_NOT_FOLLOWING_YOU: {code: "USER_IS_NOT_FOLLOWING_YOU", message: "$ is not following you"},
		FOLLOWER_REQUEST_ALREADY_SENT: {code: "FOLLOWER_REQUEST_ALREADY_SENT", message: "Follower request is already sent to user"},
		OK: {code: "OK", message: "Successfull request"},
		ERROR_CANNOT_GENERATE_VERIFICATION_CODE: {code: "ERROR_CANNOT_GENERATE_VERIFICATION_CODE", message: "Error generating the verification code"},
		USER_IS_NOT_BLOCKING_YOU: {code: "USER_IS_NOT_BLOCKING_YOU", message: "The user is not blocking you"},
		PASSWORD_CHANGED: {code: "PASSWORD_CHANGED", message: "The password has been changed"},
		CANNOT_BLOCK_USER: {code: "CANNOT_BLOCK_USER", message: "Cannot block the user"},
		CANNOT_UNBLOCK_USER: {code: "CANNOT_UNBLOCK_USER", message: "Cannot unblock the user"},
		USERS_FOUND: {code: "USERS_FOUND", message: "Users found"},
		USERS_NOT_FOUND: {code: "USERS_NOT_FOUND", message: "User(s) not found"},
		DATA_FOUND: {code: "DATA_FOUND", message: "Data found"},
		DATA_NOT_FOUND: {code: "DATA_NOT_FOUND", message: "Data not found"},
		URL_VERIFICATION_SENT: {code: "URL_VERIFICATION_SENT", message: "a confirmation address has been sent to the new email"},
		DATA_UPDATED: {code: "DATA_UPDATED", message: "Data was updated"},
		EMAIL_UPDATED: {code: "EMAIL_UPDATED", message: "Email was updated"},
		DATA_CREATED: {code: "DATA_CREATED", message: "Data was created"},
		POST_ALREADY_LIKED: {code: "POST_ALREADY_LIKED", message: "Post is already liked"},
		POST_ALREADY_DISLIKED: {code: "POST_ALREADY_DISLIKED", message: "Post is already disliked"}
	},
	SERVICES: {
		CANNOT_GET_FILE: {code:"CANNOT_GET_FILE", message: "Cannot get file from system"},
		FILE_CORRUPTED_OR_NOT_FOUND: {code:"FILE_CORRUPTED_OR_NOT_FOUND", message: "File not found or it is corrupted"},
		API_ERROR: {code: "API_ERROR", message: "Error al comunicarse con un servicio externo"},
		CONNECTION_ERROR: {code: "CONNECTION_ERROR", message: "Error de conexión con un servicio externo"},
		TIMEOUT_ERROR: {code: "TIMEOUT_ERROR", message: "Tiempo de espera agotado al comunicarse con un servicio externo"},
		AUTHENTICATION_ERROR: {code: "AUTHENTICATION_ERROR", message: "Error de autenticación al acceder a un servicio externo"},
		INTERNAL_ERROR: {code: "INTERNAL_ERROR", message: "An error has ocurred on the internal server"},
		INVALID_TOKEN_TYPE: {code: "INVALID_TOKEN_TYPE", message: "You must provide a token of type $"},
		NONE: {code: "NONE", message: "NONE"}
	},
	SYSTEM: {
		CONFIGURATION_ERROR: {code: "CONFIGURATION_ERROR", message: "Error de configuración del sistema"},
		DATABASE_ERROR: {code: "DATABASE_ERROR", message: "Error en la base de datos"},
		DISK_FULL: {code: "DISK_FULL", message: "El disco está lleno, no se pueden realizar más operaciones"},
		INTERNAL_ERROR: {code: "INTERNAL_ERROR", message: "Error interno del sistema"},
	}
};

module.exports = MessageType;

