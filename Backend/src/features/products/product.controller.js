const productService = require("./product.service");

async function getProducts(req, res) {
    try {
        const products = await productService.getAllProducts();

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

module.exports = {
    getProducts,
};
