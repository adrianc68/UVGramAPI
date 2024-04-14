const router = require('express').Router();
const {addUser, removeUserByUsername, createVerificationCode, getAllUsers, changePasswordOnLoggedUser, updateUser, createURLVerification, changeUserRoleByEmailOrUsername, changePrivacyType, getUserAccountData} = require('../controllers/userAccountController');
const {checkAccessTokenAndAuthRoleMiddleware} = require('../../middleware/authentication');
const {UserRoleType} = require('../../models/enum/UserRoleType');
const {apiVersionType} = require('../../types/apiVersionType');
const {validateEmailOrUsernameFormat} = require('../../validators/formatValidators/authenticationFormatValidator');
const {validateUserAccountDataFormat, validateAccountEmailFormat, validateAccountUsernameFormat, validateVerificationCodeFormat, validatePasswordFormat, validateOldPasswordFormat, validateBasicUserAccountDataFormat, validatePersonalDataFormat, validateBusinessDataFormat, validateAdminDataFormat, validateModeratorDataFormat, validateNewRoleTypeFormat, validatePrivacyDataFormat} = require('../../validators/formatValidators/userAccountFormatValidator');
const {validationIsURLRecoverAlreadyGeneratedByEmailOrUsername} = require('../../validators/urlRecoverValidation');
const {validationIsUsernameRegisteredWithNext, validationisEmailRegisteredWithNext, validationIsEmailRegistered, validationIsUsernameRegistered, validationNotGeneratedVerificationCode, validationVerificationCodeMatches, validationChangePasswordLoggedUser, validationEmailOrUsernameRejectOnNotExist, validationUpdateEmailAndUsernameData, validationPersonalRoleData, validationModeratorRoleData, validationAdminRoleData, validationBusinessRoleData, validationSecretKey, validationUserPrivacy} = require('../../validators/userAccountValidation');

router.post("/accounts/create",
	validateUserAccountDataFormat,
	validateVerificationCodeFormat,
	validationIsUsernameRegisteredWithNext,
	validationisEmailRegisteredWithNext,
	validationVerificationCodeMatches,
	addUser
);

router.post("/accounts/create/verification",
	validateAccountUsernameFormat,
	validateAccountEmailFormat,
	validationNotGeneratedVerificationCode,
	createVerificationCode
);

router.post("/accounts/password/reset",
	validateEmailOrUsernameFormat,
	validationEmailOrUsernameRejectOnNotExist,
	validationIsURLRecoverAlreadyGeneratedByEmailOrUsername,
	createURLVerification
);

router.post("/accounts/password/change",
	checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
	validatePasswordFormat,
	validateOldPasswordFormat,
	validationChangePasswordLoggedUser,
	changePasswordOnLoggedUser
);

router.get("/accounts/username/check/:username",
    validateAccountUsernameFormat,
    validationIsUsernameRegistered
);

router.get("/accounts/email/check/:email",
    validateAccountEmailFormat,
    validationIsEmailRegistered
);

router.delete("/accounts/username/delete",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR]),
    validateAccountUsernameFormat,
    removeUserByUsername
);

router.patch("/accounts/edit/personal",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.PERSONAL]),
    validateBasicUserAccountDataFormat,
    validatePersonalDataFormat,
    validationUpdateEmailAndUsernameData,
    validationPersonalRoleData,
    updateUser
);

router.patch("/accounts/edit/business",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.BUSINESS]),
    validateBasicUserAccountDataFormat,
    validateBusinessDataFormat,
    validationUpdateEmailAndUsernameData,
    validationBusinessRoleData,
    updateUser
);

router.patch("/accounts/edit/moderator",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.MODERATOR]),
    validateBasicUserAccountDataFormat,
    validateModeratorDataFormat, // By now is not validating anything.
    validationUpdateEmailAndUsernameData,
    validationModeratorRoleData, // By now is not validating anything against database
    updateUser,
);

router.patch("/accounts/edit/admin",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR]),
    validateBasicUserAccountDataFormat,
    validateAdminDataFormat, // By now is not validating anything
    validationUpdateEmailAndUsernameData,
    validationAdminRoleData, // By now is not validating anything against database
    updateUser,
);

router.get("/accounts/users/",
    checkAccessTokenAndAuthRoleMiddleware(UserRoleType.ADMINISTRATOR),
    getAllUsers
);

router.post("/accounts/users/roles/change/",
    validateNewRoleTypeFormat,
    validateEmailOrUsernameFormat,
    validationEmailOrUsernameRejectOnNotExist,
    validationSecretKey,
    changeUserRoleByEmailOrUsername
);

router.post("/accounts/users/change-privacy",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    validatePrivacyDataFormat,
    validationUserPrivacy,
    changePrivacyType
);

router.get("/accounts/data",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    getUserAccountData
);

module.exports = router;
