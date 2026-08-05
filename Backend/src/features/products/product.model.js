const pool = require("../../config/database");

async function getAllActiveProducts() {
    const result = await pool.query(`
        SELECT
            p.id AS product_id,
            p.name AS product_name,
            p.description AS product_description,
            p.image_url,
            c.id AS category_id,
            c.name AS category_name,
            pv.id AS variant_id,
            pv.variant_name,
            pv.price,
            pv.stock_quantity
        FROM products p
        INNER JOIN categories c ON p.category_id = c.id
        LEFT JOIN product_variants pv
            ON pv.product_id = p.id
            AND pv.is_active = true
        WHERE p.is_active = true
        ORDER BY p.name ASC, pv.price ASC;
    `);

    return result.rows;
}

module.exports = {
    getAllActiveProducts,
};
