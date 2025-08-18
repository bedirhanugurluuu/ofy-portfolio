-- Veritabanındaki URL'leri yeni bucket yapısına göre güncelle

-- Projects tablosu - projects bucket'ı
UPDATE projects 
SET 
  thumbnail_media = CASE 
    WHEN thumbnail_media LIKE '%uploads%' THEN REPLACE(thumbnail_media, 'uploads', 'projects')
    WHEN thumbnail_media LIKE '%about%' THEN REPLACE(thumbnail_media, 'about', 'projects')
    ELSE thumbnail_media
  END,
  banner_media = CASE 
    WHEN banner_media LIKE '%uploads%' THEN REPLACE(banner_media, 'uploads', 'projects')
    WHEN banner_media LIKE '%about%' THEN REPLACE(banner_media, 'about', 'projects')
    ELSE banner_media
  END;

-- Project gallery tablosu - projects bucket'ı
UPDATE project_gallery 
SET image_path = CASE 
  WHEN image_path LIKE '%uploads%' THEN REPLACE(image_path, 'uploads', 'projects')
  WHEN image_path LIKE '%about%' THEN REPLACE(image_path, 'about', 'projects')
  ELSE image_path
END;

-- News tablosu - news bucket'ı
UPDATE news 
SET image_path = CASE 
  WHEN image_path LIKE '%uploads%' THEN REPLACE(image_path, 'uploads', 'news')
  WHEN image_path LIKE '%about%' THEN REPLACE(image_path, 'about', 'news')
  ELSE image_path
END;

-- About content tablosu - about bucket'ı
UPDATE about_content 
SET image_path = CASE 
  WHEN image_path LIKE '%uploads%' THEN REPLACE(image_path, 'uploads', 'about')
  WHEN image_path LIKE '%about%' THEN REPLACE(image_path, 'about', 'about')
  ELSE image_path
END;

-- About gallery tablosu - about-gallery bucket'ı
UPDATE about_gallery 
SET image_path = CASE 
  WHEN image_path LIKE '%uploads%' THEN REPLACE(image_path, 'uploads', 'about-gallery')
  WHEN image_path LIKE '%about%' THEN REPLACE(image_path, 'about', 'about-gallery')
  ELSE image_path
END;

-- About slider tablosu - slider bucket'ı
UPDATE about_slider 
SET image_path = CASE 
  WHEN image_path LIKE '%uploads%' THEN REPLACE(image_path, 'uploads', 'slider')
  WHEN image_path LIKE '%about%' THEN REPLACE(image_path, 'about', 'slider')
  ELSE image_path
END;

-- Contact tablosu - contact bucket'ı
UPDATE contact 
SET image_path = CASE 
  WHEN image_path LIKE '%uploads%' THEN REPLACE(image_path, 'uploads', 'contact')
  WHEN image_path LIKE '%about%' THEN REPLACE(image_path, 'about', 'contact')
  ELSE image_path
END;

-- Intro banners tablosu - intro-banners bucket'ı
UPDATE intro_banners 
SET image = CASE 
  WHEN image LIKE '%uploads%' THEN REPLACE(image, 'uploads', 'intro-banners')
  WHEN image LIKE '%about%' THEN REPLACE(image, 'about', 'intro-banners')
  ELSE image
END;
