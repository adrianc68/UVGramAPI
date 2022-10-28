const { createHash } = require('crypto');

// lines: array of strings
function encondeSHA256(lines) {
    const hash = createHash('sha256');
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line === '') continue;
        hash.write(line);
    }
    return hash.digest('hex');
}

function encondePassword(password) {
    return encondeSHA256(password);
}

module.exports = { encondePassword }