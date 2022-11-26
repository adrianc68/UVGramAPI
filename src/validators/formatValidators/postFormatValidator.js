const { httpResponseValidation } = require('../../helpers/httpResponses');
const { validatePostFileData, validatePostDescriptionData, validatePostCommentsAllowed, validatePostLikesAllowed } = require('./formatValidator');

const formatValidationPostData = [
    validatePostFileData,
    validatePostDescriptionData,
    validatePostCommentsAllowed,
    validatePostLikesAllowed,
    (request, response, next) => {
        return httpResponseValidation(request, response, next);
    }
];

module.exports = {
    formatValidationPostData
}
