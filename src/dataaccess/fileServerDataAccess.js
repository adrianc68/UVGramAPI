const { connectToFtpServer } = require("../database/connetionFtpServer");
const { logger } = require("../helpers/logger");
const fs = require('fs');

const saveFiles = async (files, idUser, idPost) => {
    const fileServerClient = await connectToFtpServer();
    await Promise.all(files.map(async function (file) {
        await file.mv(`./tmp/${file.filename}`).then((result) => {
            return fileServerClient.ensureDir(`/media/users/${idUser}/${idPost}`);
        }).then((result) => {
            return fileServerClient.uploadFrom(`./tmp/${file.filename}`, `/media/users/${idUser}/${idPost}/${file.filename}`);
        }).then(reslt => {
            fileServerClient.close();
            fs.unlinkSync(`./tmp/${file.filename}`);
        }).catch((error) => {
            throw error;
        });
    })).then((result) => {
        isCreated = true;
    }).catch((error) => {
        removeTempFile(files);
        throw error;
    });
}

const getFiles = async (idUser, idPost, filename, writeStream) => {
    const fileServerClient = await connectToFtpServer();
    try {
        await fileServerClient.ensureDir(`/media/users/${idUser}/${idPost}`);
        await fileServerClient.downloadTo(writeStream, `/media/users/${idUser}/${idPost}/${filename}`);
    } catch (error) {
        throw error;
    }
    fileServerClient.close();
};

const removeFile = async () => {

};

const removeTempFile = async (files) => {
    const fileServerClient = await connectToFtpServer();
    try {
        await Promise.all(files.map(async function (file) {
            if (file) {
                fs.unlink(`./tmp/${file.filename}`, async function (error) {
                    if (error) throw error;
                });
            }
        }));
    } catch (error) {
        throw error;
    }
};

module.exports = { getFiles, removeTempFile, saveFiles }