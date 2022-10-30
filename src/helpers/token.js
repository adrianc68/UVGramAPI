const jwt = require('jsonwebtoken')

function generateAccessToken(username) {
    return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '3600s' });
}

// function authenticateToken(request, response, next) {
//     const authHeader = request.headers['authorization']
//     const token = authHeader && authHeader.split(' ')[1]
  
//     if (token == null) return res.sendStatus(401)
  
//     jwt.verify(token, process.env.TOKEN_SECRET as string, (err: any, user: any) => {
//       console.log(err)
  
//       if (err) return res.sendStatus(403)
  
//       request.user = user
  
//       next()
//     })
//   }