const router = require('express').Router();
const { createUser, deleteUserByUsername } = require("../controllers/authentication");
const { isEmailRegistered, isUsernameRegistered } = require('../controllers/authenticationValidation');


router.post("/accounts/create", createUser);
router.delete("/accounts/username/delete", deleteUserByUsername);
router.get("/accounts/username/check", isUsernameRegistered);
router.get("/accounts/email/check", isEmailRegistered);

module.exports = router;