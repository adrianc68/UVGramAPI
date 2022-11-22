const { changeEmailDataOnConfirmation } = require('../controllers/urlRecoverController');
const { changePasswordOnUnloggedUser } = require('../controllers/userAccountController');
const { validationURLRecover } = require('../validators/urlRecoverValidation');
const router = require('express').Router();

router.get("/accounts/verification/url/confirm_email?:data",
    validationURLRecover,
    changeEmailDataOnConfirmation
);

router.get("/accounts/verification/url/change_password?:data",
    validationURLRecover,

    // RETURN HTML to user 
    // changePasswordOnUnloggedUser,
);

module.exports = router;