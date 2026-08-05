const orderModel = require("./order.model");

// Simple regex for basic email format validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Allows digits, spaces, plus signs, hyphens, and parenthesis
const PHONE_REGEX = /^[0-9\s+\-()]{8,20}$/;

async function placeOrder({ customerName, phone, email, notes, items }) {
    // 1. Basic structural validations
    if (!customerName || typeof customerName !== "string" || !customerName.trim()) {
        return { error: true, validation: true, message: "Customer name is required." };
    }
    if (!phone || typeof phone !== "string" || !phone.trim()) {
        return { error: true, validation: true, message: "Phone number is required." };
    }
    if (!PHONE_REGEX.test(phone.trim())) {
        return { error: true, validation: true, message: "A valid phone number is required (8-20 characters)." };
    }
    if (email && (typeof email !== "string" || !EMAIL_REGEX.test(email.trim()))) {
        return { error: true, validation: true, message: "Please provide a valid email address." };
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
        return { error: true, validation: true, message: "At least one item is required." };
    }

    // 2. Validate items structure
    for (const item of items) {
        if (!item.variant_id || typeof item.variant_id !== "number") {
            return { error: true, validation: true, message: "Valid variant ID is required for all items." };
        }
        if (!item.quantity || typeof item.quantity !== "number" || item.quantity <= 0) {
            return { error: true, validation: true, message: "Quantity must be greater than 0." };
        }
    }

    let client;
    try {
        client = await orderModel.getDbClient();
        await client.query("BEGIN");

        const verifiedItems = [];

        // 3. Database validation per item with FOR UPDATE row locks to prevent race conditions
        for (const item of items) {
            const variant = await orderModel.getVariantDetails(client, item.variant_id, true);

            if (!variant) {
                await client.query("ROLLBACK");
                return { error: true, validation: true, message: `Variant with ID ${item.variant_id} does not exist.` };
            }

            if (!variant.is_active) {
                await client.query("ROLLBACK");
                return { error: true, validation: true, message: `Variant "${variant.product_name} - ${variant.variant_name}" is no longer active.` };
            }

            if (variant.stock_quantity < item.quantity) {
                await client.query("ROLLBACK");
                return { error: true, validation: true, message: `Insufficient stock for "${variant.product_name} - ${variant.variant_name}". Available: ${variant.stock_quantity}.` };
            }

            verifiedItems.push({
                variantId: item.variant_id,
                quantity: item.quantity,
                price: parseFloat(variant.price),
            });
        }

        // 4. Create Order
        const orderId = await orderModel.createOrder(client, {
            customerName: customerName.trim(),
            phone: phone.trim(),
            email: email ? email.trim() : null,
            notes: notes ? notes.trim() : null,
        });

        // 5. Create Order Items & Update Stock
        for (const item of verifiedItems) {
            await orderModel.createOrderItem(client, orderId, item);
            await orderModel.updateVariantStock(client, item.variantId, item.quantity);
        }

        await client.query("COMMIT");
        return { success: true, orderId };

    } catch (error) {
        if (client) {
            try {
                await client.query("ROLLBACK");
            } catch (rollbackError) {
                console.error("Rollback failed:", rollbackError);
            }
        }
        console.error("Order Transaction Error:", error);
        return { error: true, message: "Unable to submit order." };
    } finally {
        if (client) {
            client.release();
        }
    }
}

async function getOrdersList() {
    return await orderModel.getAllOrders();
}

async function getOrderDetail(orderId) {
    if (!orderId || isNaN(orderId)) {
        return null;
    }
    return await orderModel.getOrderWithItems(orderId);
}

module.exports = {
    placeOrder,
    getOrdersList,
    getOrderDetail,
};
