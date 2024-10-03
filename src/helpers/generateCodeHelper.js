const {v4: uuidv4} = require("uuid");
/**
 * Generate random code.
 * Max 64 characters allowed
 * @param {*} maxCharacters 64 max characters allowed.
 * @returns random code as String
 */
const generateUUIDv4 = () => {
	return uuidv4();
};

module.exports = {generateUUIDv4}
