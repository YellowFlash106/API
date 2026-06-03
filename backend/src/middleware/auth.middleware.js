const jwt = require("jsonwebtoken");

module.exports = (req, res, next) =>{
    const header = req.headers.authorization;
    if(!header) return res.status(401).send("No token");

    // Support both "Bearer <token>" and raw "<token>"
    const parts = header.trim().split(" ");
    const token = parts.length > 1 ? parts[1] : parts[0];

    try{
        req.user = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey");
        next();
    } catch (err) {
        console.error("JWT verification failed:", err.message);
        res.status(401).send("Invalid Token");
    }
}