const router = require('express').Router();
const { createTokens, refreshTokens, logOutToken } = require('../controllers/authenticationController');
const { validationLoginData, validationAccesTokenData, validationRefreshTokenData, sayHello, validationLogoutTokensData } = require('../validators/authenticationValidation');
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
    formatValidationAuthorizationToken,
    validationAccesTokenData,
    sayHello
);

module.exports = router;