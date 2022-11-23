const { Op, Sequelize } = require("sequelize");
const { sequelize } = require("../database/connectionDatabaseSequelize");
const { encondePassword, encodeStringSHA256, encondeSHA512 } = require("../helpers/cipher");
const { generateRandomCode } = require("../helpers/generateCode");
const { Account } = require("../models/Account");
const { AccountVerification } = require("../models/AccountVerification");
const { AdministratorUserRole } = require("../models/AdministratorUserRole");
const { Block } = require("../models/Block");
const { BusinessUserRole } = require("../models/BusinessUserRole");
const { UserRoleType } = require("../models/enum/UserRoleType");
const { Follower } = require("../models/Follower");
const { ModeratorUserRole } = require("../models/ModeratorUserRole");
const { PersonalUserRole } = require("../models/PersonalUserRole");
const { Session } = require("../models/Session");
const { User } = require("../models/User");
const { UserConfiguration } = require("../models/UserConfiguration");
const { UserRole } = require("../models/UserRole");
const { VerificationCode } = require("../models/VerificationCode");

/**
 * Get user,account data from database using email or username
 * @param {*} emailOrUsername email or username.
 * @returns undefined or the user data retrieved from database
 */
const getAccountLoginData = async (emailOrUsername) => {
    const user = await User.findAll({
        where: {
            [Op.or]: [{ username: emailOrUsername }, { '$Account.email$': emailOrUsername }]
        },
        attributes: ["id", "username", "Account.password", "Account.email", "UserRole.role", "Account.AccountVerification.account_status"],
        include: [{
            model: Account,
            attributes: [],
            include: [{
                model: AccountVerification,
                as: "AccountVerification",
                attributes: []
            }]
        }, {
            model: UserRole,
            as: "UserRole",
            attributes: []
        }],
        plain: true,
        raw: true
    });
    return user;
};

/**
 * Get user, account data from database using id
 * @param {*} id the user's id.
 * @returns User including Account and UserRole
 */
const getAccountLoginDataById = async (id) => {
    const user = await User.findAll({
        where: {
            id
        },
        attributes: ["id", "username", "Account.password", "Account.email", "UserRole.role"],
        include: [{
            model: Account,
            as: "Account",
            attributes: []
        }, {
            model: UserRole,
            as: "UserRole",
            attributes: []
        }],
        plain: true,
        raw: true
    });
    return user;
};

/**
 * Check if username exist in database.
 * @param {*} username the username as string.
 * @returns true if exist otherwise false.
 */
const isUsernameRegistered = async (username) => {
    let isUsernameRegistered = false;
    const user = await User.findAll({
        where: { username }
    });
    isUsernameRegistered = (user.length != 0);
    return isUsernameRegistered;
};

/**
 * Check if email exist in database.
 * @param {*} email the email as string.
 * @returns true if exist otherwise false.
 */
const isEmailRegistered = async (email) => {
    let isEmailRegistered = false;
    const account = await Account.findAll({
        where: { email }
    });
    isEmailRegistered = (account.length != 0);
    return isEmailRegistered;
};

/**
 * Delete user by username in database.
 * @param {*} username the username as string
 * @returns the number of entities removed from database.
 */
const deleteUserByUsername = async (username) => {
    const t = await sequelize.transaction();
    let message;
    try {
        const user = await User.destroy({
            where: {
                username
            }
        }, { transaction: t }).then((rowDeleted) => {
            message = rowDeleted + " entity(s) was removed";
        });
        await t.commit();
    } catch (error) {
        await t.rollback();
        throw new Error(error);
    }
    return message;
};

/**
 * Create an user in database.
 * @param {*} user the user object that contain password, email, name, presentation, username, phoneNumber, birthday and confirmationCode
 * @returns a message indicating that user was added.
 */
const createUser = async (user) => {
    const { password, email, name, presentation, username, phoneNumber, birthdate, confirmationCode } = user;
    let userID;
    const t = await sequelize.transaction();
    try {
        const user = await User.create({
            name,
            presentation,
            username,
        }, { transaction: t });
        userID = user.id;
        const userConfiguration = await UserConfiguration.create({
            privacy: "PUBLICO",
            id_user: userID
        }, { transaction: t });
        const account = await Account.create({
            email,
            password: encondePassword(password),
            id_user: userID,
            phone_number: phoneNumber,
            birthday: birthdate,
        }, { transaction: t });
        const accountVerification = await AccountVerification.create({
            account_status: "NO_BLOQUEADO",
            id_user: userID
        }, { transaction: t });
        const userRole = await UserRole.create({
            id_user: userID,
            role: "PERSONAL"
        }, { transaction: t });
        const personalUserRole = await PersonalUserRole.create({
            faculty: null,
            career: null,
            gender: "INDIFERENTE",
            id_user: userID
        }, { transaction: t });
        await t.commit();
    } catch (error) {
        await t.rollback();
        throw new Error(error);
    }
    return "New entity was added";
};

/**
 * Generate a random code with 8 characters in database.
 * @param {*} username the username that generated the code.
 * @returns verification code as string.
 */
const generateCodeVerification = async (username) => {
    let verificationData;
    const t = await sequelize.transaction();
    try {
        verificationData = await VerificationCode.create({
            code: generateRandomCode(8),
            username: encodeStringSHA256(username)
        }, { transaction: t });
        await t.commit();
    } catch (error) {
        await t.rollback();
        throw new Error(error);
    }
    return verificationData.code;
};

/**
 * Check if verification code is generated.
 * @param {*} id the user id that generated the verification code.
 * @returns true if it was generated otherwise false.
 */
const isVerificationCodeGenerated = async (username) => {
    let isCodeGenerated = false;
    let verificationData = await VerificationCode.findAll({
        where: {
            username: encodeStringSHA256(username)
        }
    });
    isCodeGenerated = (verificationData.length != 0);
    return isCodeGenerated;
};

/**
 * Delete a verification code from database.
 * @param {*} username the user that generated verification code.
 * @returns true if it was removed otherwise false.
 */
const removeVerificationCode = async (username) => {
    let isRemoved = false;
    const t = await sequelize.transaction();
    try {
        let verificationData = await VerificationCode.destroy({
            where: {
                username: encodeStringSHA256(username)
            }
        }, { transaction: t });
        await t.commit();
        isRemoved = true;
    } catch (error) {
        await t.rollback();
        throw new Error(error);
    }
    return isRemoved;
};

/**
 * Get ID of user by username.
 * @param {*} username the username to get the Id.
 * @returns id of user
 */
const getIdByUsername = async (username) => {
    let id;
    try {
        id = await User.findAll({
            where: {
                username
            },
            attributes: ["id"],
            raw: true,
            plain: true
        }).then(data => {
            if (data) {
                return data.id;
            }
            return null;
        });
    } catch (error) {
        throw new Error(error);
    }
    return id;
}

/**
 * Check if verification code provided matches with database verification code.
 * @param {*} username username that generated the verification code.
 * @param {*} verificationCode the verification code provided by the user.
 * @returns true if matches otherwise false.
 */
const doesVerificationCodeMatches = async (username, verificationCode) => {
    let doesMatches = false;
    let verificationData = await VerificationCode.findAll({
        where: {
            username: encodeStringSHA256(username),
            code: verificationCode
        }
    });
    doesMatches = (verificationData.length != 0);
    return doesMatches;
};

/**
 * Change user password.
 * @param {*} emailOrUsername the email of user.
 * @param {*} password the new password to be changed.
 * @issue #6977 Model update not return affectedRows
 * @returns true if it was update otherwise false.
 */
const changePassword = async (emailOrUsername, password) => {
    let isChanged = false;
    const t = await sequelize.transaction();
    try {
        let result = await Account.findOne({
            where: {
                [Op.or]: [{ email: emailOrUsername }, { '$User.username$': emailOrUsername }]
            },
            include: [{
                model: User,
                as: "User",
            }],
        }).then(async user => {
            if (user) {
                let data = await user.update({
                    password: encondePassword(password)
                }, { transaction: t });
                isChanged = true;
            }
        });
        await t.commit();
    } catch (error) {
        await t.rollback();
        throw new Error(error);
    }
    return isChanged;
}

/**
 * Check if passworld (as oldpassword) is set into Account's user
 * @param {*} oldPassword the actual password of user
 * @param {*} email the email of user to check password
 * @returns true if it's equal to, otherwise false
 */
const isOldPasswordValid = async (oldPassword, email) => {
    let isRegistered = false;
    try {
        let result = await Account.findOne({
            where: {
                password: encondePassword(oldPassword),
                email
            },
            raw: true,
        });
        isRegistered = (result != null);
    } catch (error) {
        throw new Error(error);
    }
    return isRegistered;
}

/**
 * Get all user registered in database.
 * @returns users (id,username, name) in JSON format.
 */
const getAllUsers = async () => {
    let usersRegistered;
    try {
        usersRegistered = await User.findAll({
            attributes: ["id", "username", "name"]
        });
    } catch (error) {
        throw new Error();
    }
    return usersRegistered;
};

/**
 * Add a follower to a followed user.
 * @param {*} id_user_follower user that is following to an specific user
 * @param {*} id_user_followed the user that is followed.
 * @returns true if user can follow otherwise false.
 */
const followUser = async (id_user_follower, id_user_followed) => {
    let isFollowed = false;
    const t = await sequelize.transaction();
    try {
        await Follower.create({
            id_user_follower,
            id_user_followed
        }, { transaction: t });
        await t.commit();
        isFollowed = true;
    } catch (error) {
        await t.rollback();
        throw new Error(error);
    }
    return isFollowed;
}

/**
 * Remove a follower from a followed user.
 * @param {*} id_user_follower the user that is following a specified user.
 * @param {*} id_user_followed the followed user.
 * @returns 
 */
const unfollowUser = async (id_user_follower, id_user_followed) => {
    let isUnfollowed = false;
    const t = await sequelize.transaction();
    try {
        await Follower.destroy({
            where: {
                id_user_follower,
                id_user_followed
            }
        }, { transaction: t });
        await t.commit();
        isUnfollowed = true;
    } catch (error) {
        await t.rollback();
        throw new Error(error);
    }
    return isUnfollowed;
}

/**
 * Check if user is already folllowing an user
 * @param {*} id_user_follower the user that is following an specified user
 * @param {*} id_user_followed the user that is followed.
 * @returns true if is already following otherwise false.
 */
const isUserFollowedByUser = async (id_user_follower, id_user_followed) => {
    let isFollowed = false;
    try {
        let data = await Follower.findAll({
            where: {
                id_user_follower,
                id_user_followed
            }
        });
        isFollowed = data.length != 0;
    } catch (error) {
        throw new Error(error);
    }
    return isFollowed;
}

/**
 * Get all followed users by User
 * @param {*} id the user that is following the those users
 * @returns array with users that contain username and name
 */
const getFollowedByUser = async (id) => {
    let followedByUser = [];
    try {
        followedByUser = await Follower.findAll({
            where: {
                id_user_follower: id
            },
            attributes: ["followed.*"],
            include: [{
                model: User,
                as: "followed",
                attributes: []
            }],
            nest: true,
            raw: true
        })
    } catch (error) {
        throw new Error(error);
    }
    return followedByUser;
}
/**
 * Get all followers of user
 * @param {*} id the user to get the followers
 * @returns array with users that contain username and name
 */
const getFollowersOfUser = async (id) => {
    let followers = [];
    try {
        followers = await Follower.findAll({
            where: {
                id_user_followed: id
            },
            attributes: ["follower.*"],
            include: [{
                model: User,
                as: "follower",
                attributes: []
            }],
            nest: true,
            raw: true
        }).then(users => {
            return users;
        });
    } catch (error) {
        throw new Error(error);
    }
    return followers;
}

/**
 * Get user Profile
 * @param {*} id the user to get the profile
 * @returns return name, username and presentation
 */
const getUserProfile = async (id) => {
    let user
    try {
        user = await User.findAll({
            where: { id },
            attributes: ["name", "presentation", "username"],
            raw: true,
            plain: true,
        });
    } catch (error) {
        throw error;
    }
    return user;
}

/**
 * Block an user
 * @param {*} id_user_blocker user who will block the user
 * @param {*} id_user_blocked the user who is going to be blocked
 * @returns true is it was blocked otherwise false
 */
const blockUser = async (id_user_blocker, id_user_blocked) => {
    let isBlocked;
    const t = await sequelize.transaction();
    try {
        await Block.create({
            id_user_blocker,
            id_user_blocked
        }, { transaction: t });
        await t.commit();
        isBlocked = true;
    } catch (error) {
        await t.rollback();
        throw new Error(error);
    }
    return isBlocked;
}

/**
 * Unblock user
 * @param {*} id_user_blocker the user who has blocked the another one
 * @param {*} id_user_blocked the user who will be unblocked
 * @returns true if it was unblocked otherwise fae
 */
const unblockUser = async (id_user_blocker, id_user_blocked) => {
    let isUnblocked;
    const t = await sequelize.transaction();
    try {
        await Block.destroy({
            where: {
                id_user_blocker,
                id_user_blocked
            }
        }, { transaction: t });
        await t.commit();
        isUnblocked = true;
    } catch (error) {
        await t.rollback();
        throw new Error(error);
    }
    return isUnblocked;
}

/**
 * Check if a user is already blocked by another one
 * @param {*} id_user_blocker the user who blocked.
 * @param {*} id_user_blocked the user who is probably blocked.
 * @returns true if it's blocked otherwise false.
 */
const isUserBlockedByUser = async (id_user_blocker, id_user_blocked) => {
    let isBlocked = false;
    try {
        let data = await Block.findAll({
            where: {
                id_user_blocker,
                id_user_blocked
            }
        });
        isBlocked = data.length != 0;
    } catch (error) {
        throw new Error(error);
    }
    return isBlocked;
}

/**
 * Update the user's email
 * @param {*} newEmail the new Email to update
 * @param {*} id_user the user's id who will get the new email
 * @issue #6977 Model update not return affectedRows
 * @returns true if it was updated otherwise false
 */
const updateUserEmail = async (newEmail, id_user) => {
    let isUpdated = false;
    const t = await sequelize.transaction();
    try {
        let user = await Account.update({
            email: newEmail
        }, {
            where: {
                id_user
            },
            transaction: t
        });
        await t.commit();
        isUpdated = true;
    } catch (error) {
        await t.rollback();
        throw new Error(error);
    }
    return isUpdated;
}

/**
 * Update basic data of User (name, presentation, username, phoneNumber and birthdate)
 * @param {*} newUserData the new user's data
 * @param {*} id_user the user's id who will get updated.
 * @param {*} transaction as transaction
 * @issue #6977 Model update not return affectedRows
 */
const updateUserBasicData = async (newUserData, id_user, transaction) => {
    const { name, presentation, username, phoneNumber, birthdate } = newUserData;
    try {
        let user = await User.update({ name, presentation, username, }, {
            where: { id: id_user },
            transaction
        });
        let account = await Account.update({
            phone_number: phoneNumber,
            birthday: birthdate
        }, {
            where: { id_user },
            transaction
        });
    } catch (error) {
        throw error;
    }
}


/**
 * Update Personal User Role Data and Basic Data
 * @param {*} basicData the basic data of user (name, presentation, username, phoneNumber, birthdate)
 * @param {*} personalData the personal data of User (gender, idCareer)
 * @param {*} id_user the user's ID
 * @issue #6977 Model update not return affectedRow
 * @returns true if it was updated otherwise false
 */
const updateUserPersonalData = async (basicData, personalData, id_user) => {
    let isUpdated = false;
    const { gender, idCareer } = personalData;
    const t = await sequelize.transaction();
    try {
        let user = await updateUserBasicData(basicData, id_user, t);
        let userRoleType = await PersonalUserRole.update({
            gender,
            id_career: idCareer
        }, {
            where: {
                id_user
            },
            transaction: t
        });
        await t.commit();
        isUpdated = true;
    } catch (error) {
        await t.rollback();
        throw new Error(error);
    }
    return isUpdated;
}

/**
 * Update Business Role Data and Basic Data
 * @param {*} basicData the basic data of user (name, presentation, username, phoneNumber, birthdate)
 * @param {*} businessData the business data of user ( category, city, postalCode, postalAddress, contactEmail, phoneContact, organizationName) 
 * @param {*} id_user the user's ID
 * @issue #6977 Model update not return affectedRow
 * @returns true if it was updated otherwise false
 */
const updateBusinessData = async (basicData, businessData, id_user) => {
    let isUpdated = false;
    const { category, city, postalCode, postalAddress, contactEmail, phoneContat, organizationName } = businessData;
    const t = await sequelize.transaction();
    try {
        let user = await updateUserBasicData(basicData, id_user, t);
        let businessData = await BusinessUserRole.update({
            category,
            city,
            postal_code: postalCode,
            postal_address: postalAddress,
            contact_email: contactEmail,
            phone_contact: phoneContat,
            organization_name: organizationName
        }, {
            where: { id_user },
            transaction: t
        });
        await t.commit();
        isUpdated = true;
    } catch (error) {
        await t.rollback();
        throw new Error(error);
    }
    return isUpdated;
}

/**
 * Update Moderator Role Data and Basic Data
 * @param {*} basicData the basic data of user (name, presentation, username, phoneNumber, birthdate) 
 * @param {*} moderatorData the moderator data ( Nothing by now )
 * @param {*} id_user the user's ID
 * @issue #6977 Model update not return affectedRows
 * @returns true if it was update otherwise false
 */
const updateModeratorData = async (basicData, moderatorData, id_user) => {
    let isUpdated = false;
    const { updateDate } = moderatorData; // Update_date should be not modified, but by now is OK.
    const t = await sequelize.transaction();
    try {
        let user = await updateUserBasicData(basicData, id_user, t);
        let moderatorData = await ModeratorUserRole.update({ update_date: updateDate }, {
            where: { id_user },
            transaction: t
        });
        await t.commit();
        isUpdated = true;
    } catch (error) {
        await t.rollback();
        throw new Error(error);
    }
    return isUpdated;
}

/**
 * Update Administrator Role Data And Basic Data 
 * @param {*} basicData the basic data of user (name, presentation, username, phoneNumber, birthdate)
 * @param {*} adminData the administrator data ( Nothing by now )
 * @param {*} id_user the user's ID
 * @issue #6977 Model update not return affectedRows
 * @returns true if it was updated otherwise false
 */
const updateAdministratorData = async (basicData, adminData, id_user) => {
    let isUpdated = false;
    const { createdTime } = adminData;
    const t = await sequelize.transaction();
    try {
        let user = await updateUserBasicData(basicData, id_user, t);
        let adminRoleType = await AdministratorUserRole.update({ createdTime }, {
            where: { id_user },
            transaction: t
        });
        await t.commit();
        isUpdated = true;
    } catch (error) {
        await t.rollback();
        throw new Error(error);
    }
    return isUpdated;
}

/**
 * Change user role type in database.
 * @param {*} id_user the user id to change role type
 * @param {*} userRoleType the new UserRoleType
 * @returns true is updated otherwise false
 */
const changeUserRoleType = async (id_user, userRoleType) => {
    let isUpdated = false;
    const t = await sequelize.transaction();
    try {
        let userRoleData = await UserRole.findOne({
            where: {id_user}
        });

        if (userRoleData) {
            if (userRoleType == UserRoleType.PERSONAL) {
                let result = await PersonalUserRole.findOne({ where: {id_user} });
                if (!result) {
                    await PersonalUserRole.create({ id_user }, { transaction: t });
                }
            } else if (userRoleType == UserRoleType.BUSINESS) {
                let result = await BusinessUserRole.findOne({ where: {id_user} });
                if (!result) {
                    await BusinessUserRole.create({ id_user }, { transaction: t });
                }
            } else if (userRoleType == UserRoleType.MODERATOR) {
                let result = await ModeratorUserRole.findOne({ where: {id_user} });
                if (!result) {
                    await ModeratorUserRole.create({ id_user }, { transaction: t });
                }
            } else if (userRoleType == UserRoleType.ADMINISTRATOR) {
                let result = await AdministratorUserRole.findOne({ where: {id_user} });
                if (!result) {
                    await AdministratorUserRole.create({ id_user }, { transaction: t });
                }
            }
            await userRoleData.update(
                { role: userRoleType }, {
                where: { id_user },
                transaction: t
            });
            await t.commit();
            isUpdated = true;
        }
    } catch (error) {
        await t.rollback();
        throw error;
    }
    return isUpdated;
}

module.exports = {
    getAccountLoginData, isUsernameRegistered, isEmailRegistered,
    getAccountLoginDataById, deleteUserByUsername, createUser,
    generateCodeVerification, isVerificationCodeGenerated, removeVerificationCode,
    doesVerificationCodeMatches, getIdByUsername,
    getAllUsers, followUser, isUserFollowedByUser, unfollowUser, getFollowedByUser,
    getFollowersOfUser, getUserProfile, blockUser, unblockUser, isUserBlockedByUser,
    changePassword, isOldPasswordValid, updateUserPersonalData, updateAdministratorData,
    updateModeratorData, updateBusinessData, updateUserEmail, changeUserRoleType
}