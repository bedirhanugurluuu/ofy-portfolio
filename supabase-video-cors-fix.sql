-- Supabase Storage CORS ayarlarını düzeltmek için
-- Bu script'i Supabase SQL Editor'da çalıştırın

-- Storage bucket'ları için CORS politikalarını güncelle
UPDATE storage.buckets 
SET public = true, 
    file_size_limit = 52428800, -- 50MB
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime']
WHERE id = 'uploads';

-- Video dosyaları için özel RLS politikaları
CREATE POLICY "Public read access for videos" ON storage.objects
FOR SELECT USING (
  bucket_id = 'uploads' AND 
  (storage.extension(name) = 'mp4' OR storage.extension(name) = 'webm' OR storage.extension(name) = 'mov')
);

-- Tüm dosyalar için genel okuma erişimi
CREATE POLICY "Public read access for all files" ON storage.objects
FOR SELECT USING (bucket_id = 'uploads');

-- Dosya yükleme politikası (sadece authenticated kullanıcılar)
CREATE POLICY "Authenticated users can upload files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'uploads' AND 
  auth.role() = 'authenticated'
);

-- Dosya güncelleme politikası
CREATE POLICY "Authenticated users can update files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'uploads' AND 
  auth.role() = 'authenticated'
);

-- Dosya silme politikası
CREATE POLICY "Authenticated users can delete files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'uploads' AND 
  auth.role() = 'authenticated'
);

-- Storage bucket'ı public yap
UPDATE storage.buckets SET public = true WHERE id = 'uploads';
