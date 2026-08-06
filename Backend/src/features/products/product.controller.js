const productService = require("./product.service");
const productModel = require("./product.model");

async function getProducts(req, res) {
    try {
        const products = req.query.admin === "true"
            ? await productService.getAdminProducts()
            : await productService.getAllProducts();

        res.json({
            success: true,
            count: products.length,
            data: products,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve products",
        });
    }
}

function validateProductInput(req, res) {
    const { name, description, category_id, categoryId, image_url, imageUrl, is_active, isActive } = req.body;
    const selectedCategoryId = category_id || categoryId;

    if (!name || !name.trim()) {
        res.status(400).json({
            success: false,
            message: "Product name is required",
        });
        return null;
    }

    if (!selectedCategoryId) {
        res.status(400).json({
            success: false,
            message: "Category is required",
        });
        return null;
    }

    return {
        name: name.trim(),
        description: description ? description.trim() : "",
        categoryId: Number(selectedCategoryId),
        imageUrl: image_url || imageUrl || "",
        isActive: typeof is_active === "boolean"
            ? is_active
            : typeof isActive === "boolean"
                ? isActive
                : true,
    };
}

async function createProduct(req, res) {
    const productInput = validateProductInput(req, res);

    if (!productInput) {
        return;
    }

    try {
        const product = await productModel.createProduct(productInput);

        return res.status(201).json({
            success: true,
            data: product,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to create product",
        });
    }
}

async function updateProduct(req, res) {
    const productInput = validateProductInput(req, res);

    if (!productInput) {
        return;
    }

    try {
        const product = await productModel.updateProduct(req.params.id, productInput);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        return res.json({
            success: true,
            data: product,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to update product",
        });
    }
}

async function deleteProduct(req, res) {
    try {
        const deleted = await productModel.deleteProduct(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        return res.json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete product",
        });
    }
}

module.exports = {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
};
