const router = require('express').Router();

const { createUser, deleteUserByUsername } = require("../controllers/authentication");

router.post("/accounts/emailsignup", createUser);
router.delete("/accounts/delete", deleteUserByUsername);

module.exports = router;