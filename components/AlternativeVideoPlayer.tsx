import React, { useRef, useEffect, useState } from 'react';

interface AlternativeVideoPlayerProps {
  src: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  controls?: boolean;
  poster?: string;
}

const AlternativeVideoPlayer: React.FC<AlternativeVideoPlayerProps> = ({
  src,
  className = "",
  autoPlay = false,
  loop = false,
  muted = true,
  playsInline = true,
  controls = false,
  poster
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [useProxy, setUseProxy] = useState(false);

  // Proxy URL oluştur
  const getProxyUrl = (originalSrc: string) => {
    if (originalSrc.includes('supabase.co')) {
      // Vercel API route üzerinden proxy
      const fileName = originalSrc.split('/').pop();
      return `/api/video-proxy?url=${encodeURIComponent(originalSrc)}&filename=${fileName}`;
    }
    return originalSrc;
  };

  const handleError = (error: any) => {
    console.error('Alternative video loading error:', error);
    if (!useProxy) {
      setUseProxy(true);
      setIsLoading(true);
      setHasError(false);
      if (videoRef.current) {
        videoRef.current.src = getProxyUrl(src);
        videoRef.current.load();
      }
    } else {
      setHasError(true);
      setIsLoading(false);
    }
  };

  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
  };

  const handleCanPlay = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleLoadedData = () => {
    setIsLoading(false);
    setHasError(false);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // iPhone Safari için özel ayarlar
    video.setAttribute('webkit-playsinline', 'true');
    video.setAttribute('playsinline', 'true');
    video.preload = 'none';
    
    // Error handling
    video.addEventListener('error', handleError);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('loadeddata', handleLoadedData);

    return () => {
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [useProxy]);

  if (hasError) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center`}>
        <div className="text-center text-gray-500">
          <p className="text-sm">Video yüklenemedi</p>
          <p className="text-xs mt-1">Lütfen daha sonra tekrar deneyin</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} relative`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
        </div>
      )}
      
      <video
        ref={videoRef}
        src={useProxy ? getProxyUrl(src) : src}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        controls={controls}
        poster={poster}
        preload="none"
        // iPhone Safari için özel özellikler
        webkit-playsinline="true"
        x5-playsinline="true"
        x5-video-player-type="h5"
        x5-video-player-fullscreen="true"
        // Error handling
        onError={handleError}
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
        onLoadedData={handleLoadedData}
      />
    </div>
  );
};

export default AlternativeVideoPlayer;
