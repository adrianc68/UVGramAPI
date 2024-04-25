const router = require('express').Router();
const { getFiles } = require('../../dataaccess/fileServerDataAccess');
const { getURLResourceData } = require('../../dataaccess/urlRecoverDataAccess');
const { httpResponseForbidden } = require('../../helpers/httpResponses');
const {CONFLICT} = require('../../services/httpResponsesService');
const {apiVersionType} = require('../../types/apiVersionType');
const MessageType = require('../../types/MessageType');
const {getFileFromURL} = require('../controllers/fileController');

router.get("/resources/post-files?:data",
	getFileFromURL
);

module.exports = router;
