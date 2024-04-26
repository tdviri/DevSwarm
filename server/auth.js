const jwt = require("jsonwebtoken");

function authManager() {
    verify = function (req, res, next) {
    const token = req.cookies.token;
    const verified = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = verified.userId; // SEND ON THE USER INFO
    // DO ADDITIONAL AUTHORIZATION CHECKS
    next(); // NOW EXCECUTE CONTROLLER CODE (OR THE NEXT MIDDLEWARE)
    }
    return this;
}

const auth = authManager();
module.exports = auth;