const express = require("express");
const router = express.Router();
const settingsController = require("./settings.controller");
const { requireAdminAuth } = require("../admin/admin.middleware");

// Public route to get settings (used by customer website and admin panel)
router.get("/", settingsController.getSettings);

// Protected route to update settings (requires admin authentication)
router.put("/", requireAdminAuth, settingsController.updateSettings);

module.exports = router;
