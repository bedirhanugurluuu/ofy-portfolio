-- About gallery'deki uzun dosya adlarını düzelt

-- Önce mevcut durumu göster
SELECT id, image_path FROM about_gallery WHERE image_path LIKE '%gallery-gallery-gallery%';

-- Uzun dosya adlarını kısalt
UPDATE about_gallery 
SET image_path = CASE 
  WHEN image_path LIKE '%gallery-gallery-gallery-gallery-gallery-gallery-gallery-gallery-gallery-1755291463542-612868440.jpg%' 
  THEN REPLACE(image_path, 'gallery-gallery-gallery-gallery-gallery-gallery-gallery-gallery-gallery-1755291463542-612868440.jpg', 'about-gallery-1755291463542-612868440.jpg')
  WHEN image_path LIKE '%gallery-gallery-gallery-gallery-gallery-gallery-gallery-gallery-gallery-1755291468322-407824118.jpg%' 
  THEN REPLACE(image_path, 'gallery-gallery-gallery-gallery-gallery-gallery-gallery-gallery-gallery-1755291468322-407824118.jpg', 'about-gallery-1755291468322-407824118.jpg')
  WHEN image_path LIKE '%gallery-gallery-gallery-gallery-gallery-gallery-gallery-gallery-gallery-1755291474493-817369598.jpg%' 
  THEN REPLACE(image_path, 'gallery-gallery-gallery-gallery-gallery-gallery-gallery-gallery-gallery-1755291474493-817369598.jpg', 'about-gallery-1755291474493-817369598.jpg')
  WHEN image_path LIKE '%gallery-gallery-gallery-gallery-gallery-gallery-gallery-gallery-gallery-1755291483125-259379146.jpg%' 
  THEN REPLACE(image_path, 'gallery-gallery-gallery-gallery-gallery-gallery-gallery-gallery-gallery-1755291483125-259379146.jpg', 'about-gallery-1755291483125-259379146.jpg')
  WHEN image_path LIKE '%gallery-gallery-gallery-gallery-gallery-gallery-gallery-gallery-gallery-1755291516365-214062566.jpg%' 
  THEN REPLACE(image_path, 'gallery-gallery-gallery-gallery-gallery-gallery-gallery-gallery-gallery-1755291516365-214062566.jpg', 'about-gallery-1755291516365-214062566.jpg')
  ELSE image_path
END;

-- Sonucu kontrol et
SELECT id, image_path FROM about_gallery;
