const pool = require("../../config/database");

async function getAllVariantsForAdmin() {
    const result = await pool.query(`
        SELECT
            pv.id,
            pv.product_id,
            p.name AS product_name,
            pv.variant_name,
            pv.price,
            pv.stock_quantity,
            pv.is_active,
            COUNT(oi.id)::int AS order_count
        FROM product_variants pv
        INNER JOIN products p ON pv.product_id = p.id
        LEFT JOIN order_items oi ON oi.product_variant_id = pv.id
        GROUP BY pv.id, p.name
        ORDER BY p.name ASC, pv.price ASC;
    `);

    return result.rows;
}

async function createVariant({ product_id, variant_name, price, stock_quantity, is_active }) {
    const result = await pool.query(`
        INSERT INTO product_variants (product_id, variant_name, price, stock_quantity, is_active)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, product_id, variant_name, price, stock_quantity, is_active;
    `, [product_id, variant_name, price, stock_quantity, is_active]);

    return result.rows[0];
}

async function updateVariant(id, { product_id, variant_name, price, stock_quantity, is_active }) {
    const result = await pool.query(`
        UPDATE product_variants
        SET product_id = $1,
            variant_name = $2,
            price = $3,
            stock_quantity = $4,
            is_active = $5
        WHERE id = $6
        RETURNING id, product_id, variant_name, price, stock_quantity, is_active;
    `, [product_id, variant_name, price, stock_quantity, is_active, id]);

    return result.rows[0] || null;
}

async function setVariantStatus(id, isActive) {
    const result = await pool.query(`
        UPDATE product_variants
        SET is_active = $1
        WHERE id = $2
        RETURNING id, product_id, variant_name, price, stock_quantity, is_active;
    `, [isActive, id]);

    return result.rows[0] || null;
}

async function getVariantById(id) {
    const result = await pool.query(`
        SELECT id, product_id, variant_name, price, stock_quantity, is_active
        FROM product_variants
        WHERE id = $1;
    `, [id]);

    return result.rows[0] || null;
}

async function countOrdersByVariantId(variantId) {
    const result = await pool.query(`
        SELECT COUNT(id)::int AS count
        FROM order_items
        WHERE product_variant_id = $1;
    `, [variantId]);

    return result.rows[0].count;
}

async function deleteVariant(id) {
    const result = await pool.query(`
        DELETE FROM product_variants
        WHERE id = $1
        RETURNING id;
    `, [id]);

    return result.rowCount > 0;
}

module.exports = {
    getAllVariantsForAdmin,
    getVariantById,
    countOrdersByVariantId,
    createVariant,
    updateVariant,
    setVariantStatus,
    deleteVariant,
};

