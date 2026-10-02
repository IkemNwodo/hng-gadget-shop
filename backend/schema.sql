-- ==============================================================================
-- HNG15 Gadget Shop Database Schema (Supabase / PostgreSQL)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Products Table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    category TEXT NOT NULL,
    image_url TEXT NOT NULL,
    stock INT NOT NULL DEFAULT 25,
    rating NUMERIC(3, 1) DEFAULT 4.8,
    reviews_count INT DEFAULT 45,
    featured BOOLEAN DEFAULT false,
    badge TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    shipping_address JSONB NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    tax NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    shipping_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_method TEXT NOT NULL DEFAULT 'card',
    payment_status TEXT NOT NULL DEFAULT 'paid',
    order_status TEXT NOT NULL DEFAULT 'confirmed',
    mailgun_message_id TEXT,
    email_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    product_image TEXT,
    quantity INT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Products Policies: Anyone can read products
DROP POLICY IF EXISTS "Public can view products" ON products;
CREATE POLICY "Public can view products" ON products
    FOR SELECT USING (true);

-- Orders Policies: Anyone (anon or auth) can insert orders at checkout
DROP POLICY IF EXISTS "Public can create orders" ON orders;
CREATE POLICY "Public can create orders" ON orders
    FOR INSERT WITH CHECK (true);

-- Orders Policies: Users can view their own orders; anon can view if id matches
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
CREATE POLICY "Users can view their own orders" ON orders
    FOR SELECT USING (
        auth.uid() = user_id OR auth.uid() IS NULL
    );

-- Order Items Policies: Anyone can insert order items
DROP POLICY IF EXISTS "Public can create order items" ON order_items;
CREATE POLICY "Public can create order items" ON order_items
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view order items" ON order_items;
CREATE POLICY "Public can view order items" ON order_items
    FOR SELECT USING (true);

-- 6. Seed Initial Tech Gadget Products
INSERT INTO products (name, slug, description, price, original_price, category, image_url, stock, rating, reviews_count, featured, badge)
VALUES
(
    'AuraPro ANC Wireless Headphones',
    'aurapro-anc-headphones',
    'Flagship wireless headphones with hybrid active noise cancellation, 40-hour battery life, and spatial audio with dynamic head tracking.',
    249.99,
    299.99,
    'Audio',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    18,
    4.9,
    142,
    true,
    'Best Seller'
),
(
    'TitanBook M2 Pro Ultrabook 14"',
    'titanbook-m2-pro-ultrabook',
    'Next-gen ultra-thin laptop powered by high-efficiency silicon, 32GB unified RAM, Liquid Retina XDR display, and 18-hour battery longevity.',
    1299.00,
    1449.00,
    'Computers',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    12,
    4.9,
    88,
    true,
    'Featured'
),
(
    'Apex Chrono Smartwatch Ultra',
    'apex-chrono-smartwatch-ultra',
    'Titanium case, precision dual-frequency GPS, sapphire crystal glass, ECG sensor, and up to 100m water resistance for extreme endurance.',
    399.50,
    449.00,
    'Wearables',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    25,
    4.8,
    210,
    true,
    'Hot'
),
(
    'KeyChronicle Mechanical RGB Keyboard',
    'keychronicle-mechanical-keyboard',
    'Hot-swappable custom tactile switches, sound-dampening brass plate, programmable per-key RGB backlighting, and Bluetooth 5.2 tri-mode.',
    129.00,
    159.00,
    'Accessories',
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    30,
    4.7,
    95,
    false,
    'New'
),
(
    'GlideMaster Ergo Precision Mouse',
    'glidemaster-ergo-mouse',
    'Ergonomic contouring that reduces forearm strain by 35%. 4000 DPI Darkfield high-precision sensor tracks seamlessly on glass.',
    79.99,
    99.99,
    'Accessories',
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
    42,
    4.8,
    164,
    false,
    NULL
),
(
    'PulseStudio 4K UltraWide Monitor 34"',
    'pulsestudio-4k-ultrawide-monitor',
    'Curved 1500R Nano IPS panel with 165Hz refresh rate, HDR 600, 98% DCI-P3 color gamut, and 90W USB-C single cable docking power delivery.',
    649.00,
    729.00,
    'Computers',
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    8,
    4.9,
    63,
    true,
    'Top Rated'
),
(
    'MagCharge 3-in-1 Wireless Power Dock',
    'magcharge-3in1-power-dock',
    'Charges phone, earbuds, and smartwatch simultaneously at maximum Qi2 15W high speeds with weighted aerospace-grade aluminum base.',
    89.00,
    109.00,
    'Accessories',
    'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
    50,
    4.7,
    119,
    false,
    NULL
),
(
    'SoundWave Mini 360 Waterproof Speaker',
    'soundwave-mini-360-speaker',
    'IP67 dustproof and waterproof Bluetooth speaker with 360-degree room-filling acoustic drivers and 16 hours of continuous playtime.',
    69.99,
    89.99,
    'Audio',
    'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
    35,
    4.6,
    81,
    false,
    NULL
)
ON CONFLICT (slug) DO NOTHING;
