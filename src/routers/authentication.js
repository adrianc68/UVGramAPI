const router = require('express').Router();
const { createTokens, refreshTokens, logOutToken } = require('../controllers/authenticationController');
const { validationLoginData, validationAccesTokenData, validationRefreshTokenData, sayHello } = require('../validators/authenticationValidation');
const { formatValidationLogin, formatValidationAccessToken, formatValidationRefreshToken, formatValidationRefreshAndAccessToken } = require('../validators/formatValidators/authenticationFormatValidator');

router.post("/authentication/login",
    formatValidationLogin,
    validationLoginData,
    createTokens
);

router.post("/authentication/refresh",
    formatValidationRefreshToken,
    validationRefreshTokenData,
    refreshTokens
);

router.post("/authentication/logout",
    formatValidationRefreshAndAccessToken,
    validationAccesTokenData,
    validationRefreshTokenData,
    logOutToken
);

router.post("/authentication/testing",
    formatValidationAccessToken,
    validationAccesTokenData,
    sayHello
);

module.exports = router;