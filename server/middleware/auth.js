const jwt = require("jsonwebtoken");
const User = require('../models/users');
require('dotenv').config();

async function authManager(req, res, next) {
    console.log("authorizing...")
    console.log("req: ", req.cookies.token);
    try {
        const token = req.cookies.token; 
        if (!token) {
            return res.status(401).json({ errorMessage: "Unauthorized" });
        }
        const decoded = jwt.verify(token, 'JWT$3cr3tKey!#2024');
        req.user = decoded;
        req.userId = decoded.userId; // SEND ON THE USER INFO
        const user = await User.findById(req.userId);
        req.username = user.username;
        next(); // NOW EXCECUTE CONTROLLER CODE (OR THE NEXT MIDDLEWARE)
    } 
    catch (err) {
        return res.status(401).json({ errorMessage: "Unauthorized" });
    }
}

module.exports = authManager; 