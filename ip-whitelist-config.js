// IP Whitelist Konfigürasyonu
// Bu dosyayı düzenleyerek izin verilen IP adreslerini ayarlayın

export const ALLOWED_IPS = [
  // Buraya IP adreslerinizi ekleyin
  '127.0.0.1', // Localhost (geliştirme için)
  
  // Örnek IP adresleri (kendi IP'lerinizle değiştirin):
  // '192.168.1.100', // Sizin IP'niz
  // '203.0.113.45',  // Arkadaşınızın IP'si
  // '198.51.100.123', // Müşterinizin IP'si
  
  // IP adreslerinizi öğrenmek için: https://whatismyipaddress.com
];

// Admin paneli için her zaman izin verilen path'ler
export const ADMIN_PATHS = [
  '/admin',
  '/temp-admin-panel'
];

// IP adreslerinizi eklemek için:
// 1. https://whatismyipaddress.com adresine gidin
// 2. IP adresinizi kopyalayın
// 3. Yukarıdaki ALLOWED_IPS dizisine ekleyin
// 4. Deploy edin
