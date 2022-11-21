const { sequelize } = require("../database/connectionDatabaseSequelize");
const { URLRecover } = require("../models/URLRecover");
const { v4: uuidv4 } = require("uuid");
const { ActionURLRecoverType } = require("../models/enum/ActionURLRecoverType");
const { encryptAES, decryptAES } = require("../helpers/aes-encryption");

/**
 * Generate a URL as verification that will be send to an email
 * This creates an URL and a row in database, the URL contains 
 * id_user, newEmail and UUID encrypted with AES.
 * @param {*} id_user the userID who need change email
 * @param {*} newEmail the newEmail which will replace the old one.
 * @param {*} address address that contain ip and port like http://127.0.0.1:8080
 * @returns 
 */
const generateURLChangeEmailConfirmation = async (id_user, newEmail, address, token) => {
    let url;
    const t = await sequelize.transaction();
    let data;
    try {
        data = await URLRecover.create({
            uuid: uuidv4(),
            action: ActionURLRecoverType.CONFIRM_EMAIL,
            id_user,
            token
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

const getDataURLRecover = async (uri) => {
    let dataURL;
    try {
        const uuid = decryptAES(decodeURIComponent(uri.uuid));
        const idUser = decodeURIComponent(uri.id);
        const data = decryptAES(decodeURIComponent(uri.data));
        let result = await URLRecover.findOne({ where: { id_user: idUser, uuid }, raw: true });
        if (result) {
            dataURL = {
                result,
                data
            }
        }
    } catch (error) {
        throw new Error(error);
    }
    return dataURL;
}

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

const removeURLChangeEmailConfirmation = async (uuid) => {
    let isRemoved = false;
    const t = await sequelize.transaction();
    try {
        let result = await URLRecover.destroy({ where: { uuid }, transaction: t });
        await t.commit();
        if (result == 1) {
            isRemoved = true;
        }
    } catch (error) {
        await t.rollback()
        throw new Error(error);
    }
    return isRemoved;
}



module.exports = {
    generateURLChangeEmailConfirmation, getDataURLRecover, doesURLChangeEmailConfirmationAlreadyGenerated,
    removeURLChangeEmailConfirmation
}