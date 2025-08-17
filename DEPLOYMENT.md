# 🚀 Vercel Deployment Guide - Merkezi API Sistemi

## 📋 Ön Gereksinimler

### 1. Database Setup
- **MySQL Database** (PlanetScale, Railway, AWS RDS, vb.)
- Database connection bilgileri

### 2. Environment Variables

#### Vercel Dashboard'da Environment Variables Ayarlayın:

```bash
# Database Configuration
DATABASE_HOST=your-database-host
DATABASE_USER=your-database-user
DATABASE_PASSWORD=your-database-password
DATABASE_NAME=your-database-name
DATABASE_PORT=3306

# Frontend Configuration
NEXT_PUBLIC_API_BASE_URL=https://your-vercel-domain.vercel.app/api
NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app

# JWT Secret (if using authentication)
JWT_SECRET=your-super-secret-jwt-key
```

## 🛠️ Deployment Adımları

### 1. Database Tablolarını Oluşturun
```sql
-- What We Do tablosu
CREATE TABLE IF NOT EXISTS what_we_do (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL DEFAULT 'What We Do',
  subtitle TEXT NOT NULL DEFAULT 'We create meaningful digital experiences that connect brands with their audiences.',
  service_1_title VARCHAR(255) NOT NULL DEFAULT 'Brand Strategy',
  service_1_items TEXT NOT NULL DEFAULT 'Brand Audit\nResearch\nAudience\nCompetitive Analysis\nPositioning\nTone of Voice\nSocial Media',
  service_2_title VARCHAR(255) NOT NULL DEFAULT 'Digital Design',
  service_2_items TEXT NOT NULL DEFAULT 'UI/UX Design\nWeb Design\nMobile Design\nBrand Identity\nVisual Design\nPrototyping\nUser Testing',
  service_3_title VARCHAR(255) NOT NULL DEFAULT 'Development',
  service_3_items TEXT NOT NULL DEFAULT 'Frontend Development\nBackend Development\nMobile Apps\nE-commerce\nCMS Integration\nAPI Development\nPerformance Optimization',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Contact tablosu
CREATE TABLE IF NOT EXISTS contact (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(500) NOT NULL DEFAULT "Let's connect and bring your ideas to life",
  phone VARCHAR(100) NOT NULL DEFAULT '+45 123 456 789',
  email VARCHAR(255) NOT NULL DEFAULT 'hello@lucastudio.com',
  instagram VARCHAR(255) NOT NULL DEFAULT 'https://instagram.com/lucastudio',
  linkedin VARCHAR(255) NOT NULL DEFAULT 'https://linkedin.com/company/lucastudio',
  address_line1 VARCHAR(255) NOT NULL DEFAULT '12 Nyhavn Street',
  address_line2 VARCHAR(255) NOT NULL DEFAULT 'Copenhagen, Denmark, 1051',
  studio_hours_weekdays VARCHAR(255) NOT NULL DEFAULT 'Monday to Friday: 9:00 AM – 6:00 PM',
  studio_hours_weekend VARCHAR(255) NOT NULL DEFAULT 'Saturday & Sunday: Closed',
  image_path VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Diğer mevcut tablolar (about, projects, news, awards, slider, intro_banners, vb.)
```

### 2. Vercel'e Deploy Edin

1. **GitHub'a Push Edin:**
```bash
git add .
git commit -m "Merkezi API sistemi ile Vercel deployment hazır"
git push origin main
```

2. **Vercel Dashboard'da:**
   - New Project → Import Git Repository
   - Framework Preset: Next.js
   - Root Directory: `./` (ana dizin)
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Environment Variables Ekleyin:**
   - Vercel Dashboard → Project Settings → Environment Variables
   - Yukarıdaki environment variables'ları ekleyin

### 3. Admin Panel Deployment

Admin panel ayrı bir proje olarak deploy edilebilir:

1. **Admin Panel için Yeni Vercel Projesi:**
   - Root Directory: `./admin-panel`
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

2. **Admin Panel Environment Variables:**
```bash
VITE_API_BASE_URL=https://your-main-vercel-domain.vercel.app/api
```

## 🔧 Merkezi API Sistemi

### Yapı:
```
admin-panel/src/
├── config/
│   └── api.ts          # Merkezi API konfigürasyonu
├── utils/
│   └── api.ts          # Merkezi axios instance ve API fonksiyonları
└── pages/
    └── *.tsx           # Tüm sayfalar artık api.ts kullanıyor
```

### Avantajlar:
- ✅ **Tek yerden yönetim**: Tüm API URL'leri merkezi config'de
- ✅ **Environment otomatik algılama**: Development/Production otomatik
- ✅ **Type safety**: TypeScript desteği
- ✅ **Error handling**: Merkezi hata yönetimi
- ✅ **Authentication**: Otomatik token yönetimi

### Kullanım:
```typescript
import { api } from '../utils/api';

// GET request
const response = await api.getProjects();

// POST request
const newProject = await api.createProject(projectData);

// PUT request
const updatedProject = await api.updateProject(id, projectData);

// DELETE request
await api.deleteProject(id);
```

## 🔧 Önemli Notlar

### File Uploads
- Vercel serverless functions'da file uploads için `public/uploads` klasörü kullanılıyor
- Büyük dosyalar için external storage (AWS S3, Cloudinary) önerilir

### Database Connection
- Production'da connection pooling kullanılıyor
- Database timeout ayarları optimize edildi

### CORS
- API routes'da CORS headers eklendi
- Admin panel'den erişim için gerekli

### API Routes
- Tüm backend routes Next.js API routes'a dönüştürüldü
- `/pages/api/` klasöründe bulunuyor
- Serverless functions olarak çalışıyor

## 🐛 Troubleshooting

### Database Connection Error
- Environment variables'ları kontrol edin
- Database'in public erişime açık olduğundan emin olun

### File Upload Error
- `public/uploads` klasörünün var olduğundan emin olun
- File size limitlerini kontrol edin

### Build Error
- Dependencies'lerin doğru yüklendiğinden emin olun
- Node.js version'ını kontrol edin (18+ önerilir)

### API Error
- Merkezi API config'i kontrol edin
- Environment variables'ları doğru ayarlayın

## 📝 Migration Notları

### Yapılan Değişiklikler:
1. ✅ Backend Express routes → Next.js API routes
2. ✅ Merkezi API konfigürasyonu oluşturuldu
3. ✅ Tüm admin panel sayfaları yeni sisteme geçirildi
4. ✅ Environment variables merkezi yönetim
5. ✅ TypeScript desteği eklendi
6. ✅ Error handling iyileştirildi

### Test Edilmesi Gerekenler:
- [ ] Tüm CRUD operasyonları
- [ ] File uploads
- [ ] Authentication
- [ ] Error handling
- [ ] Environment switching
