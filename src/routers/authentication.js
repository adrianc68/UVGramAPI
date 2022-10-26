const router = require('express').Router();
const { createUser, deleteUserByUsername } = require("../controllers/authentication");
const { formatValidationAccountData, formatValidationAccountEmail, formatValidationAccountUsername } = require('../controllers/authenticationFormatValidator');
const { validationIsUsernameRegisteredWithNext, validationisEmailRegisteredWithNext, validationIsEmailRegistered, validationIsUsernameRegistered } = require('../controllers/authenticationValidation');

router.post("/accounts/create", formatValidationAccountData, validationIsUsernameRegisteredWithNext, validationisEmailRegisteredWithNext, createUser);
router.delete("/accounts/username/delete", formatValidationAccountUsername, deleteUserByUsername);
router.get("/accounts/username/check", formatValidationAccountUsername, validationIsUsernameRegistered);
router.get("/accounts/email/check", formatValidationAccountEmail, validationIsEmailRegistered);

module.exports = router;