const router = require('express').Router();
const { createToken, authenticateToken } = require('../controllers/authenticationController');
const { validationLoginData } = require('../validators/authenticationValidation');
const { formatValidationLogin } = require('../validators/formatValidators/authenticationFormatValidator');

router.post("/authentication/login", formatValidationLogin, validationLoginData, createToken);

module.exports = router;