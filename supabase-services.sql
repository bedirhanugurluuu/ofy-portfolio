-- Services tablosu
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Varsayılan services ekle
INSERT INTO services (title, description, order_index) VALUES 
  ('Strategy', 'Where insight meets execution. We develop data-driven strategies that align with your vision and drive measurable success. Every decision is guided by research and market intelligence, ensuring sustainable growth. With a holistic approach, we turn challenges from opportunities to results.', 1),
  ('Branding', 'Building stories that resonate. From visual identity to messaging, we design brands that connect with audiences and stand the test of time. We craft every detail with intention, ensuring consistency across every touchpoint. Our approach blends strategy and creativity, turning brands into experiences.', 2),
  ('Web Design', 'Where creativity meets functionality. We craft immersive and responsive digital experiences tailored to drive engagement and achieve your goals. With a user-centric approach, we design seamless interactions that captivate and convert. Thoughtfully crafted to elevate your brand in the digital landscape.', 3)
ON CONFLICT DO NOTHING;

-- RLS (Row Level Security) politikaları
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Herkes okuyabilir (public read)
CREATE POLICY "Services are viewable by everyone" ON services
  FOR SELECT USING (true);

-- Sadece authenticated kullanıcılar yazabilir
CREATE POLICY "Services are editable by authenticated users" ON services
  FOR ALL USING (auth.role() = 'authenticated');

-- Updated_at trigger'ı
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_services_updated_at 
  BEFORE UPDATE ON services 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
