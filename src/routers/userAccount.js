const router = require('express').Router();
const { addUser, removeUserByUsername, createVerificationCode, getAllUsers, changePasswordOnLoggedUser, changePasswordOnUnloggedUser } = require('../controllers/userAccountController');
const { checkTokenAndAuthRoleMiddleware } = require('../middleware/authentication');
const { UserRoleType } = require('../models/enum/UserRoleType');
const { formatValidationUsernameOrEmail } = require('../validators/formatValidators/authenticationFormatValidator');
const { formatValidationUserAccountData, formatValidationAccountEmail, formatValidationAccountUsername, formatValidationVerificationCode, formatValidationPassword, formatValidationOldPassword } = require('../validators/formatValidators/userAccountFormatValidator');
const { validationIsUsernameRegisteredWithNext, validationisEmailRegisteredWithNext, validationIsEmailRegistered, validationIsUsernameRegistered, validationNotGeneratedVerificationCode, validationVerificationCodeMatches, validationChangePasswordLoggedUser, validationChangePasswordUnloggedUser } = require('../validators/userAccountValidation');

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

router.post("/accounts/password/reset",
    formatValidationPassword,
    formatValidationUsernameOrEmail,
    formatValidationVerificationCode,
    validationChangePasswordUnloggedUser,
    changePasswordOnUnloggedUser,
);

router.post("/accounts/password/change",
    checkTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERADOR, UserRoleType.PERSONAL]),
    formatValidationPassword,
    formatValidationOldPassword,
    validationChangePasswordLoggedUser,
    changePasswordOnLoggedUser
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
    checkTokenAndAuthRoleMiddleware(UserRoleType.ADMINISTRATOR),
    getAllUsers
);

module.exports = router;