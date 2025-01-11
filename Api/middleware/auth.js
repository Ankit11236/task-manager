
const jwt = require('jsonwebtoken');


const SECRET = "secret";

function authenticate(req, res, next) { 
    const authorization = req.headers['authorization'];
    if (!authorization) {
        return res.status(401).json({ error: 'Token not provided' });
    }
    const [type, token] = authorization.split(' ');
    jwt.verify(token, SECRET, (err, decoded) => {
        console.log(err, decoded);
        if (err) {
            return res.status(401).json({ error: 'Token invalid' });
        }
        req.userId = decoded.userId;
        req.userRole = decoded.role; 
        next();
    });
}


module.exports = authenticate;
