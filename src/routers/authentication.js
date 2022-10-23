const router = require('express').Router();

const { createUser } = require("../controllers/authentication");

router.post("/accounts/emailsignup", createUser);

module.exports = router;