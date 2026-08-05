const express = require("express");

const router = express.Router();

const categoryController = require("./category.controller");
const { requireAdminAuth } = require("../admin/admin.middleware");

router.get("/", categoryController.getCategories);
router.post("/", requireAdminAuth, categoryController.createCategory);
router.put("/:id", requireAdminAuth, categoryController.updateCategory);
router.delete("/:id", requireAdminAuth, categoryController.deleteCategory);

module.exports = router;
