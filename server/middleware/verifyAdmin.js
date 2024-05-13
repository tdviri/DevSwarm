async function verifyAdmin(req, res, next) {
    try {
        if (req.isAdmin){next()};
    } catch(err){
        res.status(403).json({ errorMessage: "Access denied. Admin privileges required." });
    }
}

module.exports = adminVerification;