const pool = require("../../config/database");

const getSettings = async () => {
    const result = await pool.query('SELECT * FROM settings WHERE id = 1');
    return result.rows[0];
};

const updateSettings = async (settingsData) => {
    const {
        site_name,
        site_description,
        contact_email,
        phone,
        whatsapp,
        address,
        currency,
        orders_enabled,
        facebook_url,
        instagram_url,
        whatsapp_url,
        logo_url,
        favicon_url
    } = settingsData;

    const query = `
        UPDATE settings 
        SET 
            site_name = $1,
            site_description = $2,
            contact_email = $3,
            phone = $4,
            whatsapp = $5,
            address = $6,
            currency = $7,
            orders_enabled = $8,
            facebook_url = $9,
            instagram_url = $10,
            whatsapp_url = $11,
            logo_url = $12,
            favicon_url = $13,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = 1
        RETURNING *;
    `;

    const values = [
        site_name || '',
        site_description || '',
        contact_email || '',
        phone || '',
        whatsapp || '',
        address || '',
        currency || 'USD',
        orders_enabled !== undefined ? orders_enabled : true,
        facebook_url || '',
        instagram_url || '',
        whatsapp_url || '',
        logo_url || '',
        favicon_url || ''
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
};

module.exports = {
    getSettings,
    updateSettings
};
