import React from 'react';
import Head from 'next/head';

const MaintenancePage = () => {
  return (
    <>
      <Head>
        <title>Site Yapım Aşamasında - Faruk Yılmaz</title>
        <meta name="description" content="Web sitemiz yakında sizlerle. Yeni tasarım ve özellikler geliyor!" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Logo/İsim */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Faruk Yılmaz
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>
          
          {/* Ana Mesaj */}
          <div className="mb-12">
            <div className="text-6xl mb-6">🚧</div>
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
              Site Yapım Aşamasında
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              Merhaba! Yeni web sitemiz yakında sizlerle buluşacak. 
              <br />
              Daha iyi bir deneyim için çalışıyoruz.
            </p>
          </div>
          
          {/* Özellikler */}
          <div className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 border border-gray-700">
                <div className="text-3xl mb-3">✨</div>
                <h3 className="text-lg font-semibold text-white mb-2">Yenilikler</h3>
                <p className="text-gray-400 text-sm">Modern tasarım ve özellikler</p>
              </div>
              
              <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 border border-gray-700">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="text-lg font-semibold text-white mb-2">Daha İyi Deneyim</h3>
                <p className="text-gray-400 text-sm">Hızlı ve kullanıcı dostu</p>
              </div>
              
              <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 border border-gray-700">
                <div className="text-3xl mb-3">🚀</div>
                <h3 className="text-lg font-semibold text-white mb-2">Çok Yakında</h3>
                <p className="text-gray-400 text-sm">Çok kısa sürede açılıyor</p>
              </div>
            </div>
          </div>
          
          {/* İletişim */}
          <div className="mb-8">
            <p className="text-gray-400 mb-4">
              Sorularınız için bizimle iletişime geçebilirsiniz
            </p>
            <div className="flex justify-center space-x-6">
              <a 
                href="mailto:info@farukyilmaz.com" 
                className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
              >
                📧 E-posta
              </a>
              <a 
                href="https://linkedin.com/in/farukyilmaz" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
              >
                💼 LinkedIn
              </a>
            </div>
          </div>
          
          {/* Footer */}
          <div className="text-gray-500 text-sm">
            <p>© 2024 Faruk Yılmaz. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MaintenancePage;
