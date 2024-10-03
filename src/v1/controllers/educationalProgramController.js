const {OK, INTERNAL_SERVER_ERROR} = require("../../services/httpResponsesService");
const {getAllFacultyAvailables: getAllFacultyAvailablesDataAccess, getAllEducationalProgram: getAllEducationalProgramDataAccess, getAllRegion: getAllRegionDataAccess, addRegion, addFacultyToRegion, addEducationalProgramToFaculty} = require("../../dataaccess/educationalProgramDataAccess");
const {apiVersionType} = require("../../types/apiVersionType");
const MessageType = require("../../types/MessageType");

const getAllEducationalProgram = async (request, response) => {
	let data = [];
	try {
		data = await getAllEducationalProgramDataAccess();
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	let messageType;
	if(!data) {
		messageType = MessageType.USER.DATA_NOT_FOUND;
	} else {
		messageType = MessageType.USER.DATA_FOUND;
	}
	let message = {...messageType, faculties: data}
	return OK(response, message, apiVersionType.V1);
};

const getAllFacultyAvailables = async (request, response) => {
	let data = [];
	try {
		data = await getAllFacultyAvailablesDataAccess();
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	let messageType;
	if(!data) {
		messageType = MessageType.USER.DATA_NOT_FOUND;
	} else {
		messageType = MessageType.USER.DATA_FOUND;
	}
	let message = {...messageType, faculties: data}
	return OK(response, message, apiVersionType.V1);
};

const getAllRegion = async (request, response) => {
	let data = [];
	try {
		data = await getAllRegionDataAccess();
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	let message = {...MessageType.USER.DATA_FOUND, regions: data}
	return OK(response, message, apiVersionType.V1);
};

const addNewRegion = async (request, response) => {
	let isRegistered = false;
	let {region} = request.body;
	try {
		isRegistered = await addRegion(region);
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	return OK(response, {isRegistered}, apiVersionType.V1);
}

const addNewFacultyToRegion = async (request, response) => {
	let isRegistered = false;
	let {idRegion, faculty} = request.body;
	try {
		isRegistered = await addFacultyToRegion(faculty, idRegion);
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	return OK(response, {isRegistered}, apiVersionType.V1);
}

const addNewEducationalProgramToFaculty = async (request, response) => {
	let isRegistered = false;
	let {idFaculty, educationalProgram} = request.body;
	try {
		isRegistered = await addEducationalProgramToFaculty(educationalProgram, idFaculty);
	} catch (error) {
		return INTERNAL_SERVER_ERROR(response, error, apiVersionType.V1);
	}
	return OK(response, {isRegistered}, apiVersionType.V1);
}

module.exports = {getAllEducationalProgram, getAllFacultyAvailables, getAllRegion, addNewRegion, addNewFacultyToRegion, addNewEducationalProgramToFaculty}
