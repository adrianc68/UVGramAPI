const { Router } = require("express");
const { checkAuthRole } = require("../controllers/authenticationController");
const { validationAccesTokenData } = require("../validators/authenticationValidation");
const { formatValidationAuthorizationToken } = require("../validators/formatValidators/authenticationFormatValidator");

const checkTokenAndAuthRoleMiddleware = (roles) => Router().use([
    formatValidationAuthorizationToken,
    validationAccesTokenData,
    checkAuthRole(roles),
]);

module.exports = { checkTokenAndAuthRoleMiddleware }