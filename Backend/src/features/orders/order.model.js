const pool = require("../../config/database");

async function getDbClient() {
    return await pool.connect();
}

/**
 * Retrieves details for a specific variant.
 * Uses SELECT ... FOR UPDATE when a client transaction is active to prevent race conditions.
 */
async function getVariantDetails(client, variantId, forUpdate = false) {
    const lockClause = forUpdate ? "FOR UPDATE" : "";
    const result = await client.query(`
        SELECT pv.id, pv.price, pv.stock_quantity, pv.is_active, p.name as product_name, pv.variant_name
        FROM product_variants pv
        JOIN products p ON pv.product_id = p.id
        WHERE pv.id = $1
        ${lockClause};
    `, [variantId]);
    return result.rows[0];
}

async function createOrder(client, { customerName, phone, email, notes }) {
    const result = await client.query(`
        INSERT INTO orders (customer_name, phone, email, notes, status, created_at)
        VALUES ($1, $2, $3, $4, 'pending', NOW())
        RETURNING id;
    `, [customerName, phone, email || null, notes || null]);
    return result.rows[0].id;
}

async function createOrderItem(client, orderId, { variantId, quantity, price }) {
    await client.query(`
        INSERT INTO order_items (order_id, product_variant_id, quantity, price)
        VALUES ($1, $2, $3, $4);
    `, [orderId, variantId, quantity, price]);
}

async function updateVariantStock(client, variantId, quantityToDeduct) {
    await client.query(`
        UPDATE product_variants
        SET stock_quantity = stock_quantity - $1
        WHERE id = $2;
    `, [quantityToDeduct, variantId]);
}

async function getAllOrders() {
    const result = await pool.query(`
        SELECT 
            o.id,
            o.customer_name,
            o.phone,
            o.email,
            o.notes,
            o.status,
            o.created_at,
            COALESCE(SUM(oi.quantity), 0)::integer AS items_count
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        GROUP BY o.id
        ORDER BY o.created_at DESC;
    `);
    return result.rows;
}

async function getOrderWithItems(orderId) {
    const orderResult = await pool.query(`
        SELECT id, customer_name, phone, email, notes, status, created_at
        FROM orders
        WHERE id = $1;
    `, [orderId]);

    if (orderResult.rows.length === 0) {
        return null;
    }

    const itemsResult = await pool.query(`
        SELECT 
            oi.id,
            oi.quantity,
            oi.price::float AS price_at_order,
            pv.variant_name,
            p.name AS product_name
        FROM order_items oi
        JOIN product_variants pv ON oi.product_variant_id = pv.id
        JOIN products p ON pv.product_id = p.id
        WHERE oi.order_id = $1
        ORDER BY oi.id ASC;
    `, [orderId]);

    return {
        ...orderResult.rows[0],
        items: itemsResult.rows
    };
}

module.exports = {
    getDbClient,
    getVariantDetails,
    createOrder,
    createOrderItem,
    updateVariantStock,
    getAllOrders,
    getOrderWithItems,
};
