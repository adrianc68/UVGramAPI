const { getAllEducationalProgram, getAllFacultyAvailables, getAllRegion } = require('../controllers/educationalProgramController');
const router = require('express').Router();

router.get("/data/faculty/",
    getAllFacultyAvailables
);

router.get("/data/educationalprogram/",
    getAllEducationalProgram
);

router.get("/data/region/",
    getAllRegion
);

module.exports = router;