const router = require('express').Router();
const { addUser, removeUserByUsername } = require('../controllers/userAccountController');
const { formatValidationAccountData, formatValidationAccountEmail,
    formatValidationAccountUsername } = require('../validators/formatValidators/userAccountFormatValidator');
const { validationIsUsernameRegisteredWithNext, validationisEmailRegisteredWithNext,
    validationIsEmailRegistered, validationIsUsernameRegistered } = require('../validators/userAccountValidation');

router.post("/accounts/create", formatValidationAccountData, validationIsUsernameRegisteredWithNext, validationisEmailRegisteredWithNext, addUser);
router.delete("/accounts/username/delete", formatValidationAccountUsername, removeUserByUsername);
router.get("/accounts/username/check", formatValidationAccountUsername, validationIsUsernameRegistered);
router.get("/accounts/email/check", formatValidationAccountEmail, validationIsEmailRegistered);

module.exports = router;