-- Elpida baseline database schema
-- Creates the complete application schema required by a fresh installation.

CREATE TABLE categories (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    category_id INTEGER NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_products_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
);

CREATE TABLE product_variants (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_id INTEGER NOT NULL,
    variant_name VARCHAR(100) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_variants_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
);

CREATE TABLE orders (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_name VARCHAR(150) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(150),
    notes TEXT,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id INTEGER NOT NULL,
    product_variant_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price NUMERIC(10,2) NOT NULL,

    CONSTRAINT fk_order_items_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id),

    CONSTRAINT fk_order_items_variant
        FOREIGN KEY (product_variant_id)
        REFERENCES product_variants(id)
);

CREATE TABLE messages (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Unread',
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    site_name VARCHAR(255) NOT NULL DEFAULT 'Elpida',
    site_description TEXT DEFAULT 'Premium bespoke clothing',
    contact_email VARCHAR(255) DEFAULT '',
    phone VARCHAR(255) DEFAULT '',
    whatsapp VARCHAR(255) DEFAULT '',
    address TEXT DEFAULT '',
    currency VARCHAR(10) DEFAULT 'USD',
    orders_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    facebook_url VARCHAR(255) DEFAULT '',
    instagram_url VARCHAR(255) DEFAULT '',
    whatsapp_url VARCHAR(255) DEFAULT '',
    logo_url VARCHAR(255) DEFAULT '',
    favicon_url VARCHAR(255) DEFAULT '',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_category_id
    ON products(category_id);

CREATE INDEX idx_order_items_order_id
    ON order_items(order_id);

INSERT INTO settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;