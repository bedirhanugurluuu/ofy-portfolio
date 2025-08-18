-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist
DROP TABLE IF EXISTS project_gallery CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS about_content CASCADE;
DROP TABLE IF EXISTS about_gallery CASCADE;
DROP TABLE IF EXISTS about_slider CASCADE;
DROP TABLE IF EXISTS awards CASCADE;
DROP TABLE IF EXISTS contact CASCADE;
DROP TABLE IF EXISTS intro_banners CASCADE;
DROP TABLE IF EXISTS news CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS what_we_do CASCADE;

-- Create tables with UUID primary keys
CREATE TABLE about_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(500) DEFAULT NULL,
  main_text TEXT NOT NULL,
  vision_title VARCHAR(255) NOT NULL,
  vision_text TEXT NOT NULL,
  image_path VARCHAR(500) DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approach_title VARCHAR(255) DEFAULT 'approach',
  approach_subtitle TEXT,
  brand_strategy_title VARCHAR(255) DEFAULT 'Brand Strategy',
  brand_strategy_text TEXT,
  visual_design_title VARCHAR(255) DEFAULT 'Visual Design',
  visual_design_text TEXT,
  launch_title VARCHAR(255) DEFAULT 'Launch',
  launch_text TEXT,
  insights_title VARCHAR(255) DEFAULT 'Insights',
  insights_subtitle TEXT,
  insight_1_title VARCHAR(255) DEFAULT NULL,
  insight_1_text TEXT,
  insight_1_project_id INTEGER DEFAULT NULL,
  insight_2_title VARCHAR(255) DEFAULT NULL,
  insight_2_text TEXT,
  insight_2_project_id INTEGER DEFAULT NULL,
  insight_3_title VARCHAR(255) DEFAULT NULL,
  insight_3_text TEXT,
  insight_3_project_id INTEGER DEFAULT NULL,
  insight_4_title VARCHAR(255) DEFAULT NULL,
  insight_4_text TEXT,
  insight_4_project_id INTEGER DEFAULT NULL,
  clients_title VARCHAR(255) DEFAULT 'Clients',
  clients_list TEXT,
  industries_title VARCHAR(255) DEFAULT 'Industries',
  industries_list TEXT
);

CREATE TABLE about_gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_path VARCHAR(255) NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE about_slider (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255) NOT NULL,
  sub_subtitle VARCHAR(255) NOT NULL,
  image_path VARCHAR(500) NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE awards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  link VARCHAR(500) NOT NULL,
  date VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  subtitle VARCHAR(255) NOT NULL DEFAULT '',
  halo VARCHAR(255) NOT NULL DEFAULT ''
);

CREATE TABLE contact (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  phone VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  instagram VARCHAR(255) NOT NULL,
  linkedin VARCHAR(255) NOT NULL,
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255) NOT NULL,
  studio_hours_weekdays VARCHAR(255) NOT NULL,
  studio_hours_weekend VARCHAR(255) NOT NULL,
  image_path VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE intro_banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image VARCHAR(255) NOT NULL,
  title_line1 VARCHAR(255) DEFAULT NULL,
  title_line2 VARCHAR(255) DEFAULT NULL,
  button_text VARCHAR(255) DEFAULT NULL,
  button_link VARCHAR(255) DEFAULT NULL,
  order_index INTEGER DEFAULT 0
);

CREATE TABLE news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  category_text VARCHAR(100) DEFAULT 'DESIGN',
  photographer VARCHAR(100) DEFAULT 'Anna Surokin',
  subtitle VARCHAR(500) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  content TEXT,
  image_path VARCHAR(500) DEFAULT NULL,
  aspect_ratio VARCHAR(20) DEFAULT 'aspect-square',
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  thumbnail_media VARCHAR(255) DEFAULT NULL,
  banner_media VARCHAR(255) DEFAULT NULL,
  video_url VARCHAR(255) DEFAULT NULL,
  description TEXT,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  client_name VARCHAR(255) DEFAULT NULL,
  year INTEGER DEFAULT NULL,
  role VARCHAR(255) DEFAULT NULL,
  external_link VARCHAR(255) DEFAULT NULL
);

CREATE TABLE project_gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  image_path VARCHAR(255) NOT NULL,
  sort INTEGER DEFAULT 0
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE what_we_do (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL DEFAULT 'What We Do',
  subtitle TEXT NOT NULL,
  service_1_title VARCHAR(255) NOT NULL,
  service_1_items TEXT NOT NULL,
  service_2_title VARCHAR(255) NOT NULL,
  service_2_items TEXT NOT NULL,
  service_3_title VARCHAR(255) NOT NULL,
  service_3_items TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert data
INSERT INTO about_content (id, title, subtitle, main_text, vision_title, vision_text, image_path, created_at, updated_at, approach_title, approach_subtitle, brand_strategy_title, brand_strategy_text, visual_design_title, visual_design_text, launch_title, launch_text, insights_title, insights_subtitle, insight_1_title, insight_1_text, insight_1_project_id, insight_2_title, insight_2_text, insight_2_project_id, insight_3_title, insight_3_text, insight_3_project_id, insight_4_title, insight_4_text, insight_4_project_id, clients_title, clients_list, industries_title, industries_list) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'About Us', 'A collective of visionaries shaping tomorrow', 'A collective of visionaries shaping tomorrow, where creativity and innovation intersect. Our studio is built on the belief that bold ideas and meticulous execution drive meaningful design.', 'Our Vision', 'We craft innovative design strategies for forward thinking brands, combining aesthetics with purpose to create impactful solutions.', '/uploads/sample-about.png', '2025-08-11 18:57:18', '2025-08-15 18:44:21', 'APPROACH', 'The epitome of forward-thinking design, where bold concepts meet refined execution.', 'Brand Strategy', 'We craft strategic foundations that define your brand''s identity, positioning, and messaging. Our approach ensures that every element aligns with your vision and resonates with your audience, creating a strong and lasting impact in your industry. Through research and insight-driven strategies, we help brands establish their voice, differentiate themselves from competitors, and create meaningful connections with their customers.', 'Visual Design', 'Our design process transforms ideas into striking visuals that capture your brand''s essence. From logo creation to comprehensive brand systems, we blend creativity with strategy to deliver a cohesive and visually compelling identity. Every design decision is made with intention, ensuring that your brand not only looks exceptional but also tells a compelling story that engages and inspires.', 'Launch', 'We guide brands from concept to execution, ensuring a seamless transition from strategy to market. Whether it''s a full-scale brand rollout or a product launch, we provide the tools and assets needed to establish a strong presence and drive engagement. Our expertise in digital and physical touchpoints ensures that your brand makes an impactful debut, creating momentum and lasting visibility in your industry.', 'Insights', '', 'Sennheiser', 'Blending heritage with modernity, we created a digital experience that captures Saint Laurent''s timeless elegance. The result is an intuitive and immersive journey that reflects the brand''s bold sophistication.', 17, 'Golden Hour', 'Blending heritage with modernity, we created a digital experience that captures Saint Laurent''s timeless elegance. The result is an intuitive and immersive journey that reflects the brand''s bold sophistication.', 16, 'All Natural', 'Blending heritage with modernity, we created a digital experience that captures Saint Laurent''s timeless elegance. The result is an intuitive and immersive journey that reflects the brand''s bold sophistication.', 15, 'Jeep', 'Blending heritage with modernity, we created a digital experience that captures Saint Laurent''s timeless elegance. The result is an intuitive and immersive journey that reflects the brand''s bold sophistication.', 13, 'Clients', 'Nike\r\nElectronic Arts\r\nZapier\r\nBrownkind\r\nTonal\r\nMountain Hardwear\r\nAppfire\r\nTAE\r\n22 System\r\nArticle One Eyewear\r\nBetter World\r\nGucci\r\nSalt & Stone\r\nAudi\r\nLululemon\r\nPuma', 'Industries', 'Travel\r\nSports & Fitness\r\nMedia & Entertainment\r\nBeauty\r\nGaming\r\nFood & Beverage\r\nCyber\r\nEnergy\r\nBanking & Finance\r\nHealth & Wellness\r\nApparel & Lifestyle\r\nHome Goods\r\nEmerging Technology\r\nHospitality\r\nAutomotive');

INSERT INTO about_gallery (id, image_path, order_index, created_at, updated_at) VALUES 
('550e8400-e29b-41d4-a716-446655440002', '/uploads/about-gallery-1755291463542-612868440.jpg', 1, '2025-08-15 20:57:43', '2025-08-15 20:58:31'),
('550e8400-e29b-41d4-a716-446655440003', '/uploads/about-gallery-1755291468322-407824118.jpg', 2, '2025-08-15 20:57:48', '2025-08-15 20:58:31'),
('550e8400-e29b-41d4-a716-446655440004', '/uploads/about-gallery-1755291474493-817369598.jpg', 3, '2025-08-15 20:57:54', '2025-08-15 20:58:31'),
('550e8400-e29b-41d4-a716-446655440005', '/uploads/about-gallery-1755291483125-259379146.jpg', 4, '2025-08-15 20:58:03', '2025-08-15 20:58:31'),
('550e8400-e29b-41d4-a716-446655440006', '/uploads/about-gallery-1755291516365-214062566.jpg', 4, '2025-08-15 20:58:36', '2025-08-15 20:58:36');

INSERT INTO about_slider (id, title, subtitle, sub_subtitle, image_path, order_index, created_at, updated_at) VALUES 
('550e8400-e29b-41d4-a716-446655440007', 'Sennheiser', '"From concept to execution, their attention to detail and artistic craftsmanship create compelling stories that leave a lasting impression."', '— Noah Bennett, CEO', 'slider-1755374548311-347802720.jpg', 1, '2025-08-16 20:02:28', '2025-08-16 20:02:28'),
('550e8400-e29b-41d4-a716-446655440008', 'Minimal Brew', '"Their dedication to pushing creative boundaries sets them apart. Every project feels unique, immersive, and deeply thoughtful."', '— Ava Chen, VP', 'slider-1755375133927-28923622.jpg', 2, '2025-08-16 20:12:13', '2025-08-16 20:12:13');

INSERT INTO awards (id, title, link, date, created_at, updated_at, subtitle, halo) VALUES 
('550e8400-e29b-41d4-a716-446655440009', ' SOTD', 'https://www.awwwards.com/', 'Mar ''25', '2025-08-16 18:48:47', '2025-08-17 11:41:48', 'Awwwards', 'Halo+'),
('550e8400-e29b-41d4-a716-446655440010', 'UI', 'https://www.awwwards.com/', 'Feb ''25', '2025-08-16 19:38:45', '2025-08-16 19:38:45', 'CSSDA', 'Spectrum');

INSERT INTO contact (id, title, phone, email, instagram, linkedin, address_line1, address_line2, studio_hours_weekdays, studio_hours_weekend, image_path, created_at, updated_at) VALUES 
('550e8400-e29b-41d4-a716-446655440011', 'Let''s connect and bring your ideas to life', '+45 123 456 789', 'hello@lucastudio.com', 'https://instagram.com/lucastudio', 'https://linkedin.com/company/lucastudio', '12 Nyhavn Street', 'Copenhagen, Denmark, 1051', 'Monday to Friday: 9:00 AM – 6:00 PM', 'Saturday & Sunday: Closed', 'contact-1755454728186-174679198.jpg', '2025-08-17 18:18:48', '2025-08-17 18:18:48');

INSERT INTO intro_banners (id, image, title_line1, title_line2, button_text, button_link, order_index) VALUES 
('550e8400-e29b-41d4-a716-446655440012', '/uploads/introbanner-1754832596941.jpg', NULL, NULL, NULL, NULL, 2),
('550e8400-e29b-41d4-a716-446655440013', '/uploads/introbanner-1754832651214.jpg', 'Redefining creativity for the', 'future with flawless execution.', 'VIEW PROJECTS', '/about', 3),
('550e8400-e29b-41d4-a716-446655440014', '/uploads/introbanner-1754911576790.jpg', '', '', '', '', 1);

INSERT INTO news (id, title, category_text, photographer, subtitle, slug, content, image_path, aspect_ratio, published_at, featured, created_at, updated_at) VALUES 
('550e8400-e29b-41d4-a716-446655440015', 'Minimalism highlights what matters by removing what doesn''t. It''s design with intention and clarity.', 'DESIGN', 'Anna Surokin', 'The Art of Minimalism: Creating Impactful Designs with Less', 'sustainable-design', '<p>We believe in pushing the boundaries of design, storytelling, and innovation to create brands that not only look stunning but also leave a positive impact on the world. That''s why we''re thrilled to introduce our latest project—a groundbreaking initiative that redefines sustainable branding from the ground up.</p>\r\n\r\n<h2>Rethinking Sustainability in Branding</h2>\r\n<p>The traditional approach to sustainability in branding has often been limited to eco-friendly materials, minimalist packaging, and carbon offset programs. While these are important steps, we believe sustainability in branding should be more holistic. Our new project is centered on a multi-dimensional approach that integrates sustainability into every aspect of a brand''s identity—ethically, visually, and operationally.</p>\r\n\r\n<h2>A New Vision for Conscious Branding</h2>\r\n\r\n<p>Our project takes a deep dive into sustainable branding by focusing on three key pillars:</p>\r\n<ol>\r\n<li><strong>Ethical Storytelling:</strong> We help brands develop authentic narratives that align with their sustainability mission, ensuring that transparency and integrity are at the forefront of their communication.</li>\r\n<li><strong>Eco-Conscious Design:</strong> From logo development to packaging and digital assets, we use sustainable design principles that minimize environmental impact while maximizing aesthetic and functional appeal</li>\r\n<li><strong>Long-Term Impact:</strong> We guide brands toward sustainable business strategies that prioritize longevity over short-term gains, helping them implement responsible sourcing, circular economy practices, and low-carbon operations.\r\n</li>\r\n</ol>\r\n\r\n<h2>Collaboration With Changemakers</h2>\r\n<p>We''re proud to be collaborating with a diverse network of environmental experts, material innovators, and conscious business leaders to bring this vision to life. By working alongside these changemakers, we ensure that the brands we design are not just visually compelling but also rooted in meaningful, sustainable practices.</p>\r\n\r\n<h2>The Future of Sustainable Branding</h2>\r\n<p>This project isn''t just about creating beautiful brands; it''s about designing identities that stand the test of time—both aesthetically and ethically. We envision a future where sustainable branding is the norm, not the exception. By helping businesses align their values with their visual and operational identity, we''re taking one step closer to that future.</p>\r\n\r\n<p>We''re excited to embark on this journey and invite brands that share our passion for sustainability to join us. If you''re looking to redefine your brand with purpose and impact, let''s create something extraordinary together.</p>\r\n\r\n<p>Stay tuned as we continue to unveil insights, case studies, and innovations from our sustainable branding initiative. Let''s build brands that matter—for people and the planet.</p>', 'journal1.jpg', 'aspect-square', '2025-08-13 10:07:01', TRUE, '2025-08-13 10:07:01', '2025-08-15 10:00:15'),
('550e8400-e29b-41d4-a716-446655440016', 'ART DIRECTION', 'DESIGN', 'Anna Surokin', 'Art Direction from scratch: Creating a unique art direction for a brand', 'urban-inspiration', '<p>Art direction is the backbone of brand identity. It''s the visual language that communicates your brand''s personality, values, and story to your audience. Creating a unique art direction requires deep understanding of both the brand and its target audience.</p><p>From color palettes and typography to photography style and layout principles, every element must work together to create a cohesive visual experience that resonates with your audience.</p>', 'journal2.jpg', 'aspect-[3/2]', '2025-08-13 10:07:01', TRUE, '2025-08-13 10:07:01', '2025-08-13 10:07:01'),
('550e8400-e29b-41d4-a716-446655440017', 'DESIGN', 'DESIGN', 'Anna Surokin', 'We launched a new project redefining sustainable branding', 'material-matters', '<p>Sustainability is no longer just a trend - it''s a necessity. Our latest project explores how brands can integrate sustainable practices into their visual identity and communication strategies.</p><p>From eco-friendly materials and production processes to messaging that reflects environmental consciousness, sustainable branding requires a holistic approach that considers every touchpoint of the brand experience.</p>', 'journal3.jpg', 'aspect-square', '2025-08-13 10:07:01', TRUE, '2025-08-13 10:07:01', '2025-08-13 10:07:01');

INSERT INTO projects (id, title, subtitle, slug, thumbnail_media, banner_media, video_url, description, featured, created_at, updated_at, client_name, year, role, external_link) VALUES 
('550e8400-e29b-41d4-a716-446655440018', 'Jeep', 'Power, precision, and adventure redefined.', 'Jeep', 'uploads\\1754421757616-769464803.jpg', 'uploads\\1754421757616-740757983.jpg', NULL, 'In this project, we were approached by a startup called "Green Wave" to develop a brand identity that reflected their commitment to sustainability and environmental conservation.\n\nThe client''s goal was to create a brand identity that would resonate with environmentally conscious consumers and help position their business as a leader in sustainable practices. Objectives included increasing brand awareness and driving customer engagement.\n\nOur approach was to create a brand identity that communicated Green Wave''s values of sustainability, innovation, and authenticity. We developed a brand strategy that focused on creating a unique and memorable visual identity that would differentiate the brand from its competitors.', TRUE, '2025-08-05 19:22:37', '2025-08-08 12:47:03', 'Stellantis', 2024, 'Website', 'https://ena.supply/'),
('550e8400-e29b-41d4-a716-446655440019', 'All Natural', 'The next wave of pure natural skincare', 'all-natural', 'uploads\\1754674469699-737691846.mp4', 'uploads\\1754674469701-675663703.jpg', NULL, 'In this project, we were approached by a startup called "Green Wave" to develop a brand identity that reflected their commitment to sustainability and environmental conservation.\r\n\r\nThe client''s goal was to create a brand identity that would resonate with environmentally conscious consumers and help position their business as a leader in sustainable practices. Objectives included increasing brand awareness and driving customer engagement.\r\n\r\nOur approach was to create a brand identity that communicated Green Wave''s values of sustainability, innovation, and authenticity. We developed a brand strategy that focused on creating a unique and memorable visual identity that would differentiate the brand from its competitors.', TRUE, '2025-08-08 17:34:29', '2025-08-08 17:34:29', 'Ena Studio', 2023, 'WebSite', 'https://ena.supply/'),
('550e8400-e29b-41d4-a716-446655440020', 'Golden Hour', 'A timeless toast to refined elegance.', 'Golden-Hour', 'uploads\\1754679359493-200028473.jpg', 'uploads\\1754679359494-813147258.jpg', NULL, 'In this project, we were approached by a startup called "Green Wave" to develop a brand identity that reflected their commitment to sustainability and environmental conservation.\r\n\r\nThe client''s goal was to create a brand identity that would resonate with environmentally conscious consumers and help position their business as a leader in sustainable practices. Objectives included increasing brand awareness and driving customer engagement.\r\n\r\nOur approach was to create a brand identity that communicated Green Wave''s values of sustainability, innovation, and authenticity. We developed a brand strategy that focused on creating a unique and memorable visual identity that would differentiate the brand from its competitors.', TRUE, '2025-08-08 18:55:59', '2025-08-08 18:55:59', 'Louis Vuitton', 2025, 'Website', 'https://ena.supply/'),
('550e8400-e29b-41d4-a716-446655440021', 'Sennheiser', 'Immersive sound meets minimalist design.', 'sennheiser', 'uploads\\1754679886853-191485567.jpg', 'uploads\\1754679886856-238727834.jpg', NULL, 'In this project, we were approached by a startup called "Green Wave" to develop a brand identity that reflected their commitment to sustainability and environmental conservation.\r\n\r\nThe client''s goal was to create a brand identity that would resonate with environmentally conscious consumers and help position their business as a leader in sustainable practices. Objectives included increasing brand awareness and driving customer engagement.\r\n\r\nOur approach was to create a brand identity that communicated Green Wave''s values of sustainability, innovation, and authenticity. We developed a brand strategy that focused on creating a unique and memorable visual identity that would differentiate the brand from its competitors.', TRUE, '2025-08-08 19:04:46', '2025-08-11 15:42:09', 'Sonova Holding AG', 2024, 'Website', 'https://ena.supply/');

INSERT INTO project_gallery (id, project_id, image_path, sort) VALUES 
('550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440018', 'uploads\\1754592410981-894450477.jpg', 0),
('550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440018', 'uploads\\1754592414603-806857595.jpg', 0),
('550e8400-e29b-41d4-a716-446655440024', '550e8400-e29b-41d4-a716-446655440018', 'uploads\\1754592424642-195148600.mp4', 0),
('550e8400-e29b-41d4-a716-446655440025', '550e8400-e29b-41d4-a716-446655440018', 'uploads\\1754592428843-226724001.jpg', 0),
('550e8400-e29b-41d4-a716-446655440026', '550e8400-e29b-41d4-a716-446655440018', 'uploads\\1754592440249-69497598.jpg', 0),
('550e8400-e29b-41d4-a716-446655440027', '550e8400-e29b-41d4-a716-446655440018', 'uploads\\1754592442912-951363068.mp4', 0),
('550e8400-e29b-41d4-a716-446655440028', '550e8400-e29b-41d4-a716-446655440018', 'uploads\\1754592445350-474167658.jpg', 0),
('550e8400-e29b-41d4-a716-446655440029', '550e8400-e29b-41d4-a716-446655440019', 'uploads\\1754678985763-542213049.jpg', 0),
('550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440019', 'uploads\\1754678994238-295985177.jpg', 0),
('550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440019', 'uploads\\1754679008655-796439891.mp4', 0),
('550e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440019', 'uploads\\1754679016816-793087398.jpg', 0),
('550e8400-e29b-41d4-a716-446655440033', '550e8400-e29b-41d4-a716-446655440019', 'uploads\\1754679023542-755720944.jpg', 0),
('550e8400-e29b-41d4-a716-446655440034', '550e8400-e29b-41d4-a716-446655440019', 'uploads\\1754679031123-26809102.mp4', 0),
('550e8400-e29b-41d4-a716-446655440035', '550e8400-e29b-41d4-a716-446655440019', 'uploads\\1754679040458-990897802.jpg', 0),
('550e8400-e29b-41d4-a716-446655440036', '550e8400-e29b-41d4-a716-446655440020', 'uploads\\1754679427783-925650659.jpg', 0),
('550e8400-e29b-41d4-a716-446655440037', '550e8400-e29b-41d4-a716-446655440020', 'uploads\\1754679436683-947795366.jpg', 0),
('550e8400-e29b-41d4-a716-446655440038', '550e8400-e29b-41d4-a716-446655440020', 'uploads\\1754679440689-48511275.mp4', 0),
('550e8400-e29b-41d4-a716-446655440039', '550e8400-e29b-41d4-a716-446655440020', 'uploads\\1754679445281-472484174.jpg', 0),
('550e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440020', 'uploads\\1754679450784-360382934.jpg', 0),
('550e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440020', 'uploads\\1754679454866-13097543.mp4', 0),
('550e8400-e29b-41d4-a716-446655440042', '550e8400-e29b-41d4-a716-446655440020', 'uploads\\1754679459518-222581554.jpg', 0);

INSERT INTO users (id, username, password_hash, created_at) VALUES 
('550e8400-e29b-41d4-a716-446655440043', 'admin', '$2a$12$SoYFPdteOvgbPELzHwClb.O71XQ6/xpzD2aFHzS5PBSLGq9.uVBKa', '2025-07-30 17:19:22');

INSERT INTO what_we_do (id, title, subtitle, service_1_title, service_1_items, service_2_title, service_2_items, service_3_title, service_3_items, created_at, updated_at) VALUES 
('550e8400-e29b-41d4-a716-446655440044', 'What We Do', 'We craft experiences and identities that resonate deeply, forging connections between brands and the people who embrace them.', 'Brand Strategy', 'Brand Audit\nResearch\nAudience\nCompetitive Analysis\nPositioning\nTone of Voice\nSocial Media', 'Brand System', 'Naming\nMessaging Toolkit\nLogo\nPhotography Style\nIcon & Illustration\nMotion\nBrand Standards', 'Brand Experience', 'Signage / Wayfinding\nBrand Campaign\nWebsite\nBusiness Collateral\nPackaging\nPrint\nCopywriting', '2025-08-17 17:35:51', '2025-08-17 18:44:03');

-- Enable Row Level Security
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_slider ENABLE ROW LEVEL SECURITY;
ALTER TABLE awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact ENABLE ROW LEVEL SECURITY;
ALTER TABLE intro_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE what_we_do ENABLE ROW LEVEL SECURITY;

-- Create public read policies
CREATE POLICY "Public read access" ON about_content FOR SELECT USING (true);
CREATE POLICY "Public read access" ON about_gallery FOR SELECT USING (true);
CREATE POLICY "Public read access" ON about_slider FOR SELECT USING (true);
CREATE POLICY "Public read access" ON awards FOR SELECT USING (true);
CREATE POLICY "Public read access" ON contact FOR SELECT USING (true);
CREATE POLICY "Public read access" ON intro_banners FOR SELECT USING (true);
CREATE POLICY "Public read access" ON news FOR SELECT USING (true);
CREATE POLICY "Public read access" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read access" ON project_gallery FOR SELECT USING (true);
CREATE POLICY "Public read access" ON what_we_do FOR SELECT USING (true);

-- Create admin write policies (service role key ile)
CREATE POLICY "Admin write access" ON about_content FOR ALL USING (true);
CREATE POLICY "Admin write access" ON about_gallery FOR ALL USING (true);
CREATE POLICY "Admin write access" ON about_slider FOR ALL USING (true);
CREATE POLICY "Admin write access" ON awards FOR ALL USING (true);
CREATE POLICY "Admin write access" ON contact FOR ALL USING (true);
CREATE POLICY "Admin write access" ON intro_banners FOR ALL USING (true);
CREATE POLICY "Admin write access" ON news FOR ALL USING (true);
CREATE POLICY "Admin write access" ON projects FOR ALL USING (true);
CREATE POLICY "Admin write access" ON project_gallery FOR ALL USING (true);
CREATE POLICY "Admin write access" ON what_we_do FOR ALL USING (true);
