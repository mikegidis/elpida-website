const crypto = require("crypto");

const base64UrlEncode = (value) => {
    const input = typeof value === "string" ? value : JSON.stringify(value);
    return Buffer.from(input)
        .toString("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
};

const base64UrlDecode = (value) => {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
    return Buffer.from(padded, "base64").toString("utf8");
};

const getSecret = () => {
    return process.env.ADMIN_JWT_SECRET || "development-admin-secret-change-me";
};

const signToken = (payload, expiresInSeconds = 60 * 60 * 8) => {
    const now = Math.floor(Date.now() / 1000);
    const header = {
        alg: "HS256",
        typ: "JWT"
    };
    const tokenPayload = {
        ...payload,
        iat: now,
        exp: now + expiresInSeconds
    };

    const encodedHeader = base64UrlEncode(header);
    const encodedPayload = base64UrlEncode(tokenPayload);
    const data = `${encodedHeader}.${encodedPayload}`;
    const signature = crypto
        .createHmac("sha256", getSecret())
        .update(data)
        .digest("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");

    return `${data}.${signature}`;
};

const verifyToken = (token) => {
    const [encodedHeader, encodedPayload, signature] = token.split(".");

    if (!encodedHeader || !encodedPayload || !signature) {
        throw new Error("Invalid token");
    }

    const data = `${encodedHeader}.${encodedPayload}`;
    const expectedSignature = crypto
        .createHmac("sha256", getSecret())
        .update(data)
        .digest("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");

    const provided = Buffer.from(signature);
    const expected = Buffer.from(expectedSignature);

    if (provided.length !== expected.length || !crypto.timingSafeEqual(provided, expected)) {
        throw new Error("Invalid token signature");
    }

    const payload = JSON.parse(base64UrlDecode(encodedPayload));
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
        throw new Error("Token expired");
    }

    return payload;
};

module.exports = {
    signToken,
    verifyToken
};
