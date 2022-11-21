const { getDataURLRecover } = require("../dataaccess/urlRecoverDataAccess");
const { httpResponseNotFound } = require("../helpers/httpResponses");
const { logger } = require("../helpers/logger");

const validationURLRecover = async (request, response, next) => {
    let uri = request.query;
    let result;
    try {
        result = await getDataURLRecover(uri);
        response.locals.data = result;
    } catch (error) {
        return httpResponseNotFound(response, "URL is not found");
    }
    if (!result) {
        return httpResponseNotFound(response, "URL has expired");
    }
    return next();
};


module.exports = { validationURLRecover }