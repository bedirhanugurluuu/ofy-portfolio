-- What We Do tablosu
CREATE TABLE IF NOT EXISTS what_we_do (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  subtitle TEXT NOT NULL,
  service_1_title VARCHAR(255) NOT NULL,
  service_1_items TEXT NOT NULL,
  service_2_title VARCHAR(255) NOT NULL,
  service_2_items TEXT NOT NULL,
  service_3_title VARCHAR(255) NOT NULL,
  service_3_items TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Contact tablosu
CREATE TABLE IF NOT EXISTS contact (
  id INT PRIMARY KEY AUTO_INCREMENT,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  instagram VARCHAR(255) NOT NULL,
  linkedin VARCHAR(255) NOT NULL,
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255) NOT NULL,
  studio_hours_weekdays VARCHAR(255) NOT NULL,
  studio_hours_weekend VARCHAR(255) NOT NULL,
  image_path VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Varsayılan verileri ekle
INSERT INTO what_we_do (title, subtitle, service_1_title, service_1_items, service_2_title, service_2_items, service_3_title, service_3_items) VALUES 
('What We Do', 'We create digital experiences that matter', 'Brand Strategy', 'Brand Audit\nResearch\nAudience\nCompetitive Analysis\nPositioning\nTone of Voice\nSocial Media', 'Digital Design', 'UI/UX Design\nWeb Design\nMobile Design\nBrand Identity\nPrint Design\nPackaging\nIllustration', 'Development', 'Frontend Development\nBackend Development\nE-commerce\nCMS Integration\nAPI Development\nPerformance Optimization\nMaintenance');

INSERT INTO contact (phone, email, instagram, linkedin, address_line1, address_line2, studio_hours_weekdays, studio_hours_weekend) VALUES 
('+45 123 456 789', 'hello@lucastudio.com', 'https://instagram.com/lucastudio', 'https://linkedin.com/company/lucastudio', '12 Nyhavn Street', 'Copenhagen, Denmark, 1051', 'Monday to Friday: 9:00 AM – 6:00 PM', 'Saturday & Sunday: Closed');
