-- Veritabanı alan isimlerini düzelt ve tüm URL'leri uploads bucket'ına yönlendir

-- 1. Intro banners tablosu - image alanını koru (zaten doğru)
-- ALTER TABLE intro_banners RENAME COLUMN image TO image_path; -- Bu satırı kaldırıyoruz

-- 2. About content tablosu - main_text alanını ekle (eğer yoksa)
ALTER TABLE about_content ADD COLUMN IF NOT EXISTS main_text TEXT;

-- 3. Tüm URL'leri uploads bucket'ına yönlendir
UPDATE projects 
SET 
  thumbnail_media = CASE 
    WHEN thumbnail_media LIKE '%supabase.co/storage/v1/object/public/%' 
    THEN REPLACE(thumbnail_media, SUBSTRING(thumbnail_media FROM 'storage/v1/object/public/[^/]+'), 'storage/v1/object/public/uploads')
    ELSE thumbnail_media
  END,
  banner_media = CASE 
    WHEN banner_media LIKE '%supabase.co/storage/v1/object/public/%' 
    THEN REPLACE(banner_media, SUBSTRING(banner_media FROM 'storage/v1/object/public/[^/]+'), 'storage/v1/object/public/uploads')
    ELSE banner_media
  END;

UPDATE news 
SET image_path = CASE 
  WHEN image_path LIKE '%supabase.co/storage/v1/object/public/%' 
  THEN REPLACE(image_path, SUBSTRING(image_path FROM 'storage/v1/object/public/[^/]+'), 'storage/v1/object/public/uploads')
  ELSE image_path
END;

UPDATE about_content 
SET image_path = CASE 
  WHEN image_path LIKE '%supabase.co/storage/v1/object/public/%' 
  THEN REPLACE(image_path, SUBSTRING(image_path FROM 'storage/v1/object/public/[^/]+'), 'storage/v1/object/public/uploads')
  ELSE image_path
END;

UPDATE about_gallery 
SET image_path = CASE 
  WHEN image_path LIKE '%supabase.co/storage/v1/object/public/%' 
  THEN REPLACE(image_path, SUBSTRING(image_path FROM 'storage/v1/object/public/[^/]+'), 'storage/v1/object/public/uploads')
  ELSE image_path
END;

UPDATE about_slider 
SET image_path = CASE 
  WHEN image_path LIKE '%supabase.co/storage/v1/object/public/%' 
  THEN REPLACE(image_path, SUBSTRING(image_path FROM 'storage/v1/object/public/[^/]+'), 'storage/v1/object/public/uploads')
  ELSE image_path
END;

UPDATE contact 
SET image_path = CASE 
  WHEN image_path LIKE '%supabase.co/storage/v1/object/public/%' 
  THEN REPLACE(image_path, SUBSTRING(image_path FROM 'storage/v1/object/public/[^/]+'), 'storage/v1/object/public/uploads')
  ELSE image_path
END;

UPDATE intro_banners 
SET image = CASE 
  WHEN image LIKE '%supabase.co/storage/v1/object/public/%' 
  THEN REPLACE(image, SUBSTRING(image FROM 'storage/v1/object/public/[^/]+'), 'storage/v1/object/public/uploads')
  ELSE image
END;

UPDATE slider 
SET image_path = CASE 
  WHEN image_path LIKE '%supabase.co/storage/v1/object/public/%' 
  THEN REPLACE(image_path, SUBSTRING(image_path FROM 'storage/v1/object/public/[^/]+'), 'storage/v1/object/public/uploads')
  ELSE image_path
END;

UPDATE awards 
SET image_path = CASE 
  WHEN image_path LIKE '%supabase.co/storage/v1/object/public/%' 
  THEN REPLACE(image_path, SUBSTRING(image_path FROM 'storage/v1/object/public/[^/]+'), 'storage/v1/object/public/uploads')
  ELSE image_path
END;
