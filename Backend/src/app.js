require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const categoryRoutes = require("./features/categories/category.routes");
const productRoutes = require("./features/products/product.routes");
const orderRoutes = require("./features/orders/order.routes");
const adminRoutes = require("./features/admin/admin.routes");
const variantRoutes = require("./features/variants/variant.routes");
const uploadRoutes = require("./features/uploads/upload.routes");
const messageRoutes = require("./features/messages/message.routes");
const settingsRoutes = require("./features/settings/settings.routes");

const app = express();

// Set security HTTP headers
// For a production app with images from the same domain, we can use the default helmet configuration.
// If the frontend is hosted on a different domain, cross-origin resource policies might need tweaking, 
// but helmet defaults are generally safe and restrictive.
app.use(helmet({
    crossOriginResourcePolicy: false, // Allow serving images cross-origin to frontend
}));

// Allow requests from the frontend specifically (not wildcard)
const allowedOrigins = process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : ["http://localhost:3000"];
app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

// Parse JSON request bodies
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "Elpida Backend API is running safely!"
    });
});


app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/variants", variantRoutes);
app.use("/api/v1/uploads", uploadRoutes);
app.use("/api/v1/messages", messageRoutes);
app.use("/api/v1/settings", settingsRoutes);

module.exports = app;
