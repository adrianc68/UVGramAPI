const { httpResponseValidation } = require('../../helpers/httpResponses');
const { validatePostFileData, validatePostDescriptionData, validatePostCommentsAllowed, validatePostLikesAllowed, validatePostUUID } = require('./formatValidator');

const formatValidationPostData = [
    validatePostFileData,
    validatePostDescriptionData,
    validatePostCommentsAllowed,
    validatePostLikesAllowed,
    (request, response, next) => {
        return httpResponseValidation(request, response, next);
    }
];

const formatValidationUUIDPostData = [
    validatePostUUID,
    (request, response, next) => {
        return httpResponseValidation(request, response, next);
    }
];

module.exports = {
    formatValidationPostData, formatValidationUUIDPostData
}
