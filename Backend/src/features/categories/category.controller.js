const categoryModel = require("./category.model");

async function getCategories(req, res) {
    try {
        const categories = await categoryModel.getAllCategories();

        res.json(categories);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to retrieve categories",
        });
    }
}

function validateCategoryInput(req, res) {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
        res.status(400).json({
            message: "Category name is required",
        });
        return null;
    }

    if (!description || !description.trim()) {
        res.status(400).json({
            message: "Category description is required",
        });
        return null;
    }

    return {
        name: name.trim(),
        description: description.trim(),
    };
}

async function createCategory(req, res) {
    const categoryInput = validateCategoryInput(req, res);

    if (!categoryInput) {
        return;
    }

    try {
        const category = await categoryModel.createCategory(categoryInput);

        res.status(201).json(category);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to create category",
        });
    }
}

async function updateCategory(req, res) {
    const categoryInput = validateCategoryInput(req, res);

    if (!categoryInput) {
        return;
    }

    try {
        const category = await categoryModel.updateCategory(req.params.id, categoryInput);

        if (!category) {
            return res.status(404).json({
                message: "Category not found",
            });
        }

        return res.json(category);
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Failed to update category",
        });
    }
}

async function deleteCategory(req, res) {
    try {
        const categoryId = req.params.id;

        const category = await categoryModel.getCategoryById(categoryId);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        const productCount = await categoryModel.countProductsByCategoryId(categoryId);
        if (productCount > 0) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete this category because it contains products. Please reassign or delete the products first.",
            });
        }

        const deleted = await categoryModel.deleteCategory(categoryId);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        return res.json({
            success: true,
            message: "Category deleted successfully",
        });
    } catch (error) {
        console.error(error);

        if (error.code === "23503") {
            return res.status(400).json({
                success: false,
                message: "Cannot delete this category because it contains products.",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to delete category",
        });
    }
}

module.exports = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
};
