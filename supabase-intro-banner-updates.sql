-- Intro banner tablosuna yeni kolonlar ekle
ALTER TABLE intro_banners 
ADD COLUMN IF NOT EXISTS scroll_text TEXT;

ALTER TABLE intro_banners 
ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES projects(id);
