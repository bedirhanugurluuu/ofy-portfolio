const fs = require('fs');
const path = require('path');

// Import path'lerini düzelt
const fixImportPaths = (filePath) => {
  if (!fs.existsSync(filePath)) {
    console.log(`❌ ${filePath} bulunamadı`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;

  // Alt klasörlerdeki dosyalar için import path'lerini düzelt
  if (filePath.includes('/pages/') && filePath.includes('/src/pages/')) {
    // ../utils/api -> ../../utils/api
    if (content.includes("import { api } from '../utils/api';")) {
      content = content.replace(
        /import \{ api \} from '\.\.\/utils\/api';/g,
        "import { api } from '../../utils/api';"
      );
      updated = true;
    }

    // axiosInstance -> api
    if (content.includes("import axiosInstance")) {
      content = content.replace(
        /import axiosInstance[^;]+;/g,
        "import { api } from '../../utils/api';"
      );
      updated = true;
    }

    // axios -> api
    if (content.includes("import axios from")) {
      content = content.replace(
        /import axios from ["']\.\.\/utils\/axiosInstance["'];?/g,
        "import { api } from '../../utils/api';"
      );
      updated = true;
    }
  }

  // API_BASE_URL referanslarını kaldır
  if (content.includes("API_BASE_URL")) {
    content = content.replace(
      /API_BASE_URL/g,
      "getApiUrl('endpoint')"
    );
    updated = true;
  }

  if (updated) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ ${filePath} güncellendi`);
  } else {
    console.log(`⏭️  ${filePath} zaten güncel`);
  }
};

// Tüm admin panel sayfalarını güncelle
const adminPages = [
  'admin-panel/src/pages/slider/edit.tsx',
  'admin-panel/src/pages/slider/new.tsx',
  'admin-panel/src/pages/slider/index.tsx',
  'admin-panel/src/pages/awards/edit.tsx',
  'admin-panel/src/pages/awards/new.tsx',
  'admin-panel/src/pages/awards/index.tsx',
  'admin-panel/src/pages/projects/edit.tsx',
  'admin-panel/src/pages/projects/new.tsx',
  'admin-panel/src/pages/projects/index.tsx',
  'admin-panel/src/pages/intro-banners/edit.tsx',
  'admin-panel/src/pages/intro-banners/new.tsx',
  'admin-panel/src/pages/intro-banners/index.tsx',
  'admin-panel/src/pages/news/index.tsx'
];

console.log('🔧 Import path\'leri düzeltiliyor...\n');

adminPages.forEach(page => {
  fixImportPaths(page);
});

console.log('\n✅ Tüm import path\'leri düzeltildi!');
