const router = require('express').Router();
const { validationLoginData } = require('../validators/authenticationValidation');
const { formatValidationLogin } = require('../validators/formatValidators/authenticationFormatValidator');

router.post("/authentication/login", formatValidationLogin, validationLoginData);

module.exports = router;