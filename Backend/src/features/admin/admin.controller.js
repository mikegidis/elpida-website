const { signToken } = require("./admin.jwt");

const getAdminCredentials = () => ({
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "admin123"
});

const login = (req, res) => {
    const { username, password } = req.body;
    const admin = getAdminCredentials();

    if (username !== admin.username || password !== admin.password) {
        return res.status(401).json({
            message: "Invalid admin credentials"
        });
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
