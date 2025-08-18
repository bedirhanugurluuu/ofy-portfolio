const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase client
const supabaseUrl = 'https://lsxafginsylkeuyzuiau.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzeAFmZ2luc3lsa2V1eXp1aWF1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTUzMDMzNywiZXhwIjoyMDcxMTA2MzM3fQ.W02DluunU-jOQfLhvEYzcR9OjdutSruUM53CtKbdRfo';

const supabase = createClient(supabaseUrl, supabaseKey);

// Resim kategorileri
const imageCategories = {
  projects: [
    '1754421757616-740757983.jpg',
    '1754421757616-769464803.jpg',
    '1754592410981-894450477.jpg',
    '1754592414603-806857595.jpg',
    '1754592424642-195148600.mp4',
    '1754592428843-226724001.jpg',
    '1754592440249-69497598.jpg',
    '1754592442912-951363068.mp4',
    '1754592445350-474167658.jpg',
    '1754674202567-196894905.mp4',
    '1754674202570-34358415.jpg',
    '1754674469699-737691846.mp4',
    '1754674469701-675663703.jpg',
    '1754678985763-542213049.jpg',
    '1754678994238-295985177.jpg',
    '1754679008655-796439891.mp4',
    '1754679016816-793087398.jpg',
    '1754679023542-755720944.jpg',
    '1754679031123-26809102.mp4',
    '1754679040458-990897802.jpg',
    '1754679359493-200028473.jpg',
    '1754679359494-813147258.jpg',
    '1754679427783-925650659.jpg',
    '1754679436683-947795366.jpg',
    '1754679440689-48511275.mp4',
    '1754679445281-472484174.jpg',
    '1754679450784-360382934.jpg',
    '1754679454866-13097543.mp4',
    '1754679459518-222581554.jpg',
    '1754679886853-191485567.jpg',
    '1754679886856-238727834.jpg'
  ],
  news: [
    'journal1.jpg',
    'journal2.jpg',
    'journal3.jpg'
  ],
  about: [
    'sample-about.png'
  ],
  slider: [
    'slider-1755374548311-347802720.jpg',
    'slider-1755375133927-28923622.jpg'
  ],
  'intro-banners': [
    'introbanner-1754832596941.jpg',
    'introbanner-1754832651214.jpg',
    'introbanner-1754832684232.jpg',
    'introbanner-1754911576790.jpg'
  ],
  'about-gallery': [
    'about-gallery-1755291463542-612868440.jpg',
    'about-gallery-1755291468322-407824118.jpg',
    'about-gallery-1755291474493-817369598.jpg',
    'about-gallery-1755291483125-259379146.jpg',
    'about-gallery-1755291516365-214062566.jpg'
  ],
  contact: [
    'contact-1755454728186-174679198.jpg'
  ]
};

async function organizeImagesByBucket() {
  const uploadsDir = path.join(__dirname, 'public', 'uploads');
  
  console.log('🗂️ Resimleri bucket\'lara göre organize ediyorum...\n');

  for (const [bucketName, files] of Object.entries(imageCategories)) {
    console.log(`📁 ${bucketName} bucket'ına yükleniyor...`);
    
    for (const fileName of files) {
      const filePath = path.join(uploadsDir, fileName);
      
      if (fs.existsSync(filePath)) {
        try {
          const fileBuffer = fs.readFileSync(filePath);
          
          const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(fileName, fileBuffer, {
              contentType: getContentType(fileName),
              upsert: true
            });
          
          if (error) {
            console.error(`❌ ${fileName} yüklenirken hata:`, error.message);
          } else {
            console.log(`✅ ${fileName} → ${bucketName}`);
          }
        } catch (error) {
          console.error(`❌ ${fileName} okuma hatası:`, error.message);
        }
      } else {
        console.log(`⚠️ ${fileName} bulunamadı`);
      }
    }
    console.log('');
  }
  
  console.log('🎉 Tüm resimler organize edildi!');
}

function getContentType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const contentTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.mp4': 'video/mp4',
    '.mov': 'video/quicktime',
    '.avi': 'video/x-msvideo'
  };
  return contentTypes[ext] || 'application/octet-stream';
}

organizeImagesByBucket();
