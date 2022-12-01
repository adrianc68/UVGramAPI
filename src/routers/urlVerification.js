const { changeEmailDataOnURLConfirmation, getRedirectionURLOnConfirmation, changePasswordOnUnloggedUserAndLogInOnURLConfirmation } = require('../controllers/urlRecoverController');
const { formatValidationPassword } = require('../validators/formatValidators/userAccountFormatValidator');
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
    formatValidationPassword,
    validationURLRecover,
    changePasswordOnUnloggedUserAndLogInOnURLConfirmation
);

module.exports = router;