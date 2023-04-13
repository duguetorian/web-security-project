const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT;


exports.verifyToken = (req) => {
    const token = req.headers?.authorization;
    const username = req.headers?.username;
    if (!token || !username) {
        return false;
    }
    try {
        const verify = jwt.verify(token, JWT_SECRET);
        return (verify && verify.type === 'user' && verify.username === username)
    } catch (error) {
        console.log(JSON.stringify(error), "error");
        return false;
    }
}
