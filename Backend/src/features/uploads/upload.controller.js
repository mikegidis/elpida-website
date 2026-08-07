const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const multer = require("multer");

// ── Directory setup ──────────────────────────────────────────────
// All product images land in Backend/uploads/products/
const UPLOADS_DIR = path.join(__dirname, "..", "..", "..", "uploads", "products");

// Ensure the directory exists at startup
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// ── Allowed MIME types ───────────────────────────────────────────
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

// ── Multer storage configuration ─────────────────────────────────
// Generates unique filenames: <timestamp>-<8 hex chars>.<ext>
const storage = multer.diskStorage({
    destination(_req, _file, cb) {
        cb(null, UPLOADS_DIR);
    },
    filename(_req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase();
        const uniqueName = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}${ext}`;
        cb(null, uniqueName);
    },
});

// File-type filter — rejects anything not in ALLOWED_TYPES
function fileFilter(_req, file, cb) {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPG, JPEG, PNG and WEBP images are allowed."));
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: MAX_FILE_SIZE },
});

// ── Controller ───────────────────────────────────────────────────
async function uploadImage(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image file provided.",
            });
        }

        // Return the URL path the frontend will store in image_url
        const imageUrl = `/uploads/products/${req.file.filename}`;

        return res.status(201).json({
            success: true,
            data: { url: imageUrl },
        });
    } catch (error) {
        console.error("Upload error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to upload image.",
        });
    }
}

module.exports = {
    upload,       // multer middleware — used in the route
    uploadImage,  // controller handler
    UPLOADS_DIR,  // exported so product controller can delete files
};
