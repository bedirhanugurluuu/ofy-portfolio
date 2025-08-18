# Vercel Deployment Rehberi

## 1. GitHub Repository Hazırlığı

Projenizi GitHub'a push edin:

```bash
git add .
git commit -m "Supabase migration completed - ready for Vercel deployment"
git push origin main
```

## 2. Vercel Dashboard'dan Deploy

### Adım 1: Vercel'e Giriş
1. [vercel.com](https://vercel.com) adresine gidin
2. GitHub hesabınızla giriş yapın

### Adım 2: Yeni Proje Oluşturma
1. **"New Project" butonuna tıklayın**
2. **GitHub repository'nizi seçin**: `portfolio-ofy`
3. **Framework Preset**: Next.js (otomatik seçilecek)
4. **Root Directory**: `./` (varsayılan)
5. **Build Command**: `npm run build` (varsayılan)
6. **Output Directory**: `.next` (varsayılan)

### Adım 3: Deploy
1. **"Deploy" butonuna tıklayın**
2. İlk deployment tamamlanana kadar bekleyin

## 3. Environment Variables Ayarlama

### Adım 1: Project Settings
1. Deploy tamamlandıktan sonra projenize gidin
2. **"Settings" sekmesine tıklayın**
3. **"Environment Variables" bölümüne gidin**

### Adım 2: Variables Ekleme
Aşağıdaki environment variables'ları ekleyin:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://lsxafginsylkeuyzuiau.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzeAFmZ2luc3lsa2V1eXp1aWF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MzAzMzcsImV4cCI6MjA3MTEwNjMzN30.vMhXeNO2vsne3mmFUfc5vXBLORyGpdu2vv9NyCyQo8U` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzeAFmZ2luc3lsa2V1eXp1aWF1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTUzMDMzNywiZXhwIjoyMDcxMTA2MzM3fQ.W02DluunU-jOQfLhvEYzcR9OjdutSruUM53CtKbdRfo` | Production, Preview, Development |
| `NEXT_PUBLIC_API_BASE_URL` | `https://your-vercel-domain.vercel.app` | Production, Preview, Development |
| `NEXT_PUBLIC_SITE_URL` | `https://your-vercel-domain.vercel.app` | Production, Preview, Development |

**Not**: `your-vercel-domain.vercel.app` kısmını Vercel'in size verdiği gerçek domain ile değiştirin.

### Adım 3: Redeploy
1. Environment variables'ları ekledikten sonra
2. **"Deployments" sekmesine gidin**
3. **"Redeploy" butonuna tıklayın**

## 4. Custom Domain (Opsiyonel)

### Adım 1: Domain Ekleme
1. **"Settings > Domains" bölümüne gidin**
2. **"Add Domain" butonuna tıklayın**
3. Domain adınızı girin (örn: `portfolio.yourdomain.com`)

### Adım 2: DNS Ayarları
Vercel size DNS ayarlarını verecek. Domain sağlayıcınızda bu ayarları yapın.

## 5. Test Etme

### Adım 1: Ana Sayfa Testi
1. Vercel domain'inize gidin
2. Ana sayfa yüklenmelidir
3. Console'da hata olup olmadığını kontrol edin

### Adım 2: API Testi
1. `/api/projects` endpoint'ini test edin
2. Supabase'den veri gelip gelmediğini kontrol edin

### Adım 3: Image Testi
1. Sayfadaki resimlerin yüklenip yüklenmediğini kontrol edin
2. Supabase Storage URL'lerinin çalışıp çalışmadığını kontrol edin

## 6. Sorun Giderme

### Hata: "Build failed"
- Environment variables'ların doğru ayarlandığından emin olun
- Build loglarını kontrol edin

### Hata: "API routes not working"
- Supabase URL ve key'lerin doğru olduğundan emin olun
- Supabase projesinin aktif olduğunu kontrol edin

### Hata: "Images not loading"
- Supabase Storage bucket'larının oluşturulduğundan emin olun
- Storage policies'nin doğru ayarlandığını kontrol edin

## 7. Avantajlar

✅ **Global CDN**: Vercel'in global CDN'i ile hızlı erişim
✅ **Automatic Deployments**: GitHub'a push ettiğinizde otomatik deploy
✅ **Preview Deployments**: Pull request'ler için otomatik preview
✅ **Edge Functions**: Serverless functions desteği
✅ **Analytics**: Built-in analytics ve performance monitoring
✅ **SSL**: Otomatik SSL sertifikaları

## 8. Production Checklist

- [ ] Environment variables ayarlandı
- [ ] Supabase projesi aktif
- [ ] Storage bucket'ları oluşturuldu
- [ ] Database schema çalıştırıldı
- [ ] Ana sayfa yükleniyor
- [ ] API routes çalışıyor
- [ ] Resimler yükleniyor
- [ ] Custom domain ayarlandı (opsiyonel)
- [ ] SSL sertifikası aktif
- [ ] Analytics aktif (opsiyonel)
