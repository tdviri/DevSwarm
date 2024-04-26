const jwt = require("jsonwebtoken");
require('dotenv').config();

function authManager(req, res, next) {
    try {
        const token = req.cookies.token; 
        if (!token) {
            return res.status(401).json({ errorMessage: "Unauthorized" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        req.userId = decoded.userId; // SEND ON THE USER INFO
        next(); // NOW EXCECUTE CONTROLLER CODE (OR THE NEXT MIDDLEWARE)
    } 
    catch (err) {
        return res.status(401).json({ errorMessage: "Unauthorized" });
    }
}

module.exports = authManager; 