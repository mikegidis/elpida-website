const { signToken } = require("./admin.jwt");
const bcrypt = require("bcrypt");

const getAdminCredentials = () => {
    const hash = process.env.ADMIN_PASSWORD_HASH;
    if (!hash) {
        console.warn("⚠️ WARNING: ADMIN_PASSWORD_HASH is not set in environment variables!");
    }
    return {
        username: process.env.ADMIN_USERNAME || "admin",
        passwordHash: hash
    };
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = getAdminCredentials();

        if (!admin.passwordHash) {
            return res.status(500).json({ message: "Server configuration error. Admin login disabled." });
        }

        if (username !== admin.username) {
            return res.status(401).json({ message: "Invalid admin credentials" });
        }

        const isMatch = await bcrypt.compare(password, admin.passwordHash);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid admin credentials" });
        }

        const token = signToken({
            role: "admin",
            username: admin.username
        });

        return res.json({
            token,
            admin: {
                username: admin.username,
                role: "admin"
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Internal server error during login" });
    }
};

const me = (req, res) => {
    return res.json({
        admin: {
            username: req.admin.username,
            role: req.admin.role
        }
    });
};

module.exports = {
    login,
    me
};
