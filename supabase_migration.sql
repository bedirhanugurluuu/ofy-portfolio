-- News tablosuna photos_label alanı ekleme
-- Bu alan "PHOTOS" yazısını panelden yönetilebilir yapmak için kullanılacak

ALTER TABLE news 
ADD COLUMN IF NOT EXISTS photos_label TEXT DEFAULT 'PHOTOS';

-- Mevcut kayıtlar için varsayılan değer atama (eğer NULL ise)
UPDATE news 
SET photos_label = 'PHOTOS' 
WHERE photos_label IS NULL;

-- published_at alanı zaten mevcut, ancak NULL olabilir
-- Yeni kayıtlar için varsayılan değer olarak şu anki tarihi kullanabilirsiniz
-- (Bu opsiyonel, çünkü formdan seçilecek)

-- İsteğe bağlı: published_at için NOT NULL constraint eklemek isterseniz:
-- ALTER TABLE news ALTER COLUMN published_at SET NOT NULL;

-- İsteğe bağlı: published_at için varsayılan değer eklemek isterseniz:
-- ALTER TABLE news ALTER COLUMN published_at SET DEFAULT CURRENT_TIMESTAMP;
