-- Contact tablosunu sil ve yeniden oluştur
DROP TABLE IF EXISTS contact CASCADE;

-- Contact tablosu
CREATE TABLE contact (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'Contact',
  phone TEXT NOT NULL DEFAULT '+45 123 456 789',
  email TEXT NOT NULL DEFAULT 'hello@lucastudio.com',
  social_items JSONB NOT NULL DEFAULT '[{"name": "Instagram", "link": "#"}, {"name": "LinkedIn", "link": "#"}, {"name": "Dribbble", "link": "#"}, {"name": "X", "link": "#"}]',
  image_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Varsayılan contact verisi ekle
INSERT INTO contact (title, phone, email, social_items, image_path) VALUES 
  ('Contact', '+45 123 456 789', 'hello@lucastudio.com', '[{"name": "Instagram", "link": "#"}, {"name": "LinkedIn", "link": "#"}, {"name": "Dribbble", "link": "#"}, {"name": "X", "link": "#"}]', null)
ON CONFLICT DO NOTHING;

-- RLS (Row Level Security) politikaları
ALTER TABLE contact ENABLE ROW LEVEL SECURITY;

-- Herkes okuyabilir (public read)
CREATE POLICY "Contact is viewable by everyone" ON contact
  FOR SELECT USING (true);

-- Sadece authenticated kullanıcılar yazabilir
CREATE POLICY "Contact is editable by authenticated users" ON contact
  FOR ALL USING (auth.role() = 'authenticated');

-- Updated_at trigger'ı
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_contact_updated_at 
  BEFORE UPDATE ON contact 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
