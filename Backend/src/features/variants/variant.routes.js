const express = require("express");
const router = express.Router();
const variantController = require("./variant.controller");
const { requireAdminAuth } = require("../admin/admin.middleware");

router.get("/", (req, res, next) => {
    if (req.query.admin === "true") {
        return requireAdminAuth(req, res, next);
    }
    return requireAdminAuth(req, res, next); // Variants are admin only for now, since they are displayed via products for customers
}, variantController.getVariants);

router.post("/", requireAdminAuth, variantController.createVariant);
router.put("/:id", requireAdminAuth, variantController.updateVariant);
router.patch("/:id/status", requireAdminAuth, variantController.toggleVariantStatus);
router.delete("/:id", requireAdminAuth, variantController.deleteVariant);

module.exports = router;
