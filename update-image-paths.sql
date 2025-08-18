-- Resim yollarını Supabase Storage URL'lerine güncelle
-- Supabase Storage base URL: https://lsxafginsylkeuyzuiau.supabase.co/storage/v1/object/public/uploads/

-- News tablosundaki resim yollarını güncelle
UPDATE news 
SET image_path = CASE 
  WHEN image_path = 'journal1.jpg' THEN 'https://lsxafginsylkeuyzuiau.supabase.co/storage/v1/object/public/uploads/journal1.jpg'
  WHEN image_path = 'journal2.jpg' THEN 'https://lsxafginsylkeuyzuiau.supabase.co/storage/v1/object/public/uploads/journal2.jpg'
  WHEN image_path = 'journal3.jpg' THEN 'https://lsxafginsylkeuyzuiau.supabase.co/storage/v1/object/public/uploads/journal3.jpg'
  ELSE image_path
END;

-- Projects tablosundaki resim yollarını güncelle
UPDATE projects 
SET 
  thumbnail_media = CASE 
    WHEN thumbnail_media LIKE 'uploads\\%' THEN REPLACE(thumbnail_media, 'uploads\\', 'https://lsxafginsylkeuyzuiau.supabase.co/storage/v1/object/public/uploads/')
    WHEN thumbnail_media LIKE 'uploads/%' THEN REPLACE(thumbnail_media, 'uploads/', 'https://lsxafginsylkeuyzuiau.supabase.co/storage/v1/object/public/uploads/')
    ELSE thumbnail_media
  END,
  banner_media = CASE 
    WHEN banner_media LIKE 'uploads\\%' THEN REPLACE(banner_media, 'uploads\\', 'https://lsxafginsylkeuyzuiau.supabase.co/storage/v1/object/public/uploads/')
    WHEN banner_media LIKE 'uploads/%' THEN REPLACE(banner_media, 'uploads/', 'https://lsxafginsylkeuyzuiau.supabase.co/storage/v1/object/public/uploads/')
    ELSE banner_media
  END;

-- Project gallery tablosundaki resim yollarını güncelle
UPDATE project_gallery 
SET image_path = CASE 
  WHEN image_path LIKE 'uploads\\%' THEN REPLACE(image_path, 'uploads\\', 'https://lsxafginsylkeuyzuiau.supabase.co/storage/v1/object/public/uploads/')
  WHEN image_path LIKE 'uploads/%' THEN REPLACE(image_path, 'uploads/', 'https://lsxafginsylkeuyzuiau.supabase.co/storage/v1/object/public/uploads/')
  ELSE image_path
END;

-- About gallery tablosundaki resim yollarını güncelle
UPDATE about_gallery 
SET image_path = CASE 
  WHEN image_path LIKE '/uploads/%' THEN REPLACE(image_path, '/uploads/', 'https://lsxafginsylkeuyzuiau.supabase.co/storage/v1/object/public/uploads/')
  ELSE image_path
END;

-- About slider tablosundaki resim yollarını güncelle
UPDATE about_slider 
SET image_path = CASE 
  WHEN image_path LIKE 'slider-%' THEN CONCAT('https://lsxafginsylkeuyzuiau.supabase.co/storage/v1/object/public/uploads/', image_path)
  ELSE image_path
END;

-- Contact tablosundaki resim yollarını güncelle
UPDATE contact 
SET image_path = CASE 
  WHEN image_path LIKE 'contact-%' THEN CONCAT('https://lsxafginsylkeuyzuiau.supabase.co/storage/v1/object/public/uploads/', image_path)
  ELSE image_path
END;

-- Intro banners tablosundaki resim yollarını güncelle
UPDATE intro_banners 
SET image = CASE 
  WHEN image LIKE '/uploads/introbanner-%' THEN REPLACE(image, '/uploads/', 'https://lsxafginsylkeuyzuiau.supabase.co/storage/v1/object/public/uploads/')
  ELSE image
END;

-- About content tablosundaki resim yollarını güncelle
UPDATE about_content 
SET image_path = CASE 
  WHEN image_path = '/uploads/sample-about.png' THEN 'https://lsxafginsylkeuyzuiau.supabase.co/storage/v1/object/public/uploads/sample-about.png'
  ELSE image_path
END;
