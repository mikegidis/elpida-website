const { verifyToken } = require("./admin.jwt");

const requireAdminAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.slice("Bearer ".length)
        : null;

    if (!token) {
        return res.status(401).json({
            message: "Admin authentication required"
        });
    }

    try {
        req.admin = verifyToken(token);
        return next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired admin token"
        });
    }
};

module.exports = {
    requireAdminAuth
};
