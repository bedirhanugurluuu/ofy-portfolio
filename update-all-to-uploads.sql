-- Tüm URL'leri uploads bucket'ına yönlendir

-- 1. About content tablosu - main_text alanını ekle (eğer yoksa)
ALTER TABLE about_content ADD COLUMN IF NOT EXISTS main_text TEXT;

-- 2. Projects tablosu - thumbnail_media ve banner_media
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

-- 3. Project gallery tablosu - image_path
UPDATE project_gallery 
SET image_path = CASE 
  WHEN image_path LIKE '%supabase.co/storage/v1/object/public/%' 
  THEN REPLACE(image_path, SUBSTRING(image_path FROM 'storage/v1/object/public/[^/]+'), 'storage/v1/object/public/uploads')
  ELSE image_path
END;

-- 4. News tablosu - image_path
UPDATE news 
SET image_path = CASE 
  WHEN image_path LIKE '%supabase.co/storage/v1/object/public/%' 
  THEN REPLACE(image_path, SUBSTRING(image_path FROM 'storage/v1/object/public/[^/]+'), 'storage/v1/object/public/uploads')
  ELSE image_path
END;

-- 5. About content tablosu - image_path
UPDATE about_content 
SET image_path = CASE 
  WHEN image_path LIKE '%supabase.co/storage/v1/object/public/%' 
  THEN REPLACE(image_path, SUBSTRING(image_path FROM 'storage/v1/object/public/[^/]+'), 'storage/v1/object/public/uploads')
  ELSE image_path
END;

-- 6. About gallery tablosu - image_path (uzun dosya adlarını düzelt)
UPDATE about_gallery 
SET image_path = CASE 
  WHEN image_path LIKE '%supabase.co/storage/v1/object/public/%' 
  THEN REPLACE(image_path, SUBSTRING(image_path FROM 'storage/v1/object/public/[^/]+'), 'storage/v1/object/public/uploads')
  ELSE image_path
END;

-- 7. About slider tablosu - image_path
UPDATE about_slider 
SET image_path = CASE 
  WHEN image_path LIKE '%supabase.co/storage/v1/object/public/%' 
  THEN REPLACE(image_path, SUBSTRING(image_path FROM 'storage/v1/object/public/[^/]+'), 'storage/v1/object/public/uploads')
  ELSE image_path
END;

-- 8. Contact tablosu - image_path
UPDATE contact 
SET image_path = CASE 
  WHEN image_path LIKE '%supabase.co/storage/v1/object/public/%' 
  THEN REPLACE(image_path, SUBSTRING(image_path FROM 'storage/v1/object/public/[^/]+'), 'storage/v1/object/public/uploads')
  ELSE image_path
END;

-- 9. Intro banners tablosu - image
UPDATE intro_banners 
SET image = CASE 
  WHEN image LIKE '%supabase.co/storage/v1/object/public/%' 
  THEN REPLACE(image, SUBSTRING(image FROM 'storage/v1/object/public/[^/]+'), 'storage/v1/object/public/uploads')
  ELSE image
END;

-- 10. Awards tablosu - image_path
UPDATE awards 
SET image_path = CASE 
  WHEN image_path LIKE '%supabase.co/storage/v1/object/public/%' 
  THEN REPLACE(image_path, SUBSTRING(image_path FROM 'storage/v1/object/public/[^/]+'), 'storage/v1/object/public/uploads')
  ELSE image_path
END;
