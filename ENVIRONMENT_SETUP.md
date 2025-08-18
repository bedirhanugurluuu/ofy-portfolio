# Environment Variables Setup Guide

## 📁 Dosya Yapısı

```
portfolio-ofy/
├── env.example              # Ana proje - Production örneği
├── env.local.example        # Ana proje - Local development örneği
└── temp-admin-panel/
    └── env.example          # Admin panel - Tüm environment'lar için
```

## 🚀 Kurulum

### 1. Ana Proje (Next.js)

**Local Development için:**
```bash
cp env.local.example .env.local
```

**Production için:**
```bash
cp env.example .env.local
# Sonra Vercel Dashboard'da environment variables ayarlayın
```

### 2. Admin Panel (Vite)

**Tüm environment'lar için:**
```bash
cd temp-admin-panel
cp env.example .env
```

## 🔧 Environment Variables

### Ana Proje (.env.local)
```env
# Frontend Environment Variables
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://lsxafginsylkeuyzuiau.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# JWT Secret (if using authentication)
JWT_SECRET=your-super-secret-jwt-key

# Upload Configuration
UPLOAD_PATH=./uploads
```

### Admin Panel (.env)
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://lsxafginsylkeuyzuiau.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api

# Authentication (if needed)
VITE_JWT_SECRET=your-super-secret-jwt-key
```

## 🌍 Environment Değişiklikleri

### Local Development
- `NEXT_PUBLIC_API_BASE_URL`: `http://localhost:3000/api`
- `NEXT_PUBLIC_SITE_URL`: `http://localhost:3000`
- `VITE_API_BASE_URL`: `http://localhost:3000/api`

### Production (Vercel)
- `NEXT_PUBLIC_API_BASE_URL`: `https://your-domain.vercel.app/api`
- `NEXT_PUBLIC_SITE_URL`: `https://your-domain.vercel.app`
- `VITE_API_BASE_URL`: `https://your-domain.vercel.app/api`

## ✅ Kontrol Listesi

- [ ] Ana proje `.env.local` dosyası oluşturuldu
- [ ] Admin panel `.env` dosyası oluşturuldu
- [ ] Supabase URL ve key'ler doğru
- [ ] API URL'leri environment'a uygun
- [ ] Vercel Dashboard'da environment variables ayarlandı

## 🚨 Önemli Notlar

1. **Supabase bilgileri** her iki projede de aynı
2. **API URL'leri** environment'a göre değişiyor
3. **Production'da** Vercel Dashboard'dan environment variables ayarlayın
4. **Local development'ta** `.env.local` ve `.env` dosyaları kullanın

## 🔍 Test Etme

### Ana Proje
```bash
npm run dev
# http://localhost:3000 adresine gidin
```

### Admin Panel
```bash
cd temp-admin-panel
npm run dev
# http://localhost:5173 adresine gidin
```
