const pool = require("../../config/database");

async function getAllActiveProducts() {
    const result = await pool.query(`
        SELECT
            p.id AS product_id,
            p.name AS product_name,
            p.description AS product_description,
            p.image_url,
            p.is_active,
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

async function getAllProductsForAdmin() {
    const result = await pool.query(`
        SELECT
            p.id,
            p.name,
            p.description,
            p.image_url,
            p.is_active,
            c.id AS category_id,
            c.name AS category_name
        FROM products p
        INNER JOIN categories c ON p.category_id = c.id
        ORDER BY p.name ASC;
    `);

    return result.rows;
}

async function getProductById(id) {
    const result = await pool.query(`
        SELECT id, name, description, image_url, is_active, category_id
        FROM products
        WHERE id = $1;
    `, [id]);

    return result.rows[0] || null;
}

async function createProduct({ name, description, categoryId, imageUrl, isActive }) {
    const result = await pool.query(`
        INSERT INTO products (name, description, category_id, image_url, is_active)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, name, description, image_url, is_active, category_id;
    `, [name, description || null, categoryId, imageUrl || null, isActive]);

    return result.rows[0];
}

async function updateProduct(id, { name, description, categoryId, imageUrl, isActive }) {
    const result = await pool.query(`
        UPDATE products
        SET name = $1,
            description = $2,
            category_id = $3,
            image_url = $4,
            is_active = $5
        WHERE id = $6
        RETURNING id, name, description, image_url, is_active, category_id;
    `, [name, description || null, categoryId, imageUrl || null, isActive, id]);

    return result.rows[0] || null;
}

async function countOrdersByProductId(productId) {
    const result = await pool.query(`
        SELECT COUNT(oi.id)::int AS count
        FROM order_items oi
        INNER JOIN product_variants pv ON oi.product_variant_id = pv.id
        WHERE pv.product_id = $1;
    `, [productId]);

    return result.rows[0].count;
}

async function deleteProduct(id) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // Delete variants of this product first (verified to have no orders)
        await client.query(`
            DELETE FROM product_variants
            WHERE product_id = $1;
        `, [id]);

        const result = await client.query(`
            DELETE FROM products
            WHERE id = $1
            RETURNING id, image_url;
        `, [id]);

        await client.query("COMMIT");
        return result.rows[0] || null;
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

module.exports = {
    getAllActiveProducts,
    getAllProductsForAdmin,
    getProductById,
    countOrdersByProductId,
    createProduct,
    updateProduct,
    deleteProduct,
};

