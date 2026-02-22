-- Products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  price NUMERIC,
  currency TEXT CHECK (currency IN ('RWF', 'USD')),
  show_price BOOLEAN NOT NULL DEFAULT false,
  visible BOOLEAN NOT NULL DEFAULT true,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_products_visible ON products(visible);
CREATE INDEX idx_products_visible_featured ON products(visible, featured);
CREATE INDEX idx_products_updated_at ON products(updated_at DESC);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  visible BOOLEAN NOT NULL DEFAULT true,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_categories_order ON categories("order");

-- Favorites (user_id from auth.users)
CREATE TABLE IF NOT EXISTS favorites (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, product_id)
);

-- Roles for admin check
CREATE TABLE IF NOT EXISTS roles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user',
  admin BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS policies: products (public read, admin write via service role or custom logic)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT USING (true);

CREATE POLICY "Products are insertable by authenticated users with admin role"
  ON products FOR INSERT
  WITH CHECK (
    auth.uid() IN (SELECT user_id FROM roles WHERE admin = true)
  );

CREATE POLICY "Products are updatable by admins"
  ON products FOR UPDATE
  USING (auth.uid() IN (SELECT user_id FROM roles WHERE admin = true));

CREATE POLICY "Products are deletable by admins"
  ON products FOR DELETE
  USING (auth.uid() IN (SELECT user_id FROM roles WHERE admin = true));

-- Categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories viewable by everyone"
  ON categories FOR SELECT USING (true);

CREATE POLICY "Categories insertable by admins"
  ON categories FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT user_id FROM roles WHERE admin = true));

CREATE POLICY "Categories updatable by admins"
  ON categories FOR UPDATE
  USING (auth.uid() IN (SELECT user_id FROM roles WHERE admin = true));

CREATE POLICY "Categories deletable by admins"
  ON categories FOR DELETE
  USING (auth.uid() IN (SELECT user_id FROM roles WHERE admin = true));

-- Favorites: users can only manage their own
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON favorites FOR DELETE USING (auth.uid() = user_id);

-- Roles: users can read own role
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own role"
  ON roles FOR SELECT USING (auth.uid() = user_id);

-- Storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Product images are publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'products');

CREATE POLICY "Admins can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'products' AND
    auth.uid() IN (SELECT user_id FROM roles WHERE admin = true)
  );
