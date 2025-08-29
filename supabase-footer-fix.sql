-- Footer tablosu düzeltmeleri
-- Eğer tablo yoksa oluştur
CREATE TABLE IF NOT EXISTS footer (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cta_title TEXT NOT NULL DEFAULT 'Interested in working with us?',
  cta_link TEXT NOT NULL DEFAULT '#',
  sitemap_items JSONB NOT NULL DEFAULT '[{"name": "Home", "link": "/"}, {"name": "About", "link": "/about"}, {"name": "Projects", "link": "/projects"}, {"name": "Contact", "link": "/contact"}]',
  social_items JSONB NOT NULL DEFAULT '[{"name": "Instagram", "link": "#"}, {"name": "LinkedIn", "link": "#"}, {"name": "Dribbble", "link": "#"}, {"name": "X", "link": "#"}]',
  copyright_text TEXT NOT NULL DEFAULT '© 2025 Ömer Faruk Yılmaz. Tüm hakları saklıdır.',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Eğer sitemap_items TEXT[] ise JSONB'ye çevir
ALTER TABLE footer 
ALTER COLUMN sitemap_items TYPE JSONB 
USING CASE 
  WHEN sitemap_items IS NULL THEN '[{"name": "Home", "link": "/"}, {"name": "About", "link": "/about"}, {"name": "Projects", "link": "/projects"}, {"name": "Contact", "link": "/contact"}]'::jsonb
  WHEN jsonb_typeof(sitemap_items::jsonb) = 'array' THEN sitemap_items::jsonb
  ELSE '[{"name": "Home", "link": "/"}, {"name": "About", "link": "/about"}, {"name": "Projects", "link": "/projects"}, {"name": "Contact", "link": "/contact"}]'::jsonb
END;

-- Eğer social_items TEXT[] ise JSONB'ye çevir
ALTER TABLE footer 
ALTER COLUMN social_items TYPE JSONB 
USING CASE 
  WHEN social_items IS NULL THEN '[{"name": "Instagram", "link": "#"}, {"name": "LinkedIn", "link": "#"}, {"name": "Dribbble", "link": "#"}, {"name": "X", "link": "#"}]'::jsonb
  WHEN jsonb_typeof(social_items::jsonb) = 'array' THEN social_items::jsonb
  ELSE '[{"name": "Instagram", "link": "#"}, {"name": "LinkedIn", "link": "#"}, {"name": "Dribbble", "link": "#"}, {"name": "X", "link": "#"}]'::jsonb
END;

-- Varsayılan footer ekle (eğer yoksa)
INSERT INTO footer (cta_title, cta_link, sitemap_items, social_items, copyright_text) VALUES 
  ('Interested in working with us?', '#', '[{"name": "Home", "link": "/"}, {"name": "About", "link": "/about"}, {"name": "Projects", "link": "/projects"}, {"name": "Contact", "link": "/contact"}]', '[{"name": "Instagram", "link": "#"}, {"name": "LinkedIn", "link": "#"}, {"name": "Dribbble", "link": "#"}, {"name": "X", "link": "#"}]', '© 2025 Ömer Faruk Yılmaz. Tüm hakları saklıdır.')
ON CONFLICT DO NOTHING;

-- RLS (Row Level Security) politikaları
ALTER TABLE footer ENABLE ROW LEVEL SECURITY;

-- Herkes okuyabilir (public read)
DROP POLICY IF EXISTS "Footer is viewable by everyone" ON footer;
CREATE POLICY "Footer is viewable by everyone" ON footer
  FOR SELECT USING (true);

-- Sadece authenticated kullanıcılar yazabilir
DROP POLICY IF EXISTS "Footer is editable by authenticated users" ON footer;
CREATE POLICY "Footer is editable by authenticated users" ON footer
  FOR ALL USING (auth.role() = 'authenticated');

-- Updated_at trigger'ı
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_footer_updated_at ON footer;
CREATE TRIGGER update_footer_updated_at 
  BEFORE UPDATE ON footer 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
