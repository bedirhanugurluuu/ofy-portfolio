import React from 'react';
import SimpleVideoTest from '../components/SimpleVideoTest';

const VideoTestPage = () => {
  const testVideos = [
    'https://lsxafginsylkeuyzuiau.supabase.co/storage/v1/object/public/uploads/1754679008655-796439891.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', // Test video
    'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4' // Another test video
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Video Test Sayfası</h1>
        
        <div className="space-y-8">
          {testVideos.map((videoUrl, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                Test Video {index + 1}
              </h2>
              <p className="text-sm text-gray-600 mb-4 break-all">
                URL: {videoUrl}
              </p>
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                <SimpleVideoTest 
                  src={videoUrl}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Test Sonuçları:</h3>
          <ul className="text-sm space-y-1">
            <li>• Eğer tüm videolar çalışıyorsa: Sorun kodda</li>
            <li>• Eğer sadece Supabase video çalışmıyorsa: Supabase ayarları</li>
            <li>• Eğer hiçbiri çalışmıyorsa: iPhone Safari sorunu</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VideoTestPage;
