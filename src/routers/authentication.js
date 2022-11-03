const router = require('express').Router();
const { createTokens, refreshTokens, logOutToken } = require('../controllers/authenticationController');
const { validationLoginData, validationAccesTokenData, validationRefreshTokenData } = require('../validators/authenticationValidation');
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
    formatValidationRefreshToken,
    logOutToken
);

router.post("/authentication/testing",
    formatValidationAccessToken,
    validationAccesTokenData
);

module.exports = router;