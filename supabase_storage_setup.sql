-- Supabase Storage Buckets Setup

-- Projects bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('projects', 'projects', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'])
ON CONFLICT (id) DO NOTHING;

-- News bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('news', 'news', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- About bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('about', 'about', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Awards bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('awards', 'awards', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Slider bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('slider', 'slider', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Intro Banners bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('intro-banners', 'intro-banners', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- About Gallery bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('about-gallery', 'about-gallery', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Contact bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('contact', 'contact', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for public read access
CREATE POLICY "Public read access" ON storage.objects FOR SELECT USING (bucket_id IN (
  'projects', 'news', 'about', 'awards', 'slider', 'intro-banners', 'about-gallery', 'contact'
));

-- Storage Policies for authenticated users to upload
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id IN ('projects', 'news', 'about', 'awards', 'slider', 'intro-banners', 'about-gallery', 'contact')
);

-- Storage Policies for authenticated users to update
CREATE POLICY "Authenticated users can update" ON storage.objects FOR UPDATE USING (
  bucket_id IN ('projects', 'news', 'about', 'awards', 'slider', 'intro-banners', 'about-gallery', 'contact')
);

-- Storage Policies for authenticated users to delete
CREATE POLICY "Authenticated users can delete" ON storage.objects FOR DELETE USING (
  bucket_id IN ('projects', 'news', 'about', 'awards', 'slider', 'intro-banners', 'about-gallery', 'contact')
);
