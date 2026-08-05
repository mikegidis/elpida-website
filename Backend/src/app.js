require("dotenv").config();

const express = require("express");
const cors = require("cors");
const categoryRoutes = require("./features/categories/category.routes");
const productRoutes = require("./features/products/product.routes");
const orderRoutes = require("./features/orders/order.routes");
const adminRoutes = require("./features/admin/admin.routes");
const app = express();

// Allow requests from the frontend
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "Elpida Backend API is running!"
    });
});
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/admin", adminRoutes);
module.exports = app;
