const { getDataURLRecover } = require("../dataaccess/urlRecoverDataAccess");
const { httpResponseForbidden } = require("../helpers/httpResponses");

const validationURLRecover = async (request, response, next) => {
    let uri = request.query;
    let result;
    try {
        result = await getDataURLRecover(uri);
        response.locals.data = result;
    } catch (error) {
        return httpResponseForbidden(response, "URL is not found");
    }
    if(!result) {
        return httpResponseForbidden(response, "URL has expired");
    }
    return next();
};


module.exports = { validationURLRecover }