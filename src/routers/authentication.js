const router = require('express').Router();
const { createUser, deleteUserByUsername } = require("../controllers/authentication");
const { isEmailRegistered, isUsernameRegistered } = require('../controllers/authenticationValidation');



router.post("/accounts/create", createUser);
router.delete("/accounts/delete", deleteUserByUsername);
router.get("/accounts/username/", isUsernameRegistered );
router.get("/accounts/email/", isEmailRegistered);




module.exports = router;