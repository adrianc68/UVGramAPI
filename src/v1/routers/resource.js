const router = require('express').Router();
const {getFileFromURL} = require('../controllers/fileController');

router.get("/resources/post-files?:data",
	getFileFromURL
);

module.exports = router;
