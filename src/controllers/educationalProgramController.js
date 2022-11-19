const { getAllFacultyAvailables: getAllFacultyAvailablesDataAccess, getAllEducationalProgram: getAllEducationalProgramDataAccess, getAllRegion: getAllRegionDataAccess } = require("../dataaccess/educationalProgramDataAccess");
const { httpResponseInternalServerError, httpResponseOk } = require("../helpers/httpResponses");

const getAllEducationalProgram = async (request, response) => {
    let data = [];
    try {
        data = await getAllEducationalProgramDataAccess();
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, data);
};

const getAllFacultyAvailables = async (request, response) => {
    let data = [];
    try {
        data = await getAllFacultyAvailablesDataAccess();
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, data);
};

const getAllRegion = async (request, response) => {
    let data = [];
    try {
        data = await getAllRegionDataAccess();
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, data);
};

module.exports = { getAllEducationalProgram, getAllFacultyAvailables, getAllRegion }