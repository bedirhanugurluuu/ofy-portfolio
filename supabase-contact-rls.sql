-- Contact tablosu için RLS politikalarını etkinleştir
ALTER TABLE contact ENABLE ROW LEVEL SECURITY;

-- Mevcut politikaları temizle (eğer varsa)
DROP POLICY IF EXISTS "Contact is viewable by everyone" ON contact;
DROP POLICY IF EXISTS "Contact is editable by authenticated users" ON contact;

-- Herkes okuyabilir (public read)
CREATE POLICY "Contact is viewable by everyone" ON contact
  FOR SELECT USING (true);

-- Sadece authenticated kullanıcılar yazabilir
CREATE POLICY "Contact is editable by authenticated users" ON contact
  FOR ALL USING (auth.role() = 'authenticated');
