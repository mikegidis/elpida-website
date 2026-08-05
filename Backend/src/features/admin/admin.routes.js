const express = require("express");

const router = express.Router();

const adminController = require("./admin.controller");
const { requireAdminAuth } = require("./admin.middleware");

router.post("/login", adminController.login);
router.get("/me", requireAdminAuth, adminController.me);

module.exports = router;
