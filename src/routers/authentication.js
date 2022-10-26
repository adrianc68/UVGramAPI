const router = require('express').Router();
const { createUser, deleteUserByUsername } = require("../controllers/authentication");
const { validationAccountEmail, validationAccountUsername, validationAccountData } = require('../controllers/authenticationFormatValidator');
const { isEmailRegistered, isUsernameRegistered } = require('../controllers/authenticationValidation');

router.post("/accounts/create", validationAccountData, createUser);
router.delete("/accounts/username/delete", validationAccountUsername,deleteUserByUsername);
router.get("/accounts/username/check", validationAccountUsername, isUsernameRegistered);
router.get("/accounts/email/check", validationAccountEmail, isEmailRegistered);

module.exports = router;