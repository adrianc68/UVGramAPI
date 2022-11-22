const { sequelize } = require("../database/connectionDatabaseSequelize");
const { URLRecover } = require("../models/URLRecover");
const { v4: uuidv4 } = require("uuid");
const { ActionURLRecoverType } = require("../models/enum/ActionURLRecoverType");
const { encryptAES, decryptAES } = require("../helpers/aes-encryption");
const { logger } = require("../helpers/logger");

/**
 * Generate a URL as verification that will be send to an email
 * This creates an URL and a row in database, the URL contains 
 * id_user, newEmail and UUID encrypted with AES.
 * @param {*} id_user the userID who need change email
 * @param {*} newEmail the newEmail which will replace the old one.
 * @param {*} address address that contain ip and port e.g. http://127.0.0.1:8080
 * @returns url or null
 */
const generateURLChangeEmailConfirmation = async (id_user, newEmail, address) => {
    let url;
    const t = await sequelize.transaction();
    let data;
    try {
        data = await URLRecover.create({
            uuid: uuidv4(),
            action: ActionURLRecoverType.CONFIRM_EMAIL,
            id_user,
        }, { transaction: t });
        let payload = { newEmail: newEmail }
        url = `${address}/accounts/verification/url/${encodeURIComponent(ActionURLRecoverType.CONFIRM_EMAIL.toLowerCase())}?uuid=${encodeURIComponent(encryptAES(data.uuid))}&id=${encodeURIComponent(id_user)}&data=${encodeURIComponent(encryptAES(JSON.stringify(payload)))}`;
        await t.commit();
    } catch (error) {
        await t.rollback();
        throw new Error(error);
    }
    return url;
}

/**
 * Remove URL Verification by user ID
 * @param {*} id_user the user id to remove the URL verification
 * @returns true if was removed otherwise false
 */
const removeURLChangeEmailConfiguration = async (id_user) => {
    let isRemoved = false;
    const t = await sequelize.transaction();
    try {
        let data = await URLRecover.destroy({
            where: { id_user }
        }, { transaction: t });
        await t.commit();
        if (data == 1) {
            isRemoved = true;
        }
    } catch (error) {
        await t.rollback();
        throw new Error(error);
    }
    return isRemoved;
}

/**
 * Decode URL Data and retrieve data from database
 * @param {*} uri the uri to retrieve and deocde
 * @returns JSON that contains uuid, idUser, data and URLRecover data schema.
 */
const getDataURLRecover = async (uri) => {
    let dataURL;
    try {
        const uuid = decryptAES(decodeURIComponent(uri.uuid));
        const idUser = decodeURIComponent(uri.id);
        const data = JSON.parse(decryptAES(decodeURIComponent(uri.data)));
        let result = await URLRecover.findOne({ where: { id_user: idUser, uuid }, raw: true });
        if (result) {
            dataURL = { ...data, ...result };
        }
    } catch (error) {
        throw new Error(error);
    }
    return dataURL;
}

/**
 * Check if URL Verification was generated before by id_user
 * @param {*} id_user the user id which need to be verified.
 * @returns true is already generated otherwise false.
 */
const doesURLChangeEmailConfirmationAlreadyGenerated = async (id_user) => {
    let isAlreadyGenerated = false;
    try {
        let result = await URLRecover.findOne({ where: { id_user }, raw: true });
        isAlreadyGenerated = (result != null);
    } catch (error) {
        throw new Error(error);
    }
    return isAlreadyGenerated;
}


module.exports = {
    generateURLChangeEmailConfirmation, getDataURLRecover, doesURLChangeEmailConfirmationAlreadyGenerated,
    removeURLChangeEmailConfiguration
}