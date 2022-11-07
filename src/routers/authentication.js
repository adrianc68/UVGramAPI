const router = require('express').Router();
const { createTokens, refreshTokens, logOutToken, sayHello, checkAuthRole } = require('../controllers/authenticationController');
const { checkAuthRoleMiddleware } = require('../middleware/authentication');
const { UserRoleType } = require('../models/enum/UserRoleType');
const { validationLoginData, validationRefreshTokenData, validationLogoutTokensData } = require('../validators/authenticationValidation');
const { formatValidationLogin, formatValidationAuthorizationToken, formatValidationRefreshTokenAsParameter, formatValidationOptionalAccessToken } = require('../validators/formatValidators/authenticationFormatValidator');

router.post("/authentication/login",
    formatValidationLogin,
    validationLoginData,
    createTokens
);

router.post("/authentication/refresh",
    formatValidationAuthorizationToken,
    formatValidationOptionalAccessToken,
    validationRefreshTokenData,
    refreshTokens
);

router.post("/authentication/logout",
    formatValidationAuthorizationToken,
    formatValidationRefreshTokenAsParameter,
    validationLogoutTokensData,
    logOutToken
);

router.post("/authentication/testing",
    checkAuthRoleMiddleware([UserRoleType.ADMINISTRATOR]),
    sayHello,
);

module.exports = router;