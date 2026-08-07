const express = require("express");

const router = express.Router();

const orderController = require("./order.controller");
const { requireAdminAuth } = require("../admin/admin.middleware");

router.post("/", orderController.createOrder);

router.get("/", (req, res, next) => {
    if (req.query.admin === "true") {
        return requireAdminAuth(req, res, next);
    }
    return requireAdminAuth(req, res, next); // Orders are admin only to view
}, orderController.getOrders);

router.get("/:id", requireAdminAuth, orderController.getOrder);
router.put("/:id/status", requireAdminAuth, orderController.updateStatus);

module.exports = router;
