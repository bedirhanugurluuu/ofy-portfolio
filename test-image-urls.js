const { createClient } = require('@supabase/supabase-js');

// Supabase client
const supabaseUrl = 'https://lsxafginsylkeuyzuiau.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzeAFmZ2luc3lsa2V1eXp1aWF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MzAzMzcsImV4cCI6MjA3MTEwNjMzN30.vMhXeNO2vsne3mmFUfc5vXBLORyGpdu2vv9NyCyQo8U';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testImageUrls() {
  console.log('🔍 Resim URL\'lerini test ediyorum...\n');

  // Test edilecek dosyalar
  const testFiles = [
    'journal1.jpg',
    'journal2.jpg', 
    'journal3.jpg',
    '1754421757616-769464803.jpg',
    '1754674469699-737691846.mp4',
    'slider-1755374548311-347802720.jpg',
    'contact-1755454728186-174679198.jpg'
  ];

  for (const file of testFiles) {
    const url = `https://lsxafginsylkeuyzuiau.supabase.co/storage/v1/object/public/uploads/${file}`;
    
    try {
      const response = await fetch(url, { method: 'HEAD' });
      
      if (response.ok) {
        console.log(`✅ ${file} - MEVCUT (${response.status})`);
      } else {
        console.log(`❌ ${file} - BULUNAMADI (${response.status})`);
      }
    } catch (error) {
      console.log(`❌ ${file} - HATA: ${error.message}`);
    }
  }

  console.log('\n📋 Supabase Storage bucket içeriği:');
  
  try {
    const { data, error } = await supabase.storage
      .from('uploads')
      .list('', { limit: 10 });

    if (error) {
      console.error('❌ Bucket listesi alınamadı:', error);
    } else {
      console.log('📁 Bucket\'taki dosyalar:');
      data.forEach(file => {
        console.log(`  - ${file.name} (${file.metadata?.size || 'unknown'} bytes)`);
      });
    }
  } catch (error) {
    console.error('❌ Bucket erişim hatası:', error);
  }
}

testImageUrls();
