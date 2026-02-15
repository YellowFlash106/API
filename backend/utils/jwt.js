const jwt = require("jsonwebtoken");

exports.generateToken = (user) => {
    return jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || "dev-secret",
        { expiresIn: "1d" }
    );
};