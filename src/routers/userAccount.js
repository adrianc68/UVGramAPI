const router = require('express').Router();
const { addUser, removeUserByUsername, createVerificationCode, getAllUsers } = require('../controllers/userAccountController');
const { checkAuthRoleMiddleware } = require('../middleware/authentication');
const { UserRoleType } = require('../models/enum/UserRoleType');
const { formatValidationUserAccountData, formatValidationAccountEmail, formatValidationAccountUsername, formatValidationVerificationCode } = require('../validators/formatValidators/userAccountFormatValidator');
const { validationIsUsernameRegisteredWithNext, validationisEmailRegisteredWithNext, validationIsEmailRegistered, validationIsUsernameRegistered, validationNotGeneratedVerificationCode, validationVerificationCodeMatches } = require('../validators/userAccountValidation');

router.post("/accounts/create",
    formatValidationUserAccountData,
    formatValidationVerificationCode,
    validationIsUsernameRegisteredWithNext,
    validationisEmailRegisteredWithNext,
    validationVerificationCodeMatches,
    addUser
);

router.post("/accounts/create/verification",
    formatValidationAccountUsername,
    formatValidationAccountEmail,
    validationNotGeneratedVerificationCode,
    createVerificationCode
);

router.get("/accounts/username/check",
    formatValidationAccountUsername,
    validationIsUsernameRegistered
);

router.get("/accounts/email/check",
    formatValidationAccountEmail,
    validationIsEmailRegistered
);

router.delete("/accounts/username/delete",
    formatValidationAccountUsername,
    removeUserByUsername
);

router.get("/accounts/users/",
    checkAuthRoleMiddleware(UserRoleType.ADMINISTRATOR),
    getAllUsers
);

module.exports = router;