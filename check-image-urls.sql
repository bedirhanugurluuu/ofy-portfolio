-- Veritabanındaki resim URL'lerini kontrol et
SELECT 'PROJECTS' as table_name, id, title, thumbnail_media, banner_media FROM projects LIMIT 5;

SELECT 'NEWS' as table_name, id, title, image_path FROM news LIMIT 5;

SELECT 'ABOUT_GALLERY' as table_name, id, image_path FROM about_gallery LIMIT 5;

SELECT 'ABOUT_SLIDER' as table_name, id, title, image_path FROM about_slider LIMIT 5;

SELECT 'CONTACT' as table_name, id, image_path FROM contact LIMIT 5;

SELECT 'INTRO_BANNERS' as table_name, id, image FROM intro_banners LIMIT 5;

SELECT 'ABOUT_CONTENT' as table_name, id, title, image_path FROM about_content LIMIT 5;
