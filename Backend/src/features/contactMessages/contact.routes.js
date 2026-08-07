const express = require("express");
const router = express.Router();
const contactController = require("./contact.controller");
const { requireAdminAuth } = require("../admin/admin.middleware");

// Public route to submit a message
router.post("/", contactController.submitMessage);

// Admin routes
router.get("/", requireAdminAuth, contactController.getAllMessages);
router.patch("/:id/status", requireAdminAuth, contactController.updateStatus);

module.exports = router;
