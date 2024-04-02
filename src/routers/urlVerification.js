const { changeEmailDataOnURLConfirmation, getRedirectionURLOnConfirmation, changePasswordOnUnloggedUserOnURLConfirmation } = require('../controllers/urlRecoverController');
const { validatePasswordFormat } = require('../validators/formatValidators/userAccountFormatValidator');
const { validationURLRecover } = require('../validators/urlRecoverValidation');
const router = require('express').Router();

router.get("/accounts/verification/url/confirm_email?:data",
    validationURLRecover,
    changeEmailDataOnURLConfirmation
);

router.get("/accounts/verification/url/change_password?:data",
    validationURLRecover,
    getRedirectionURLOnConfirmation
);

router.post("/accounts/password/reset/confirmation?:data",
    validatePasswordFormat,
    validationURLRecover,
    changePasswordOnUnloggedUserOnURLConfirmation
);

module.exports = router;