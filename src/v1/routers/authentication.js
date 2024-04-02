const router = require('express').Router();
const {createTokens, refreshTokens, logoutSession, sayHello} = require('../controllers/authenticationController');
const {checkAccessTokenAndAuthRoleMiddleware} = require('../../middleware/authentication');
const {UserRoleType} = require('../../models/enum/UserRoleType');
const {validationLoginData, validationRefreshTokenDataAsAuthorization} = require('../../validators/authenticationValidation');
const {validateLoginFormat, validateAuthorizationTokenFormat, validateOptionalAccessTokenFormat} = require('../../validators/formatValidators/authenticationFormatValidator');

router.post("/authentication/login",
	validateLoginFormat,
	validationLoginData,
	createTokens
);

router.post("/authentication/refresh",
	validateAuthorizationTokenFormat,
	validateOptionalAccessTokenFormat,
	validationRefreshTokenDataAsAuthorization,
	refreshTokens
);

router.post("/authentication/logout",
	checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.PERSONAL]),
	logoutSession
);

router.post("/authentication/testing",
	checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.PERSONAL]),
	sayHello,
);

module.exports = router;
