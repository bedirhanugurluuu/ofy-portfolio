# Supabase Kurulum Talimatları

## 1. Supabase Projesi Oluşturma

1. [supabase.com](https://supabase.com) adresine gidin
2. GitHub ile giriş yapın
3. "New Project" butonuna tıklayın
4. Proje adı: `portfolio-ofy`
5. Database password oluşturun (güvenli bir şifre)
6. Region seçin (Avrupa için `West Europe` önerilir)
7. "Create new project" butonuna tıklayın

## 2. Database Schema Oluşturma

1. Supabase Dashboard'da projenizi seçin
2. Sol menüden "SQL Editor" seçin
3. `supabase_schema.sql` dosyasının içeriğini kopyalayın
4. SQL Editor'a yapıştırın ve "Run" butonuna tıklayın

## 3. Storage Buckets Oluşturma

1. Aynı SQL Editor'da `supabase_storage_setup.sql` dosyasının içeriğini kopyalayın
2. SQL Editor'a yapıştırın ve "Run" butonuna tıklayın
3. Bu işlem storage bucket'larını ve güvenlik politikalarını oluşturacak

## 4. Environment Variables Ayarlama

1. Supabase Dashboard'da "Settings > API" bölümüne gidin
2. Aşağıdaki bilgileri kopyalayın:
   - **Project URL**
   - **anon public** key
   - **service_role** key (dikkatli olun, bu çok güçlü bir anahtar)

3. Proje kök dizininde `.env.local` dosyası oluşturun:

```env
# Frontend Environment Variables
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# JWT Secret (if using authentication)
JWT_SECRET=your-super-secret-jwt-key

# Upload Configuration
UPLOAD_PATH=./uploads
```

4. `your-supabase-project-url`, `your-supabase-anon-key`, ve `your-supabase-service-role-key` değerlerini kopyaladığınız gerçek değerlerle değiştirin.

## 5. Projeyi Çalıştırma

```bash
npm run dev
```

## 6. Test Etme

1. Tarayıcıda `http://localhost:3000` adresine gidin
2. Ana sayfa yüklenmelidir
3. Console'da hata olup olmadığını kontrol edin
4. Admin panel'den dosya yükleme işlemini test edin

## 7. Admin Panel Güncelleme

Admin panel de Supabase kullanacak şekilde güncellenmiştir. Admin panel için:

1. `temp-admin-panel` klasörüne gidin
2. `npm install` çalıştırın
3. `.env` dosyasında Supabase bilgilerini ayarlayın
4. `npm run dev` ile çalıştırın

## 8. Production Deployment

### Vercel Deployment

1. Vercel'de environment variables'ları ayarlayın:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

2. Deploy edin

### Netlify Deployment

1. Netlify'da environment variables'ları ayarlayın
2. Build command: `npm run build`
3. Publish directory: `.next`

## 9. Storage Avantajları

✅ **Global CDN**: Dosyalar dünya çapında hızlı erişim
✅ **Otomatik Backup**: Dosyalar otomatik yedeklenir
✅ **Scalable**: Büyük dosyalar için sınırsız depolama
✅ **Security**: Row Level Security ile dosya erişim kontrolü
✅ **Image Transformations**: Otomatik resim boyutlandırma
✅ **No Server Management**: Sunucu yönetimi gerekmez

## 10. Sorun Giderme

### Hata: "Invalid API key"
- Environment variables'ların doğru ayarlandığından emin olun
- Supabase projesinin aktif olduğunu kontrol edin

### Hata: "Table does not exist"
- SQL schema'nın çalıştırıldığından emin olun
- Supabase Dashboard'da "Table Editor" bölümünde tabloların oluştuğunu kontrol edin

### Hata: "Storage bucket not found"
- Storage bucket'larının oluşturulduğundan emin olun
- Supabase Dashboard'da "Storage" bölümünde bucket'ları kontrol edin

### Hata: "Row Level Security"
- RLS policies'nin doğru ayarlandığından emin olun
- Service role key kullandığınızdan emin olun

### Hata: "File upload failed"
- Storage bucket'larının public olduğundan emin olun
- Dosya boyutunun limit altında olduğunu kontrol edin
- Dosya tipinin izin verilen türlerde olduğunu kontrol edin

## 11. Önemli Notlar

- **Service Role Key**: Bu anahtar çok güçlüdür, asla client-side'da kullanmayın
- **Anon Key**: Bu anahtar public olabilir, client-side'da kullanılabilir
- **RLS**: Row Level Security aktif, sadece gerekli tablolarda public read access var
- **UUID**: Tüm ID'ler artık UUID formatında
- **Storage**: Dosyalar artık Supabase Storage'da saklanıyor
- **CDN**: Tüm dosyalar global CDN üzerinden servis ediliyor

## 12. Avantajlar

✅ **Serverless**: Artık ayrı backend sunucusuna ihtiyaç yok
✅ **Scalable**: Supabase otomatik olarak ölçeklenir
✅ **Real-time**: Gerçek zamanlı veri değişiklikleri
✅ **Auth**: Built-in authentication sistemi
✅ **Storage**: Dosya yükleme için storage sistemi
✅ **Edge Functions**: Serverless functions desteği
✅ **Global CDN**: Dosyalar dünya çapında hızlı erişim
