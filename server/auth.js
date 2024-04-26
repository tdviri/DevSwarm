const jwt = require("jsonwebtoken");
require('dotenv').config();

function authManager() {
    try {
        const token = req.cookies.token; 
        if (!token) {
            return res.status(401).json({ errorMessage: "Unauthorized" });
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = verified.userId; // SEND ON THE USER INFO
        next(); // NOW EXCECUTE CONTROLLER CODE (OR THE NEXT MIDDLEWARE)
    } 
    catch (err) {
        return res.status(401).json({ errorMessage: "Unauthorized" });
    }
}

const auth = authManager();
module.exports = auth;
