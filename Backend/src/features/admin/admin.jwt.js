const jwt = require("jsonwebtoken");

const getSecret = () => {
    const secret = process.env.ADMIN_JWT_SECRET;
    if (!secret) {
        // Enforce the presence of the secret for security
        console.warn("⚠️ WARNING: ADMIN_JWT_SECRET is not set in environment variables!");
        throw new Error("ADMIN_JWT_SECRET is not defined. Cannot sign or verify tokens.");
    }
    return secret;
};

const signToken = (payload, expiresInSeconds = 60 * 60 * 8) => {
    // expiresInSeconds is used as the 'expiresIn' option for jsonwebtoken
    const secret = getSecret();
    return jwt.sign(payload, secret, { expiresIn: expiresInSeconds });
};

const verifyToken = (token) => {
    const secret = getSecret();
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new Error("Token expired");
        }
        throw new Error("Invalid token signature");
    }
};

module.exports = {
    signToken,
    verifyToken
};
