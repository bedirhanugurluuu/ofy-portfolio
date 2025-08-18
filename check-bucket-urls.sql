-- Hangi bucket'larda dosyalar var kontrol et
SELECT DISTINCT 
  CASE 
    WHEN image_path LIKE '%/about/%' THEN 'about'
    WHEN image_path LIKE '%/uploads/%' THEN 'uploads'
    WHEN image_path LIKE '%supabase.co/storage/v1/object/public/%' 
      THEN SUBSTRING(image_path FROM 'storage/v1/object/public/([^/]+)')
    ELSE 'unknown'
  END as bucket_name,
  COUNT(*) as file_count
FROM (
  SELECT image_path FROM news
  UNION ALL
  SELECT thumbnail_media FROM projects WHERE thumbnail_media IS NOT NULL
  UNION ALL
  SELECT banner_media FROM projects WHERE banner_media IS NOT NULL
  UNION ALL
  SELECT image_path FROM about_gallery
  UNION ALL
  SELECT image_path FROM about_slider
  UNION ALL
  SELECT image_path FROM contact
  UNION ALL
  SELECT image FROM intro_banners
  UNION ALL
  SELECT image_path FROM about_content
) all_images
WHERE image_path IS NOT NULL
GROUP BY bucket_name;

-- Örnek URL'leri göster
SELECT 'NEWS' as table_name, image_path FROM news LIMIT 3;
SELECT 'PROJECTS' as table_name, thumbnail_media FROM projects WHERE thumbnail_media IS NOT NULL LIMIT 3;
SELECT 'ABOUT_CONTENT' as table_name, image_path FROM about_content LIMIT 3;
