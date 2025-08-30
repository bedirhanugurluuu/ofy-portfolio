-- Contact tablosu güncellemeleri
-- ADDRESS ve STUDIO HOURS sütunlarını kaldır
ALTER TABLE contact_content 
DROP COLUMN IF EXISTS address_line1,
DROP COLUMN IF EXISTS address_line2,
DROP COLUMN IF EXISTS studio_hours_weekdays,
DROP COLUMN IF EXISTS studio_hours_weekend;

-- Social items için JSONB sütunu ekle
ALTER TABLE contact_content 
ADD COLUMN IF NOT EXISTS social_items JSONB NOT NULL DEFAULT '[{"name": "Instagram", "link": "#"}, {"name": "LinkedIn", "link": "#"}, {"name": "Dribbble", "link": "#"}, {"name": "X", "link": "#"}]';

-- Mevcut veriyi güncelle (eğer varsa)
UPDATE contact_content 
SET social_items = '[{"name": "Instagram", "link": instagram}, {"name": "LinkedIn", "link": linkedin}]'::jsonb
WHERE social_items IS NULL OR social_items = '[]'::jsonb;

-- Instagram ve LinkedIn sütunlarını kaldır (artık social_items içinde)
ALTER TABLE contact_content 
DROP COLUMN IF EXISTS instagram,
DROP COLUMN IF EXISTS linkedin;
