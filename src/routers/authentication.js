const router = require('express').Router();
const { createTokens, refreshTokens, logOutToken } = require('../controllers/authenticationController');
const { validationLoginData, validationAccesTokenData, validationRefreshTokenData } = require('../validators/authenticationValidation');
const { formatValidationLogin, formatValidationToken } = require('../validators/formatValidators/authenticationFormatValidator');

router.post("/authentication/login", formatValidationLogin, validationLoginData, createTokens);
router.post("/authentication/refresh", formatValidationToken, validationRefreshTokenData, refreshTokens);
router.post("/authentication/logout", formatValidationToken, logOutToken);

router.post("/authentication/testing", formatValidationToken, validationAccesTokenData);


module.exports = router;