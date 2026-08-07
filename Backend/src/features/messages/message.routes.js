const express = require("express");
const router = express.Router();
const messageController = require("./message.controller");
const { requireAdminAuth } = require("../admin/admin.middleware");

// Public route to submit a message
router.post("/", messageController.submitMessage);

// Admin routes
router.get("/", requireAdminAuth, messageController.getAllMessages);
router.get("/:id", requireAdminAuth, messageController.getMessage);
router.put("/:id/status", requireAdminAuth, messageController.updateStatus);

module.exports = router;
