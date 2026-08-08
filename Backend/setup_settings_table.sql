CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    site_name VARCHAR(255) NOT NULL DEFAULT 'Elpida',
    site_description TEXT DEFAULT 'Premium bespoke clothing',
    contact_email VARCHAR(255) DEFAULT '',
    phone VARCHAR(255) DEFAULT '',
    whatsapp VARCHAR(255) DEFAULT '',
    address TEXT DEFAULT '',
    currency VARCHAR(10) DEFAULT 'USD',
    orders_enabled BOOLEAN NOT NULL DEFAULT true,
    facebook_url VARCHAR(255) DEFAULT '',
    instagram_url VARCHAR(255) DEFAULT '',
    whatsapp_url VARCHAR(255) DEFAULT '',
    logo_url VARCHAR(255) DEFAULT '',
    favicon_url VARCHAR(255) DEFAULT '',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
