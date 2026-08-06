const productModel = require("./product.model");

async function getAllProducts() {
    const rows = await productModel.getAllActiveProducts();

    const productsMap = new Map();

    for (const row of rows) {
        if (!productsMap.has(row.product_id)) {
            productsMap.set(row.product_id, {
                id: row.product_id,
                name: row.product_name,
                description: row.product_description,
                image_url: row.image_url,
                is_active: row.is_active,
                category: {
                    id: row.category_id,
                    name: row.category_name,
                },
                variants: [],
            });
        }

        if (row.variant_id) {
            productsMap.get(row.product_id).variants.push({
                id: row.variant_id,
                variant_name: row.variant_name,
                price: parseFloat(row.price),
                stock_quantity: row.stock_quantity,
            });
        }
    }

    return Array.from(productsMap.values());
}

async function getAdminProducts() {
    const rows = await productModel.getAllProductsForAdmin();

    return rows.map((row) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        image_url: row.image_url,
        is_active: row.is_active,
        category: {
            id: row.category_id,
            name: row.category_name,
        },
    }));
}

module.exports = {
    getAllProducts,
    getAdminProducts,
};
