const multer = require("multer");
const cloudinary = require("cloudinary").v2;

// ── Cloudinary Config ────────────────────────────────────────────
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Allowed MIME types ───────────────────────────────────────────
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

// ── Multer storage configuration ─────────────────────────────────
const storage = multer.memoryStorage();

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

        const uploadStream = () => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
    {
        folder: process.env.CLOUDINARY_FOLDER,
    },
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );
                stream.end(req.file.buffer);
            });
        };

        const result = await uploadStream();

        return res.status(201).json({
            success: true,
            data: { url: result.secure_url },
        });
    } catch (error) {
        console.error("Cloudinary upload error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to upload image.",
        });
    }
}

module.exports = {
    upload,       // multer middleware — used in the route
    uploadImage,  // controller handler
};
