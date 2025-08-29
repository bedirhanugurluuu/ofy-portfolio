-- Header ayarları tablosu
CREATE TABLE IF NOT EXISTS header_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  logo_text TEXT,
  logo_image_url TEXT,
  logo_image_url_light TEXT, -- Açık renkli logo (şeffaf arka plan için)
  menu_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Varsayılan header ayarlarını ekle
INSERT INTO header_settings (menu_items) 
VALUES (
  '[
    {"id": "1", "href": "/projects", "label": "WORK", "order": 1},
    {"id": "2", "href": "/about", "label": "ABOUT", "order": 2},
    {"id": "3", "href": "/blog", "label": "NEWS", "order": 3},
    {"id": "4", "href": "/careers", "label": "CAREERS", "order": 4}
  ]'::jsonb
) ON CONFLICT DO NOTHING;

-- RLS (Row Level Security) politikaları
ALTER TABLE header_settings ENABLE ROW LEVEL SECURITY;

-- Herkes okuyabilir (public read)
CREATE POLICY "Header settings are viewable by everyone" ON header_settings
  FOR SELECT USING (true);

-- Sadece authenticated kullanıcılar yazabilir
CREATE POLICY "Header settings are editable by authenticated users" ON header_settings
  FOR ALL USING (auth.role() = 'authenticated');

-- Updated_at trigger'ı
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_header_settings_updated_at 
  BEFORE UPDATE ON header_settings 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
