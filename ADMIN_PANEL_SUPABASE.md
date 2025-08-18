# Admin Panel - Supabase Storage Entegrasyonu

## 🎯 Özet

Admin panel'iniz artık tamamen Supabase Storage ile entegre! Bu sayede:

✅ **Resim yükleme**: Direkt Supabase Storage'a kaydediliyor
✅ **Resim silme**: Supabase Storage'dan otomatik siliniyor  
✅ **Video yükleme**: Supabase Storage'a kaydediliyor
✅ **Video silme**: Supabase Storage'dan otomatik siliniyor
✅ **Güncelleme**: Eski dosyalar otomatik silinip yenileri yükleniyor

## 🔧 Yapılan Değişiklikler

### 1. Supabase Client Konfigürasyonu
- `temp-admin-panel/src/config/supabase.ts` - Supabase client
- `temp-admin-panel/src/utils/supabaseStorage.ts` - Storage utility fonksiyonları

### 2. ProjectForm Güncellemeleri
- Dosya yükleme: Supabase Storage'a direkt upload
- Dosya silme: Eski dosyalar otomatik siliniyor
- Form validation: Hata yönetimi geliştirildi
- UI: Mevcut dosyaları görüntüleme

### 3. ProjectList Güncellemeleri
- Silme işlemi: Hem database hem storage'dan siliniyor
- Görsel gösterimi: Supabase Storage URL'leri
- Tablo: Yeni alanlar eklendi (kategori, müşteri, yıl, öne çıkan)

### 4. Type Güncellemeleri
- `Project` interface: Supabase schema'sına uygun
- UUID ID formatı
- Yeni alanlar (category, client, year, featured)

## 🚀 Kullanım

### Resim/Video Yükleme
1. Admin panel'de proje ekleme/düzenleme sayfasına gidin
2. "Proje Görseli" veya "Proje Videosu" alanından dosya seçin
3. Formu kaydedin
4. Dosya otomatik olarak Supabase Storage'a yüklenecek

### Resim/Video Silme
1. Proje listesinde "Sil" butonuna tıklayın
2. Onay verin
3. Dosya hem database'den hem Supabase Storage'dan silinecek

### Güncelleme
1. Mevcut bir projeyi düzenleyin
2. Yeni dosya seçin
3. Eski dosya otomatik silinip yeni dosya yüklenecek

## 📁 Storage Bucket Yapısı

```
Supabase Storage/
├── projects/          # Proje görselleri ve videoları
├── news/             # Haber görselleri
├── about/            # Hakkımızda görselleri
├── awards/           # Ödül görselleri
├── slider/           # Slider görselleri
├── intro-banners/    # Intro banner görselleri
├── about-gallery/    # Hakkımızda galeri görselleri
└── contact/          # İletişim görselleri
```

## 🔐 Güvenlik

### Row Level Security (RLS)
- Tüm bucket'lar için RLS aktif
- Public read access: Herkes okuyabilir
- Authenticated write access: Sadece yetkili kullanıcılar yazabilir

### Dosya Güvenliği
- Unique filename generation: Çakışma önleme
- MIME type validation: Güvenli dosya türleri
- File size limits: 50MB maksimum
- Allowed file types: image/*, video/*

## 🛠️ Kurulum

### 1. Environment Variables
`temp-admin-panel/.env` dosyası oluşturun:

```env
VITE_SUPABASE_URL=https://lsxafginsylkeuyzuiau.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzeAFmZ2luc3lsa2V1eXp1aWF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MzAzMzcsImV4cCI6MjA3MTEwNjMzN30.vMhXeNO2vsne3mmFUfc5vXBLORyGpdu2vv9NyCyQo8U
VITE_API_BASE_URL=http://localhost:3000/api
```

### 2. Dependencies
```bash
cd temp-admin-panel
npm install @supabase/supabase-js
```

### 3. Development Server
```bash
npm run dev
```

## 📊 Avantajlar

### Performans
- **Global CDN**: Dünya çapında hızlı erişim
- **Optimized Images**: Otomatik optimizasyon
- **Caching**: Akıllı cache stratejisi

### Güvenlik
- **SSL**: Otomatik SSL sertifikaları
- **Access Control**: Granular permission system
- **Virus Scanning**: Built-in güvenlik taraması

### Ölçeklenebilirlik
- **Unlimited Storage**: Büyüyen ihtiyaçlar
- **Auto-scaling**: Otomatik ölçeklendirme
- **Backup**: Otomatik yedekleme

## 🔍 Test Etme

### 1. Dosya Yükleme Testi
```javascript
// Browser console'da test edin
const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
const { data, error, publicUrl } = await uploadFile('PROJECTS', file);
console.log('Upload result:', { data, error, publicUrl });
```

### 2. Dosya Silme Testi
```javascript
// Browser console'da test edin
const { data, error } = await deleteFile('PROJECTS', 'filename.jpg');
console.log('Delete result:', { data, error });
```

### 3. URL Testi
```javascript
// Supabase Storage URL'lerini test edin
const url = 'https://lsxafginsylkeuyzuiau.supabase.co/storage/v1/object/public/projects/filename.jpg';
fetch(url).then(response => console.log('Status:', response.status));
```

## 🚨 Sorun Giderme

### Hata: "Missing Supabase environment variables"
- `.env` dosyasının doğru konumda olduğundan emin olun
- Environment variables'ların doğru yazıldığını kontrol edin

### Hata: "Upload failed"
- Dosya boyutunun 50MB altında olduğunu kontrol edin
- Dosya türünün desteklendiğini kontrol edin
- Supabase projesinin aktif olduğunu kontrol edin

### Hata: "Delete failed"
- Dosya adının doğru olduğunu kontrol edin
- Supabase Storage bucket'ının mevcut olduğunu kontrol edin

## 📈 Monitoring

### Supabase Dashboard
- [supabase.com/dashboard](https://supabase.com/dashboard)
- Storage usage monitoring
- File access logs
- Performance metrics

### Vercel Analytics (Production)
- File delivery performance
- CDN hit rates
- Geographic distribution

## 🎉 Sonuç

Admin panel'iniz artık tamamen Supabase Storage ile entegre! Bu sayede:

- **Güvenli dosya yönetimi**
- **Hızlı global erişim**
- **Otomatik yedekleme**
- **Ölçeklenebilir altyapı**

Herhangi bir sorunuz olursa yardımcı olmaktan memnuniyet duyarım! 🚀
