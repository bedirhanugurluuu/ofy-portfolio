-- IP Whitelist tablosu oluştur
CREATE TABLE IF NOT EXISTS allowed_ips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) politikaları
ALTER TABLE allowed_ips ENABLE ROW LEVEL SECURITY;

-- Herkes okuyabilir (IP kontrolü için)
CREATE POLICY "Allow read access for IP checking" ON allowed_ips
FOR SELECT USING (is_active = true);

-- Sadece authenticated kullanıcılar ekleyebilir/güncelleyebilir
CREATE POLICY "Allow authenticated users to manage IPs" ON allowed_ips
FOR ALL USING (auth.role() = 'authenticated');

-- Örnek IP'ler ekle
INSERT INTO allowed_ips (ip_address, description) VALUES
('127.0.0.1', 'Localhost (Development)')
ON CONFLICT (ip_address) DO NOTHING;

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_allowed_ips_updated_at 
    BEFORE UPDATE ON allowed_ips 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();