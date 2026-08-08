const fs = require('fs');
const path = require('path');
const pool = require('./src/config/database');

async function setupSettingsTable() {
    try {
        const sql = fs.readFileSync(path.join(__dirname, 'setup_settings_table.sql'), 'utf8');
        await pool.query(sql);
        console.log("Settings table created successfully.");
    } catch (err) {
        console.error("Error creating settings table:", err);
    } finally {
        await pool.end();
    }
}

setupSettingsTable();
