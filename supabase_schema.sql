-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- What We Do tablosu
CREATE TABLE IF NOT EXISTS what_we_do (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  subtitle TEXT NOT NULL,
  service_1_title VARCHAR(255) NOT NULL,
  service_1_items TEXT NOT NULL,
  service_2_title VARCHAR(255) NOT NULL,
  service_2_items TEXT NOT NULL,
  service_3_title VARCHAR(255) NOT NULL,
  service_3_items TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact tablosu
CREATE TABLE IF NOT EXISTS contact (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  instagram VARCHAR(255) NOT NULL,
  linkedin VARCHAR(255) NOT NULL,
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255) NOT NULL,
  studio_hours_weekdays VARCHAR(255) NOT NULL,
  studio_hours_weekend VARCHAR(255) NOT NULL,
  image_path VARCHAR(255) NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- About tablosu
CREATE TABLE IF NOT EXISTS about (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  subtitle TEXT NOT NULL,
  description TEXT NOT NULL,
  image_path VARCHAR(255) NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- About Gallery tablosu
CREATE TABLE IF NOT EXISTS about_gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  image_path VARCHAR(255) NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Awards tablosu
CREATE TABLE IF NOT EXISTS awards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  year INTEGER NOT NULL,
  image_path VARCHAR(255) NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects tablosu
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  subtitle TEXT NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  client VARCHAR(255) NOT NULL,
  year INTEGER NOT NULL,
  image_path VARCHAR(255) NULL,
  video_path VARCHAR(255) NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- News tablosu
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  subtitle TEXT NOT NULL,
  content TEXT NOT NULL,
  image_path VARCHAR(255) NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Slider tablosu
CREATE TABLE IF NOT EXISTS slider (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  subtitle TEXT NOT NULL,
  image_path VARCHAR(255) NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Intro Banners tablosu
CREATE TABLE IF NOT EXISTS intro_banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  subtitle TEXT NOT NULL,
  image_path VARCHAR(255) NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users tablosu (authentication için)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Varsayılan verileri ekle
INSERT INTO what_we_do (title, subtitle, service_1_title, service_1_items, service_2_title, service_2_items, service_3_title, service_3_items) VALUES 
('What We Do', 'We create digital experiences that matter', 'Brand Strategy', 'Brand Audit\nResearch\nAudience\nCompetitive Analysis\nPositioning\nTone of Voice\nSocial Media', 'Digital Design', 'UI/UX Design\nWeb Design\nMobile Design\nBrand Identity\nPrint Design\nPackaging\nIllustration', 'Development', 'Frontend Development\nBackend Development\nE-commerce\nCMS Integration\nAPI Development\nPerformance Optimization\nMaintenance')
ON CONFLICT DO NOTHING;

INSERT INTO contact (phone, email, instagram, linkedin, address_line1, address_line2, studio_hours_weekdays, studio_hours_weekend) VALUES 
('+45 123 456 789', 'hello@lucastudio.com', 'https://instagram.com/lucastudio', 'https://linkedin.com/company/lucastudio', '12 Nyhavn Street', 'Copenhagen, Denmark, 1051', 'Monday to Friday: 9:00 AM – 6:00 PM', 'Saturday & Sunday: Closed')
ON CONFLICT DO NOTHING;

-- Row Level Security (RLS) ayarları
ALTER TABLE what_we_do ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact ENABLE ROW LEVEL SECURITY;
ALTER TABLE about ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE slider ENABLE ROW LEVEL SECURITY;
ALTER TABLE intro_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read access" ON what_we_do FOR SELECT USING (true);
CREATE POLICY "Public read access" ON contact FOR SELECT USING (true);
CREATE POLICY "Public read access" ON about FOR SELECT USING (true);
CREATE POLICY "Public read access" ON about_gallery FOR SELECT USING (true);
CREATE POLICY "Public read access" ON awards FOR SELECT USING (true);
CREATE POLICY "Public read access" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read access" ON news FOR SELECT USING (true);
CREATE POLICY "Public read access" ON slider FOR SELECT USING (true);
CREATE POLICY "Public read access" ON intro_banners FOR SELECT USING (true);

-- Admin write policies (service role key ile)
CREATE POLICY "Admin write access" ON what_we_do FOR ALL USING (true);
CREATE POLICY "Admin write access" ON contact FOR ALL USING (true);
CREATE POLICY "Admin write access" ON about FOR ALL USING (true);
CREATE POLICY "Admin write access" ON about_gallery FOR ALL USING (true);
CREATE POLICY "Admin write access" ON awards FOR ALL USING (true);
CREATE POLICY "Admin write access" ON projects FOR ALL USING (true);
CREATE POLICY "Admin write access" ON news FOR ALL USING (true);
CREATE POLICY "Admin write access" ON slider FOR ALL USING (true);
CREATE POLICY "Admin write access" ON intro_banners FOR ALL USING (true);
CREATE POLICY "Admin write access" ON users FOR ALL USING (true);
