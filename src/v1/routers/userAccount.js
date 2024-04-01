const router = require('express').Router();
const {addUser, removeUserByUsername, createVerificationCode, getAllUsers, changePasswordOnLoggedUser, updateUser, createURLVerification, changeUserRoleByEmailOrUsername, changePrivacyType, getUserAccountData} = require('../../controllers/userAccountController');
const {checkAccessTokenAndAuthRoleMiddleware} = require('../../middleware/authentication');
const {UserRoleType} = require('../../models/enum/UserRoleType');
const {apiVersionType} = require('../../types/apiVersionType');
const {formatValidationEmailOrUsername} = require('../../validators/formatValidators/authenticationFormatValidator');
const {validateUserAccountDataFormat, validateAccountEmail, validateAccountUsername, validateVerificationCode, validatePassword, validateOldPassword, validateBasicUserAccountData, validatePersonalData, validateBusinessData, validateAdminData, validateModeratorData, validateNewRoleType, validatePrivacyData} = require('../../validators/formatValidators/userAccountFormatValidator');
const {validationIsURLRecoverAlreadyGeneratedByEmailOrUsername} = require('../../validators/urlRecoverValidation');
const {validationIsUsernameRegisteredWithNext, validationisEmailRegisteredWithNext, validationIsEmailRegistered, validationIsUsernameRegistered, validationNotGeneratedVerificationCode, validationVerificationCodeMatches, validationChangePasswordLoggedUser, validationEmailOrUsernameRejectOnNotExist, validationUpdateEmailAndUsernameData, validationPersonalRoleData, validationModeratorRoleData, validationAdminRoleData, validationBusinessRoleData, validationSecretKey, validationUserPrivacy} = require('../../validators/userAccountValidation');

// router.post("/accounts/create",
//     validateUserAccountDataFormat,
//     validateVerificationCode,
//     validationIsUsernameRegisteredWithNext,
//     validationisEmailRegisteredWithNext,
//     validationVerificationCodeMatches,
//     addUser
// );

router.post("/accounts/create",
	validateUserAccountDataFormat,
	validateVerificationCode,
	// validationIsUsernameRegisteredWithNext,
	// validationisEmailRegisteredWithNext,
	// validationVerificationCodeMatches,
	// addUser
);

// router.post("/accounts/create/verification",
//     validateAccountUsername,
//     validateAccountEmail,
//     validationNotGeneratedVerificationCode,
//     createVerificationCode
// );

// router.post("/accounts/password/reset",
//     formatValidationEmailOrUsername,
//     validationEmailOrUsernameRejectOnNotExist,
//     validationIsURLRecoverAlreadyGeneratedByEmailOrUsername,
//     createURLVerification
// );

// router.post("/accounts/password/change",
//     checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
//     validatePassword,
//     validateOldPassword,
//     validationChangePasswordLoggedUser,
//     changePasswordOnLoggedUser
// );

// router.get("/accounts/username/check/:username",
//     validateAccountUsername,
//     validationIsUsernameRegistered
// );

// router.get("/accounts/email/check/:email",
//     validateAccountEmail,
//     validationIsEmailRegistered
// );

// router.delete("/accounts/username/delete",
//     checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR]),
//     validateAccountUsername,
//     removeUserByUsername
// );

// router.patch("/accounts/edit/personal",
//     checkAccessTokenAndAuthRoleMiddleware([UserRoleType.PERSONAL]),
//     validateBasicUserAccountData,
//     validatePersonalData,
//     validationUpdateEmailAndUsernameData,
//     validationPersonalRoleData,
//     updateUser
// );

// router.patch("/accounts/edit/business",
//     checkAccessTokenAndAuthRoleMiddleware([UserRoleType.BUSINESS]),
//     validateBasicUserAccountData,
//     validateBusinessData,
//     validationUpdateEmailAndUsernameData,
//     validationBusinessRoleData,
//     updateUser
// );

// router.patch("/accounts/edit/moderator",
//     checkAccessTokenAndAuthRoleMiddleware([UserRoleType.MODERATOR]),
//     validateBasicUserAccountData,
//     validateModeratorData, // By now is not validating anything.
//     validationUpdateEmailAndUsernameData,
//     validationModeratorRoleData, // By now is not validating anything against database
//     updateUser,
// );

// router.patch("/accounts/edit/admin",
//     checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR]),
//     validateBasicUserAccountData,
//     validateAdminData, // By now is not validating anything
//     validationUpdateEmailAndUsernameData,
//     validationAdminRoleData, // By now is not validating anything against database
//     updateUser,
// );

// router.get("/accounts/users/",
//     checkAccessTokenAndAuthRoleMiddleware(UserRoleType.ADMINISTRATOR),
//     getAllUsers
// );

// router.post("/accounts/users/roles/change/",
//     validateNewRoleType,
//     formatValidationEmailOrUsername,
//     validationEmailOrUsernameRejectOnNotExist,
//     validationSecretKey,
//     changeUserRoleByEmailOrUsername
// );

// router.post("/accounts/users/change-privacy",
//     checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
//     validatePrivacyData,
//     validationUserPrivacy,
//     changePrivacyType
// );

// router.get("/accounts/data",
//     checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
//     getUserAccountData
// );

module.exports = router;
