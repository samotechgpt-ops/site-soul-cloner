
-- Categories
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name_fr TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  icon TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories_public_read" ON public.categories FOR SELECT USING (true);

-- Products
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name_fr TEXT NOT NULL,
  name_ar TEXT,
  description_fr TEXT,
  description_ar TEXT,
  price_dzd NUMERIC(12,2) NOT NULL DEFAULT 0,
  old_price_dzd NUMERIC(12,2),
  stock INT NOT NULL DEFAULT 0,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  theme TEXT DEFAULT 'pro',
  brand TEXT,
  specs JSONB DEFAULT '{}'::jsonb,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  featured BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon, authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_public_read" ON public.products FOR SELECT USING (active = true);
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_featured ON public.products(featured) WHERE featured = true;
CREATE INDEX idx_products_active ON public.products(active);

-- Leads
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  message TEXT,
  source TEXT DEFAULT 'contact',
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.leads TO anon, authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "leads_public_insert" ON public.leads FOR INSERT WITH CHECK (true);

-- Orders
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  wilaya TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_dzd NUMERIC(12,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  whatsapp_sent BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.orders TO anon, authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders_public_insert" ON public.orders FOR INSERT WITH CHECK (true);

-- Admin settings (single row)
CREATE TABLE public.admin_settings (
  id INT PRIMARY KEY DEFAULT 1,
  password_hash TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL DEFAULT '213000000000',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);
GRANT ALL ON public.admin_settings TO service_role;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
-- No policies for anon/authenticated => only service_role can read/write

-- Insert initial admin settings (password = Azerty2026, bcrypt hash precomputed)
-- Hash for "Azerty2026" with bcrypt cost 10
INSERT INTO public.admin_settings (id, password_hash, whatsapp_number)
VALUES (1, '$2b$10$rZ8YxKp5LqOzVxQwG6Y3OuYJcGqHnFqVQqWqK3rH6vJzXqW1pHzMm', '213555000000')
ON CONFLICT (id) DO NOTHING;

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER admin_settings_updated_at BEFORE UPDATE ON public.admin_settings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed categories (25 catégories informatique)
INSERT INTO public.categories (slug, name_fr, name_ar, icon, sort_order) VALUES
('pc-gaming', 'PC Gaming', 'حواسيب الألعاب', 'gamepad-2', 1),
('laptops-gaming', 'Laptops Gaming', 'حواسيب محمولة للألعاب', 'laptop', 2),
('laptops-pro', 'Laptops Pro', 'حواسيب محمولة احترافية', 'laptop-2', 3),
('all-in-one', 'PC All-In-One', 'حواسيب متكاملة', 'monitor-smartphone', 4),
('cartes-graphiques', 'Cartes Graphiques', 'بطاقات الرسوميات', 'cpu', 5),
('processeurs', 'Processeurs', 'المعالجات', 'cpu', 6),
('cartes-meres', 'Cartes Mères', 'اللوحات الأم', 'circuit-board', 7),
('ram', 'Mémoire RAM', 'الذاكرة العشوائية', 'memory-stick', 8),
('stockage', 'SSD & Disques Durs', 'وحدات التخزين', 'hard-drive', 9),
('alimentations', 'Alimentations', 'مزودات الطاقة', 'plug-zap', 10),
('boitiers', 'Boîtiers PC', 'صناديق الحواسيب', 'box', 11),
('refroidissement', 'Refroidissement', 'أنظمة التبريد', 'fan', 12),
('ecrans-gaming', 'Écrans Gaming', 'شاشات الألعاب', 'monitor', 13),
('ecrans-pro', 'Écrans Professionnels', 'شاشات احترافية', 'monitor', 14),
('claviers', 'Claviers', 'لوحات المفاتيح', 'keyboard', 15),
('souris', 'Souris', 'الفأرات', 'mouse', 16),
('casques-audio', 'Casques Audio', 'سماعات الرأس', 'headphones', 17),
('tapis-souris', 'Tapis de Souris', 'حصائر الفأرة', 'square', 18),
('manettes', 'Manettes', 'أذرع التحكم', 'gamepad', 19),
('webcams', 'Webcams', 'كاميرات الويب', 'webcam', 20),
('microphones', 'Microphones', 'الميكروفونات', 'mic', 21),
('imprimantes', 'Imprimantes', 'الطابعات', 'printer', 22),
('reseau-wifi', 'Réseau & Wi-Fi', 'الشبكات وواي فاي', 'wifi', 23),
('stockage-externe', 'Stockage Externe', 'التخزين الخارجي', 'hard-drive', 24),
('accessoires', 'Accessoires', 'الإكسسوارات', 'cable', 25);
