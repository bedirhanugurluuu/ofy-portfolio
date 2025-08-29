-- Footer tablosu
CREATE TABLE IF NOT EXISTS footer (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cta_title TEXT NOT NULL DEFAULT 'Interested in working with us?',
  cta_link TEXT NOT NULL DEFAULT '#',
  sitemap_items TEXT[] NOT NULL DEFAULT ARRAY['Home', 'About', 'Projects', 'Contact'],
  social_items TEXT[] NOT NULL DEFAULT ARRAY['Instagram', 'LinkedIn', 'Dribbble', 'X'],
  copyright_text TEXT NOT NULL DEFAULT '© 2025 Ömer Faruk Yılmaz. Tüm hakları saklıdır.',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Varsayılan footer ekle
INSERT INTO footer (cta_title, cta_link, sitemap_items, social_items, copyright_text) VALUES 
  ('Interested in working with us?', '#', ARRAY['Home', 'About', 'Projects', 'Contact'], ARRAY['Instagram', 'LinkedIn', 'Dribbble', 'X'], '© 2025 Ömer Faruk Yılmaz. Tüm hakları saklıdır.')
ON CONFLICT DO NOTHING;

-- RLS (Row Level Security) politikaları
ALTER TABLE footer ENABLE ROW LEVEL SECURITY;

-- Herkes okuyabilir (public read)
CREATE POLICY "Footer is viewable by everyone" ON footer
  FOR SELECT USING (true);

-- Sadece authenticated kullanıcılar yazabilir
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

CREATE TRIGGER update_footer_updated_at 
  BEFORE UPDATE ON footer 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
