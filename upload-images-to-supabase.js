const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase client
const supabaseUrl = 'https://lsxafginsylkeuyzuiau.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzeAFmZ2luc3lsa2V1eXp1aWF1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTUzMDMzNywiZXhwIjoyMDcxMTA2MzM3fQ.W02DluunU-jOQfLhvEYzcR9OjdutSruUM53CtKbdRfo';

const supabase = createClient(supabaseUrl, supabaseKey);

// Uploads klasörü yolu
const uploadsDir = path.join(__dirname, 'public', 'uploads');

async function uploadImagesToSupabase() {
  try {
    console.log('🔄 Resimler Supabase Storage\'a yükleniyor...');
    
    // Uploads klasöründeki tüm dosyaları oku
    const files = fs.readdirSync(uploadsDir);
    
    for (const file of files) {
      const filePath = path.join(uploadsDir, file);
      const fileBuffer = fs.readFileSync(filePath);
      
      console.log(`📤 ${file} yükleniyor...`);
      
      // Supabase Storage'a yükle
      const { data, error } = await supabase.storage
        .from('uploads')
        .upload(file, fileBuffer, {
          contentType: getContentType(file),
          upsert: true
        });
      
      if (error) {
        console.error(`❌ ${file} yüklenirken hata:`, error);
      } else {
        console.log(`✅ ${file} başarıyla yüklendi`);
      }
    }
    
    console.log('🎉 Tüm resimler yüklendi!');
    
    // Public URL'leri al
    const { data: urls } = supabase.storage
      .from('uploads')
      .getPublicUrl('*');
    
    console.log('📋 Public URL\'ler hazır');
    
  } catch (error) {
    console.error('❌ Hata:', error);
  }
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

uploadImagesToSupabase();
