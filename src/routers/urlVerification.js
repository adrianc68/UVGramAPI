const { changeEmailDataOnConfirmation } = require('../controllers/urlRecoverController');
const { validationURLRecover } = require('../validators/urlRecoverValidation');
const router = require('express').Router();

router.get("/accounts/verification/url/confirm_email?:data",
    validationURLRecover,
    changeEmailDataOnConfirmation
);

module.exports = router;