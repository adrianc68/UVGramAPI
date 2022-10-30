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
            expiresIn: '600s'
        }
    );
}

const verifyToken = async (token) => {
    token = await token.replace("Bearer ", ""); 
    const tokenVerified = jwt.verify(token, process.env.TOKEN_SECRET);
    return tokenVerified;
}

module.exports = { generateAccessToken, verifyToken }