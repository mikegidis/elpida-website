const express = require("express");

const router = express.Router();

const { requireAdminAuth } = require("../admin/admin.middleware");
const { upload, uploadImage } = require("./upload.controller");

// POST /api/v1/uploads
// Accepts multipart/form-data with field name "image"
// Multer handles the file; uploadImage returns the saved URL path
router.post(
    "/",
    requireAdminAuth,
    (req, res, next) => {
        upload.single("image")(req, res, (err) => {
            if (err) {
                // Multer validation errors (type / size)
                return res.status(400).json({
                    success: false,
                    message: err.message,
                });
            }

            next();
        });
    },
    uploadImage
);

module.exports = router;
