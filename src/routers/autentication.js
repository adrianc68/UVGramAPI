const router = require('express').Router();

const { createUser } = require("../controllers/autentication");

router.post("/accounts/emailsignup", createUser);

module.exports = router;