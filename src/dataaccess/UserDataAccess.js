const { Op } = require("sequelize");
const { sequelize } = require("../database/connectionDatabaseSequelize");
const { encondePassword, encodeStringSHA256 } = require("../helpers/cipher");
const { generateRandomCode } = require("../helpers/generateCode");
const { Account } = require("../models/Account");
const { AccountVerification } = require("../models/AccountVerification");
const { PersonalUserRole } = require("../models/PersonalUserRole");
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
        attributes: ["id", "username"],
        include: [{
            model: Account,
            attributes: ["password"],
            include: [{
                model: AccountVerification,
                attributes: ["account_status"]
            }]
        }, {
            model: UserRole,
            attributes: ["role"]
        }],
        plain: true,
        raw: true
    });
    return user;
};

/**
 * Get user, account data from database using id
 * @param {*} id the user's id.
 * @returns undefined or the user data retrieved from database.
 */
const getAccountLoginDataById = async (id) => {
    const user = await User.findAll({
        where: {
            id
        },
        attributes: ["id", "username"],
        include: [{
            model: Account,
            attributes: ["password"]
        }, {
            model: UserRole,
            attributes: ["role"]
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
        }).then((rowDeleted) => {
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
            verification_code: generateRandomCode(8),
            username: encodeStringSHA256(username)
        }, { transaction: t });
        await t.commit();
    } catch (error) {
        await t.rollback();
        throw new Error(error);
    }
    return verificationData.verification_code;
};

/**
 * Check if verification code is generated.
 * @param {*} username the username that generated the verification code.
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
 * @param {*} username the username that generated verification code.
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
            verification_code: verificationCode
        }
    });
    doesMatches = (verificationData.length != 0);
    return doesMatches;
};

module.exports = {
    getAccountLoginData, isUsernameRegistered, isEmailRegistered,
    getAccountLoginDataById, deleteUserByUsername, createUser,
    generateCodeVerification, isVerificationCodeGenerated, removeVerificationCode,
    doesVerificationCodeMatches
}