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

const getAccountLoginData = async (emailOrUsername) => {
    const user = await User.findAll({
        where: {
            [Op.or]: [{ username: emailOrUsername }, { '$Account.email$': emailOrUsername }]
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
}

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
}

const isUsernameRegistered = async (username) => {
    let isUsernameRegistered = false;
    const user = await User.findAll({
        where: { username }
    });
    isUsernameRegistered = (user.length != 0);
    return isUsernameRegistered;
}

const isEmailRegistered = async (email) => {
    let isEmailRegistered = false;
    const account = await Account.findAll({
        where: { email }
    });
    isEmailRegistered = (account.length != 0);
    return isEmailRegistered;
}

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
}

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
}

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
}

const isVerificationCodeGenerated = async (username) => {
    let isCodeGenerated = false;
    let verificationData = await VerificationCode.findAll({
        where: {
            username: encodeStringSHA256(username)
        }
    });
    isCodeGenerated = (verificationData.length != 0);
    return isCodeGenerated;
}

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
}

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
}

module.exports = {
    getAccountLoginData, isUsernameRegistered, isEmailRegistered,
    getAccountLoginDataById, deleteUserByUsername, createUser,
    generateCodeVerification, isVerificationCodeGenerated, removeVerificationCode,
    doesVerificationCodeMatches
}