const settingsModel = require("./settings.model");

// URL Validation Regex (allows http/https)
const isValidUrl = (string) => {
    if (!string) return true; // optional
    try {
        const url = new URL(string);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
        return false;  
    }
};

// Simple Email Validation
const isValidEmail = (email) => {
    if (!email) return true; // optional
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const getSettings = async (req, res) => {
    try {
        const settings = await settingsModel.getSettings();
        res.status(200).json(settings);
    } catch (error) {
        console.error("Error fetching settings:", error);
        res.status(500).json({ message: "Failed to fetch settings" });
    }
};

const updateSettings = async (req, res) => {
    try {
        const {
            contact_email,
            facebook_url,
            instagram_url,
            whatsapp_url,
            logo_url,
            favicon_url,
            site_name
        } = req.body;

        // Validation
        if (site_name && site_name.length > 255) {
            return res.status(400).json({ message: "Site name too long (max 255 chars)" });
        }
        if (!isValidEmail(contact_email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        const urls = { facebook_url, instagram_url, whatsapp_url, logo_url, favicon_url };
        for (const [key, value] of Object.entries(urls)) {
            if (!isValidUrl(value)) {
                return res.status(400).json({ message: `Invalid URL format for ${key}` });
            }
        }

        const updatedSettings = await settingsModel.updateSettings(req.body);
        res.status(200).json({
            message: "Settings updated successfully",
            settings: updatedSettings
        });
    } catch (error) {
        console.error("Error updating settings:", error);
        res.status(500).json({ message: "Failed to update settings" });
    }
};

module.exports = {
    getSettings,
    updateSettings
};
