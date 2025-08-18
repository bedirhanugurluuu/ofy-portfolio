-- Tablo yapılarını kontrol et
SELECT 
  table_name,
  column_name,
  data_type
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name IN ('intro_banners', 'slider', 'projects', 'news', 'about_content', 'about_gallery', 'about_slider', 'contact', 'awards')
ORDER BY table_name, ordinal_position;

-- Örnek verileri göster
SELECT 'intro_banners' as table_name, id, image FROM intro_banners LIMIT 3;
SELECT 'slider' as table_name, id, image_path FROM slider LIMIT 3;
SELECT 'projects' as table_name, id, thumbnail_media, banner_media FROM projects LIMIT 3;
