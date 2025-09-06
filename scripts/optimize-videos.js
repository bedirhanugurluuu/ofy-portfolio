// Video dosyalarını iPhone Safari için optimize etmek için script
// Bu script'i çalıştırmadan önce ffmpeg'in yüklü olduğundan emin olun

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Video optimizasyon ayarları
const optimizationSettings = {
  // iPhone Safari için optimize edilmiş ayarlar
  mobile: {
    codec: 'libx264',
    preset: 'fast',
    crf: 28,
    maxrate: '2M',
    bufsize: '4M',
    profile: 'baseline',
    level: '3.0',
    pix_fmt: 'yuv420p',
    movflags: 'faststart', // iPhone Safari için önemli
    format: 'mp4'
  },
  // Desktop için daha yüksek kalite
  desktop: {
    codec: 'libx264',
    preset: 'medium',
    crf: 23,
    maxrate: '5M',
    bufsize: '10M',
    profile: 'high',
    level: '4.0',
    pix_fmt: 'yuv420p',
    movflags: 'faststart',
    format: 'mp4'
  }
};

function optimizeVideo(inputPath, outputPath, settings) {
  try {
    const command = `ffmpeg -i "${inputPath}" -c:v ${settings.codec} -preset ${settings.preset} -crf ${settings.crf} -maxrate ${settings.maxrate} -bufsize ${settings.bufsize} -profile:v ${settings.profile} -level ${settings.level} -pix_fmt ${settings.pix_fmt} -movflags ${settings.movflags} -c:a aac -b:a 128k "${outputPath}"`;
    
    console.log(`Optimizing: ${inputPath}`);
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ Optimized: ${outputPath}`);
    
    return true;
  } catch (error) {
    console.error(`❌ Error optimizing ${inputPath}:`, error.message);
    return false;
  }
}

function processVideos() {
  const uploadsDir = path.join(__dirname, '../public/uploads');
  const optimizedDir = path.join(__dirname, '../public/uploads/optimized');
  
  // Optimized klasörünü oluştur
  if (!fs.existsSync(optimizedDir)) {
    fs.mkdirSync(optimizedDir, { recursive: true });
  }
  
  // Video dosyalarını bul
  const videoExtensions = ['.mp4', '.webm', '.mov', '.avi'];
  const files = fs.readdirSync(uploadsDir);
  const videoFiles = files.filter(file => 
    videoExtensions.some(ext => file.toLowerCase().endsWith(ext))
  );
  
  console.log(`Found ${videoFiles.length} video files to optimize`);
  
  videoFiles.forEach(file => {
    const inputPath = path.join(uploadsDir, file);
    const nameWithoutExt = path.parse(file).name;
    
    // Mobile versiyonu oluştur
    const mobileOutput = path.join(optimizedDir, `${nameWithoutExt}_mobile.mp4`);
    optimizeVideo(inputPath, mobileOutput, optimizationSettings.mobile);
    
    // Desktop versiyonu oluştur
    const desktopOutput = path.join(optimizedDir, `${nameWithoutExt}_desktop.mp4`);
    optimizeVideo(inputPath, desktopOutput, optimizationSettings.desktop);
  });
  
  console.log('🎉 Video optimization completed!');
}

// Script'i çalıştır
if (require.main === module) {
  processVideos();
}

module.exports = { optimizeVideo, processVideos };
