const fs = require('fs');
const path = require('path');

// Admin panel sayfalarını güncelle
const updatePage = (filePath) => {
  if (!fs.existsSync(filePath)) {
    console.log(`❌ ${filePath} bulunamadı`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;

  // axios import'unu kaldır ve api import'unu ekle
  if (content.includes("import axios from 'axios';")) {
    content = content.replace(
      /import axios from 'axios';/g,
      "import { api } from '../utils/api';"
    );
    updated = true;
  }

  // axiosInstance import'unu kaldır ve api import'unu ekle
  if (content.includes("import axios from")) {
    content = content.replace(
      /import axios from ["']\.\.\/utils\/axiosInstance["'];?/g,
      "import { api } from '../utils/api';"
    );
    updated = true;
  }

  // API_BASE_URL tanımlarını kaldır
  if (content.includes("const API_BASE_URL =")) {
    content = content.replace(
      /const API_BASE_URL = [^;]+;/g,
      ""
    );
    updated = true;
  }

  // axios.get -> api.getX
  content = content.replace(
    /axios\.get<([^>]+)>\(`\${API_BASE_URL}\/api\/([^`]+)`\)/g,
    (match, type, endpoint) => {
      const methodName = `get${endpoint.charAt(0).toUpperCase() + endpoint.slice(1)}`;
      return `api.${methodName}()`;
    }
  );

  // axios.post -> api.createX
  content = content.replace(
    /axios\.post<([^>]+)>\(`\${API_BASE_URL}\/api\/([^`]+)`,\s*([^)]+)\)/g,
    (match, type, endpoint, data) => {
      const methodName = `create${endpoint.charAt(0).toUpperCase() + endpoint.slice(1)}`;
      return `api.${methodName}(${data})`;
    }
  );

  // axios.put -> api.updateX
  content = content.replace(
    /axios\.put<([^>]+)>\(`\${API_BASE_URL}\/api\/([^`]+)\/([^`]+)`,\s*([^)]+)\)/g,
    (match, type, endpoint, id, data) => {
      const methodName = `update${endpoint.charAt(0).toUpperCase() + endpoint.slice(1)}`;
      return `api.${methodName}(${id}, ${data})`;
    }
  );

  // axios.delete -> api.deleteX
  content = content.replace(
    /axios\.delete<([^>]+)>\(`\${API_BASE_URL}\/api\/([^`]+)\/([^`]+)`\)/g,
    (match, type, endpoint, id) => {
      const methodName = `delete${endpoint.charAt(0).toUpperCase() + endpoint.slice(1)}`;
      return `api.${methodName}(${id})`;
    }
  );

  // response.data as Type -> response.data as Type
  content = content.replace(
    /\.then\(\(res\) => {\s*set([^;]+)\(res\.data as ([^;]+)\);/g,
    (match, stateName, type) => {
      return `.then((res) => {\n                set${stateName}(res.data as ${type});`;
    }
  );

  if (updated) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ ${filePath} güncellendi`);
  } else {
    console.log(`⏭️  ${filePath} zaten güncel`);
  }
};

// Tüm admin panel sayfalarını güncelle
const adminPages = [
  'admin-panel/src/pages/about.tsx',
  'admin-panel/src/pages/aboutGallery.tsx',
  'admin-panel/src/pages/projects/index.tsx',
  'admin-panel/src/pages/projects/new.tsx',
  'admin-panel/src/pages/projects/edit.tsx',
  'admin-panel/src/pages/news/index.tsx',
  'admin-panel/src/pages/intro-banners/index.tsx',
  'admin-panel/src/pages/intro-banners/new.tsx',
  'admin-panel/src/pages/intro-banners/edit.tsx',
  'admin-panel/src/pages/awards/index.tsx',
  'admin-panel/src/pages/awards/new.tsx',
  'admin-panel/src/pages/awards/edit.tsx',
  'admin-panel/src/pages/slider/index.tsx',
  'admin-panel/src/pages/slider/new.tsx',
  'admin-panel/src/pages/slider/edit.tsx'
];

console.log('🚀 Admin panel sayfaları yeni API sistemi kullanacak şekilde güncelleniyor...\n');

adminPages.forEach(page => {
  updatePage(page);
});

console.log('\n✅ Tüm admin panel sayfaları güncellendi!');
console.log('📝 Not: whatWeDo.tsx ve contact.tsx zaten güncellenmişti.');
