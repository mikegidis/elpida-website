const orderService = require("./order.service");

async function createOrder(req, res) {
    try {
        const { customer_name, phone, email, notes, items } = req.body;

        const result = await orderService.placeOrder({
            customerName: customer_name,
            phone,
            email,
            notes,
            items,
        });

        if (result.error) {
            if (result.validation) {
                return res.status(400).json({
                    success: false,
                    message: result.message,
                });
            }
            return res.status(500).json({
                success: false,
                message: result.message,
            });
        }

        return res.status(201).json({
            success: true,
            message: "Order submitted successfully.",
            data: {
                order_id: result.orderId,
            },
        });

    } catch (error) {
        console.error("Order Controller Post Error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to submit order.",
        });
    }
}

async function getOrders(req, res) {
    try {
        const orders = await orderService.getOrdersList();

        return res.status(200).json({
            success: true,
            count: orders.length,
            data: orders,
        });
    } catch (error) {
        console.error("Order Controller Get All Error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to retrieve orders.",
        });
    }
}

async function getOrder(req, res) {
    try {
        const orderId = parseInt(req.params.id, 10);
        
        if (isNaN(orderId) || orderId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID.",
            });
        }

        const order = await orderService.getOrderDetail(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found.",
            });
        }

        return res.status(200).json({
            success: true,
            data: order,
        });
    } catch (error) {
        console.error("Order Controller Get Single Error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to retrieve order details.",
        });
    }
}

async function updateStatus(req, res) {
    try {
        const orderId = parseInt(req.params.id, 10);
        const { status } = req.body;
        
        const result = await orderService.updateOrderStatus(orderId, status);
        
        if (result.error) {
            return res.status(400).json({
                success: false,
                message: result.message,
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
        });
    } catch (error) {
        console.error("Order Controller Update Status Error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to update order status.",
        });
    }
}

module.exports = {
    createOrder,
    getOrders,
    getOrder,
    updateStatus,
};
