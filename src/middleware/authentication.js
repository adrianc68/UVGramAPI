const { Router } = require("express");
const { checkAuth } = require("../controllers/authenticationController");
const { validationAccesTokenData } = require("../validators/authenticationValidation");
const { formatValidationAuthorizationToken } = require("../validators/formatValidators/authenticationFormatValidator");

const checkAuthAccessMiddleware = Router().use([
    formatValidationAuthorizationToken,
    validationAccesTokenData,
    checkAuth])

module.exports = { checkAuthAccessMiddleware }