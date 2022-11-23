const router = require('express').Router();
const { addUser, removeUserByUsername, createVerificationCode, getAllUsers, changePasswordOnLoggedUser, updateUser, createURLVerification } = require('../controllers/userAccountController');
const { checkAccessTokenAndAuthRoleMiddleware } = require('../middleware/authentication');
const { UserRoleType } = require('../models/enum/UserRoleType');
const { formatValidationUsernameOrEmail } = require('../validators/formatValidators/authenticationFormatValidator');
const { formatValidationUserAccountData, formatValidationAccountEmail, formatValidationAccountUsername, formatValidationVerificationCode, formatValidationPassword, formatValidationOldPassword, formatValidationBasicUserAccountData, formatValidationPersonalData, formatValidationBusinessData, formatValidationAdminData, formatValidationModerator } = require('../validators/formatValidators/userAccountFormatValidator');
const { validationIsURLRecoverAlreadyGeneratedByEmailOrUsername } = require('../validators/urlRecoverValidation');
const { validationIsUsernameRegisteredWithNext, validationisEmailRegisteredWithNext, validationIsEmailRegistered, validationIsUsernameRegistered, validationNotGeneratedVerificationCode, validationVerificationCodeMatches, validationChangePasswordLoggedUser, validationEmailOrUsernameRejectOnNotExist, validationUpdateEmailAndUsernameData, validationPersonalRoleData, validationModeratorRoleData, validationAdminRoleData, validationBusinessRoleData } = require('../validators/userAccountValidation');

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
    formatValidationUsernameOrEmail,
    validationEmailOrUsernameRejectOnNotExist,
    validationIsURLRecoverAlreadyGeneratedByEmailOrUsername,
    createURLVerification
);

router.post("/accounts/password/change",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERADOR, UserRoleType.PERSONAL]),
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

router.patch("/accounts/edit/personal",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.PERSONAL]),
    formatValidationBasicUserAccountData,
    formatValidationPersonalData,
    validationUpdateEmailAndUsernameData,
    validationPersonalRoleData,
    updateUser
);

router.patch("/accounts/edit/business",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.BUSINESS]),
    formatValidationBasicUserAccountData,
    formatValidationBusinessData,
    validationUpdateEmailAndUsernameData,
    validationBusinessRoleData,
    updateUser
);

router.patch("/accounts/edit/moderator",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.MODERADOR]),
    formatValidationBasicUserAccountData,
    formatValidationModerator, // By now is not validating anything.
    validationUpdateEmailAndUsernameData,
    validationModeratorRoleData, // By now is not validating anything against database
    updateUser,
);

router.patch("/accounts/edit/admin",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR]),
    formatValidationBasicUserAccountData,
    formatValidationAdminData, // By now is not validating anything
    validationUpdateEmailAndUsernameData,
    validationAdminRoleData, // By now is not validating anything against database
    updateUser,
);

router.get("/accounts/users/",
    checkAccessTokenAndAuthRoleMiddleware(UserRoleType.ADMINISTRATOR),
    getAllUsers
);

module.exports = router;