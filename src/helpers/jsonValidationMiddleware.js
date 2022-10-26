const { StatusCodes } = require("http-status-codes");

const handleJSON = (error, request, response, next) => {
    if (error.type === 'entity.parse.failed') {
        return response.status(StatusCodes.BAD_REQUEST).json({ message: "You have sent an invalid JSON" });
    } else {
        next(error);
    }
};

module.exports = { handleJSON }