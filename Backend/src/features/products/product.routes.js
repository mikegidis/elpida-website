const express = require("express");

const router = express.Router();

const productController = require("./product.controller");
const { requireAdminAuth } = require("../admin/admin.middleware");

router.get("/", (req, res, next) => {
    if (req.query.admin === "true") {
        return requireAdminAuth(req, res, next);
    }

    return next();
}, productController.getProducts);
router.post("/", requireAdminAuth, productController.createProduct);
router.put("/:id", requireAdminAuth, productController.updateProduct);
router.delete("/:id", requireAdminAuth, productController.deleteProduct);

module.exports = router;
