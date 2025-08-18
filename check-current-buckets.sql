-- Mevcut bucket'ları ve resim URL'lerini kontrol et

-- Hangi bucket'larda dosyalar var
SELECT DISTINCT 
  CASE 
    WHEN image_path LIKE '%/projects/%' THEN 'projects'
    WHEN image_path LIKE '%/news/%' THEN 'news'
    WHEN image_path LIKE '%/about/%' THEN 'about'
    WHEN image_path LIKE '%/uploads/%' THEN 'uploads'
    WHEN image_path LIKE '%supabase.co/storage/v1/object/public/%' 
      THEN SUBSTRING(image_path FROM 'storage/v1/object/public/([^/]+)')
    ELSE 'unknown'
  END as bucket_name,
  COUNT(*) as file_count
FROM (
  SELECT image_path FROM news WHERE image_path IS NOT NULL
  UNION ALL
  SELECT thumbnail_media FROM projects WHERE thumbnail_media IS NOT NULL
  UNION ALL
  SELECT banner_media FROM projects WHERE banner_media IS NOT NULL
  UNION ALL
  SELECT image_path FROM about_gallery WHERE image_path IS NOT NULL
  UNION ALL
  SELECT image_path FROM about_slider WHERE image_path IS NOT NULL
  UNION ALL
  SELECT image_path FROM contact WHERE image_path IS NOT NULL
  UNION ALL
  SELECT image FROM intro_banners WHERE image IS NOT NULL
  UNION ALL
  SELECT image_path FROM about_content WHERE image_path IS NOT NULL
) all_images
GROUP BY bucket_name;

-- Örnek URL'leri göster
SELECT 'PROJECTS' as table_name, thumbnail_media FROM projects WHERE thumbnail_media IS NOT NULL LIMIT 3;
SELECT 'NEWS' as table_name, image_path FROM news WHERE image_path IS NOT NULL LIMIT 3;
SELECT 'INTRO_BANNERS' as table_name, image FROM intro_banners WHERE image IS NOT NULL LIMIT 3;
