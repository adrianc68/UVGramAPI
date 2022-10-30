const jwt = require('jsonwebtoken')

const generateAccessToken = async (username, userID, userRole) => {
    return jwt.sign(
        {
            username,
            userID,
            userRole
        },
        process.env.TOKEN_SECRET,
        {
            expiresIn: '3600s'
        }
    );
}

module.exports = { generateAccessToken }