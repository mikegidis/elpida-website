const express = require("express");

const router = express.Router();

const adminController = require("./admin.controller");
const { requireAdminAuth } = require("./admin.middleware");
const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: { message: "Too many login attempts from this IP, please try again after 15 minutes" },
    standardHeaders: true,
    legacyHeaders: false,
});

router.post("/login", loginLimiter, adminController.login);
router.get("/me", requireAdminAuth, adminController.me);

module.exports = router;
