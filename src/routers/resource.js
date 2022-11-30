const router = require('express').Router();
const fs = require('fs');
const { getFiles } = require('../dataaccess/fileServerDataAccess');
const { getResourceGetURL } = require('../dataaccess/urlRecoverDataAccess');
const { httpResponseInternalServerError, httpResponseForbidden } = require('../helpers/httpResponses');
const { logger } = require('../helpers/logger');

router.get("/resources/post-files?:data",
    async function (request, response, next) {
        let url = request.query;
        try {
            await getResourceGetURL(url).then(result => {
                if(result) {
                    getFiles(result.idUser, result.idPost, result.filename, response, result.contentType);
                }
            })
        } catch (error) {
            return httpResponseForbidden(response, "URL does not exist");
        }
    }
);

module.exports = router;