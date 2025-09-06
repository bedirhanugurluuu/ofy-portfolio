import React, { useRef, useEffect, useState } from 'react';

interface VideoPlayerProps {
  src: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  controls?: boolean;
  poster?: string;
  onError?: (error: any) => void;
  onLoadStart?: () => void;
  onCanPlay?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  className = "",
  autoPlay = false,
  loop = false,
  muted = true,
  playsInline = true,
  controls = false,
  poster,
  onError,
  onLoadStart,
  onCanPlay
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [useFallback, setUseFallback] = useState(false);

  const handleError = (error: any) => {
    console.error('Video loading error:', error);
    setHasError(true);
    setIsLoading(false);
    
    // Retry logic for iPhone Safari
    if (retryCount < 5) {
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setHasError(false);
        setIsLoading(true);
        
        // Try different approaches
        if (retryCount === 0) {
          // First retry: Add cache busting
          setCurrentSrc(`${src}?t=${Date.now()}`);
        } else if (retryCount === 1) {
          // Second retry: Try without crossOrigin
          setCurrentSrc(src);
        } else if (retryCount === 2) {
          // Third retry: Try with different parameters
          setCurrentSrc(`${src}?response-cache-control=public&t=${Date.now()}`);
        } else if (retryCount === 3) {
          // Fourth retry: Use fallback method
          setUseFallback(true);
          setCurrentSrc(src);
        } else {
          // Fifth retry: Last attempt
          setCurrentSrc(`${src}?v=${Math.random()}`);
        }
        
        if (videoRef.current) {
          videoRef.current.load();
        }
      }, 1000 * (retryCount + 1)); // Exponential backoff
    }
    
    onError?.(error);
  };

  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
    onLoadStart?.();
  };

  const handleCanPlay = () => {
    setIsLoading(false);
    setHasError(false);
    onCanPlay?.();
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
    
    // Preload ayarları
    video.preload = 'metadata';
    
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
  }, [retryCount]);

  // User agent kontrolü
  const isIOS = typeof window !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isSafari = typeof window !== 'undefined' && /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);

  // Video src'yi güncelle
  useEffect(() => {
    setCurrentSrc(src);
    setRetryCount(0);
    setHasError(false);
    setUseFallback(false);
  }, [src]);

  if (hasError && retryCount >= 5) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center`}>
        <div className="text-center text-gray-500">
          <p className="text-sm">Video yüklenemedi</p>
          <button 
            onClick={() => {
              setRetryCount(0);
              setHasError(false);
              setIsLoading(true);
              setCurrentSrc(src);
              setUseFallback(false);
            }}
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
          >
            Tekrar Dene
          </button>
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
        src={currentSrc}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        controls={controls}
        poster={poster}
        preload={isIOS && isSafari ? "none" : "metadata"}
        crossOrigin={useFallback ? undefined : "anonymous"}
        // iPhone Safari için ek özellikler
        webkit-playsinline="true"
        x5-playsinline="true"
        x5-video-player-type="h5"
        x5-video-player-fullscreen="true"
        // iPhone Safari için özel özellikler
        {...(isIOS && isSafari && {
          'webkit-playsinline': 'true',
          'playsinline': 'true',
          'preload': 'none'
        })}
        // Error handling
        onError={handleError}
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
        onLoadedData={handleLoadedData}
      />
    </div>
  );
};

export default VideoPlayer;
