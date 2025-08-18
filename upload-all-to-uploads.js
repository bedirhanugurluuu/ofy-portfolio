const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase client
const supabaseUrl = 'https://lsxafginsylkeuyzuiau.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzeAFmZ2luc3lsa2V1eXp1aWF1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTUzMDMzNywiZXhwIjoyMDcxMTA2MzM3fQ.W02DluunU-jOQfLhvEYzcR9OjdutSruUM53CtKbdRfo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadAllToUploads() {
  const uploadsDir = path.join(__dirname, 'public', 'uploads');
  
  console.log('📁 Tüm resimleri uploads bucket\'ına yükleniyor...\n');

  if (!fs.existsSync(uploadsDir)) {
    console.error('❌ uploads klasörü bulunamadı!');
    return;
  }

  const files = fs.readdirSync(uploadsDir);
  
  for (const fileName of files) {
    const filePath = path.join(uploadsDir, fileName);
    const stats = fs.statSync(filePath);
    
    if (stats.isFile()) {
      try {
        const fileBuffer = fs.readFileSync(filePath);
        
        const { data, error } = await supabase.storage
          .from('uploads')
          .upload(fileName, fileBuffer, {
            contentType: getContentType(fileName),
            upsert: true
          });
        
        if (error) {
          console.error(`❌ ${fileName} yüklenirken hata:`, error.message);
        } else {
          console.log(`✅ ${fileName} → uploads`);
        }
      } catch (error) {
        console.error(`❌ ${fileName} okuma hatası:`, error.message);
      }
    }
  }
  
  console.log('\n🎉 Tüm resimler uploads bucket\'ına yüklendi!');
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

uploadAllToUploads();
