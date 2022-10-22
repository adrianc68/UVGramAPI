const crypto = require("crypto");

const generateRandomCode = (maxCharacters) => {
    const secret = Math.random().toString();
    const sha256hasher = crypto.createHmac("sha256", secret);
    const hash = sha256hasher.update("hellohowareyou").digest("hex");
    
    return hash.slice(0, maxCharacters);
}

module.exports = { generateRandomCode }