import React, { useRef, useState } from 'react';

interface SimpleVideoTestProps {
  src: string;
  className?: string;
}

const SimpleVideoTest: React.FC<SimpleVideoTestProps> = ({ src, className = "" }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = (e: any) => {
    console.error('Video error details:', e);
    const video = e.target;
    const error = video.error;
    
    let errorMessage = 'Bilinmeyen hata';
    if (error) {
      switch (error.code) {
        case 1:
          errorMessage = 'Video yükleme iptal edildi';
          break;
        case 2:
          errorMessage = 'Ağ hatası';
          break;
        case 3:
          errorMessage = 'Video decode hatası';
          break;
        case 4:
          errorMessage = 'Video formatı desteklenmiyor';
          break;
        default:
          errorMessage = `Hata kodu: ${error.code}`;
      }
    }
    
    setError(errorMessage);
    setIsLoading(false);
  };

  const handleLoadStart = () => {
    setIsLoading(true);
    setError(null);
  };

  const handleCanPlay = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleLoadedData = () => {
    setIsLoading(false);
    setError(null);
  };

  return (
    <div className={`${className} relative`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 bg-red-100 flex items-center justify-center z-10">
          <div className="text-center text-red-600">
            <p className="text-sm font-bold">Video Hatası</p>
            <p className="text-xs mt-1">{error}</p>
            <p className="text-xs mt-1">URL: {src}</p>
          </div>
        </div>
      )}
      
      <video
        ref={videoRef}
        src={src}
        className={`${className} ${isLoading || error ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        autoPlay
        loop
        muted
        playsInline
        controls
        preload="metadata"
        onError={handleError}
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
        onLoadedData={handleLoadedData}
      />
    </div>
  );
};

export default SimpleVideoTest;
