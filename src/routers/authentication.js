const router = require('express').Router();
const { createToken, authenticateToken } = require('../controllers/authenticationController');
const { validationLoginData, validationTokenData, validationAccesTokenData, validationRefreshTokenData } = require('../validators/authenticationValidation');
const { formatValidationLogin, formatValidationToken } = require('../validators/formatValidators/authenticationFormatValidator');

router.post("/authentication/login", formatValidationLogin, validationLoginData, createToken);
// router.post("/authentication/logout", formatValidationLogin);

// router.post("/authentication/testing", formatValidationToken, validationAccesTokenData);
router.post("/authentication/refresh", formatValidationToken, validationRefreshTokenData);


module.exports = router;