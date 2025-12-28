"use client";

import { useRef, useState, useEffect, Suspense, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Mesh, LinearFilter, TextureLoader } from "three";
import { normalizeImageUrl, fetchProjectsSSR, fetchProjectGallery, Project } from "@/lib/api";
import SEO from "@/components/SEO";
import { GetStaticProps } from "next";

// Texture cache for sharing textures across components
const textureCache = new Map<string, any>();
const textureLoader = new TextureLoader();

// Texture yükleme ve GPU'ya upload etme fonksiyonu
async function loadTextureToGPU(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    if (textureCache.has(url)) {
      resolve(textureCache.get(url));
      return;
    }

    textureLoader.load(
      url,
      (texture) => {
        // Optimize texture for performance
        texture.minFilter = LinearFilter;
        texture.magFilter = LinearFilter;
        texture.generateMipmaps = false;
        texture.needsUpdate = true; // GPU'ya yükle
        
        // Cache'e ekle
        textureCache.set(url, texture);
        resolve(texture);
      },
      undefined,
      (error) => {
        reject(error);
      }
    );
  });
}

// Enhanced preload hook - Tüm texture'ları GPU'ya yükler
function useGPUPreload(urls: string[]) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  useEffect(() => {
    if (urls.length === 0) {
      setDone(true);
      return;
    }

    let cancelled = false;
    const total = urls.length;
    
    // GPU'ya yükleme işlemini batch'ler halinde yap
    const batchSize = 5;
    let currentIndex = 0;

    const loadBatch = async () => {
      if (cancelled || currentIndex >= total) return;

      const batchUrls = urls.slice(currentIndex, currentIndex + batchSize);
      
      try {
        await Promise.all(
          batchUrls.map(async (url) => {
            try {
              await loadTextureToGPU(url);
            } catch (error) {
              console.warn(`Failed to load texture to GPU: ${url}`, error);
            }
          })
        );
        
        if (cancelled) return;
        
        currentIndex += batchSize;
        const newCount = Math.min(currentIndex, total);
        setLoadedCount(newCount);
        setProgress(Math.round((newCount / total) * 100));
        
        if (currentIndex >= total) {
          // Tüm texture'lar GPU'ya yüklendi
          setTimeout(() => {
            if (!cancelled) {
              setDone(true);
              setProgress(100);
            }
          }, 100); // Ekstra 100ms bekle, GPU'nun işlemesi için
        } else {
          // Sonraki batch'i yükle
          setTimeout(() => {
            if (!cancelled) loadBatch();
          }, 0);
        }
      } catch (error) {
        console.error('Batch load error:', error);
        if (!cancelled) loadBatch();
      }
    };

    loadBatch();

    return () => {
      cancelled = true;
    };
  }, [urls]);

  return { progress, done, loadedCount };
}

// Simple image item interface for gallery
interface GalleryImageItem {
  id: string;
  image: string;
}

interface GalleryProps {
  images?: GalleryImageItem[];
}

// 3D Image Component - Texture'lar zaten GPU'da
function ImageSphere({ 
  position, 
  imageUrl, 
  item
}: { 
  position: [number, number, number]; 
  imageUrl: string;
  item: GalleryImageItem;
}) {
  const meshRef = useRef<Mesh>(null);
  
  // Texture'ı cache'den direkt al (GPU'da hazır)
  const texture = useMemo(() => {
    return textureCache.get(imageUrl) || null;
  }, [imageUrl]);
  
  // Aspect ratio hesapla
  const aspectRatio = useMemo(() => {
    if (texture) {
      const image = texture.image as HTMLImageElement;
      if (image) {
        const width = image.width || image.naturalWidth || 1;
        const height = image.height || image.naturalHeight || 1;
        return width / height;
      }
    }
    return 1;
  }, [texture]);

  useFrame(({ camera }) => {
    if (meshRef.current) {
      meshRef.current.lookAt(camera.position);
    }
  });

  // Calculate plane dimensions
  const baseSize = 3.5;
  const planeWidth = baseSize * aspectRatio;
  const planeHeight = baseSize;

  // Texture yoksa render etme (olmamalı, çünkü preload tamamlandı)
  if (!texture) {
    console.warn(`Texture not found for: ${imageUrl}`);
    return null;
  }

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[planeWidth, planeHeight]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

// Main 3D Scene Component - Tüm görseller aynı anda
function Scene({ 
  items
}: { 
  items: GalleryImageItem[];
}) {
  const baseRadius = 8;
  const [scrollRadius, setScrollRadius] = useState(baseRadius);
  const { gl } = useThree();
  
  // Mouse wheel event handler
  useEffect(() => {
    const canvas = gl.domElement;
    if (!canvas) return;

    let currentRadius = baseRadius;
    let targetRadius = baseRadius;
    let animationFrameId: number;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY * 0.01;
      targetRadius = Math.max(baseRadius, Math.min(baseRadius + 12, targetRadius + delta));
      
      if (!animationFrameId) {
        const animate = () => {
          currentRadius += (targetRadius - currentRadius) * 0.1;
          setScrollRadius(currentRadius);
          if (Math.abs(currentRadius - targetRadius) > 0.01) {
            animationFrameId = requestAnimationFrame(animate);
          } else {
            animationFrameId = 0;
          }
        };
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      canvas.removeEventListener('wheel', handleWheel);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [baseRadius, gl]);

  // Fibonacci sphere algorithm
  const angles = useMemo(() => {
    const numPoints = items.length;
    if (numPoints === 0) return [];
    
    const generatedAngles: { theta: number; phi: number }[] = [];
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    
    for (let i = 0; i < numPoints; i++) {
      const divisor = numPoints > 1 ? numPoints - 1 : 1;
      const y = 1 - (i / divisor) * 2;
      const radius = Math.sqrt(1 - y * y);
      
      const theta = goldenAngle * i;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      
      const phi = Math.acos(y);
      const theta_spherical = Math.atan2(z, x);
      const theta_normalized = theta_spherical < 0 ? theta_spherical + 2 * Math.PI : theta_spherical;
      
      generatedAngles.push({ theta: theta_normalized, phi: phi });
    }
    
    return generatedAngles;
  }, [items.length]);

  // Scroll'a göre pozisyonlar
  const positions = useMemo(() => {
    const scrollRatio = Math.max(0, Math.min(1, (scrollRadius - baseRadius) / 12));
    const xScale = 1 + (scrollRatio * 1.5);
    
    return angles.map(({ theta, phi }) => {
      const x = scrollRadius * Math.sin(phi) * Math.cos(theta) * xScale;
      const y = scrollRadius * Math.cos(phi);
      const z = scrollRadius * Math.sin(phi) * Math.sin(theta);
      return [x, y, z] as [number, number, number];
    });
  }, [angles, scrollRadius, baseRadius]);

  return (
    <>
      <ambientLight intensity={2} />
      <pointLight position={[10, 10, 10]} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      {items.map((item, index) => (
        <Suspense key={item.id} fallback={null}>
          <ImageSphere
            position={positions[index]}
            imageUrl={normalizeImageUrl(item.image)}
            item={item}
          />
        </Suspense>
      ))}
      
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={true}
        autoRotateSpeed={0.3}
        maxPolarAngle={Math.PI}
        minPolarAngle={0}
      />
    </>
  );
}

// Loading Component - Clip-path animasyonlu dikdörtgen
function GalleryLoader() {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black">
      <div className="relative">
        {/* Center pulse effect */}
        <div className="relative">
          {/* Outer ring */}
          <div className="w-24 h-24 border-2 border-white/30 rounded-full animate-pulse-ring" />
          
          {/* Middle ring */}
          <div className="absolute inset-4 w-16 h-16 border-2 border-white/50 rounded-full animate-pulse-ring" 
               style={{ animationDelay: '0.2s' }} />
          
          {/* Inner dot */}
          <div className="absolute inset-8 w-8 h-8 bg-white rounded-full animate-pulse" />
        </div>
        
        {/* Subtle text */}
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
          <p className="text-white/60 text-sm font-light tracking-widest">
            LOADING
          </p>
          {/* Animated dots */}
          <div className="flex justify-center space-x-1 mt-1">
            <div className="w-1 h-1 bg-white/60 rounded-full animate-bounce" 
                 style={{ animationDelay: '0s' }} />
            <div className="w-1 h-1 bg-white/60 rounded-full animate-bounce" 
                 style={{ animationDelay: '0.1s' }} />
            <div className="w-1 h-1 bg-white/60 rounded-full animate-bounce" 
                 style={{ animationDelay: '0.2s' }} />
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes pulse-ring {
          0% {
            transform: scale(0.95);
            opacity: 0.7;
          }
          50% {
            transform: scale(1);
            opacity: 0.3;
          }
          100% {
            transform: scale(0.95);
            opacity: 0.7;
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(0.9);
          }
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }
        
        .animate-pulse-ring {
          animation: pulse-ring 2s ease-in-out infinite;
        }
        
        .animate-pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }
        
        .animate-bounce {
          animation: bounce 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default function GalleryPage({ images: initialImages = [] }: GalleryProps) {
  const [images, setImages] = useState<GalleryImageItem[]>(initialImages);
  const [canShowCanvas, setCanShowCanvas] = useState(false);

  useEffect(() => {
    if (initialImages.length > 0) {
      setImages(initialImages);
    }
  }, [initialImages]);

  // GPU'ya preload - tüm texture'lar yüklenene kadar bekle
  const imageUrls = useMemo(
    () => images.map(i => normalizeImageUrl(i.image)),
    [images]
  );

  const { progress, done } = useGPUPreload(imageUrls);

  // GPU yükleme tamamlandıktan sonra Canvas'ı mount et ve görsellerin render olmasını bekle
  useEffect(() => {
    if (done) {
      // Canvas mount edildikten sonra görsellerin render olması için yeterli süre bekle
      // Çok sayıda görsel (133 adet) GPU'ya yüklenip render edilirken ana thread bloklanıyor
      // Bu işlem 4-5 saniye sürebiliyor, bu yüzden yeterli süre beklemeliyiz
      const waitTime = Math.max(1000, images.length * 30); // Minimum 1s, görsel başına 30ms (133 görsel = ~4s)
      
      setTimeout(() => {
        setCanShowCanvas(true);
      }, waitTime);
    }
  }, [done, images.length]);

  return (
    <>
      <SEO
        title="Gallery - StudioBomonty"
        description="Explore our creative work in an immersive 3D gallery experience"
        image="https://studiobomonty.vercel.app/images/og-image.jpg"
      />
      <div className="bg-black w-full overflow-hidden relative" style={{ height: '100vh', minHeight: '100vh' }}>
        {/* Loading ekranı - Canvas mount edilip görseller render olana kadar göster */}
        {(!done || !canShowCanvas) && (
          <GalleryLoader/>
        )}
        
        {/* Canvas GPU yükleme tamamlandığında mount et ama görseller render olana kadar gizli tut */}
        {done && (
          <div 
            className={`w-full h-full ${canShowCanvas ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity duration-500`}
            style={{ 
              visibility: canShowCanvas ? 'visible' : 'hidden' 
            }}
          >
            <Canvas 
              camera={{ position: [0, 0, 20], fov: 75 }}
              gl={{ 
                antialias: true,
                powerPreference: "high-performance"
              }}
            >
              <Scene items={images} />
            </Canvas>
          </div>
        )}
      </div>
    </>
  );
}

// Helper functions (same as before)
function isVideoFile(url: string): boolean {
  if (!url) return false;
  const lowerUrl = url.toLowerCase();
  return lowerUrl.endsWith('.mp4') || 
         lowerUrl.endsWith('.webm') || 
         lowerUrl.endsWith('.mov') || 
         lowerUrl.endsWith('.avi') ||
         lowerUrl.includes('.mp4') ||
         lowerUrl.includes('.webm');
}

function isImageFile(url: string): boolean {
  if (!url) return false;
  const lowerUrl = url.toLowerCase();
  return lowerUrl.endsWith('.jpg') || 
         lowerUrl.endsWith('.jpeg') || 
         lowerUrl.endsWith('.png') || 
         lowerUrl.endsWith('.gif') || 
         lowerUrl.endsWith('.webp') ||
         lowerUrl.endsWith('.svg') ||
         (!isVideoFile(url) && !lowerUrl.includes('.mp4') && !lowerUrl.includes('.webm'));
}

// getStaticProps aynı kalacak
export const getStaticProps: GetStaticProps = async () => {
  try {
    const projects = await fetchProjectsSSR();
    const allImages: GalleryImageItem[] = [];
    let imageIndex = 0;

    for (const project of projects) {
      // Banner media'yı ekle
      if (project.banner_media && isImageFile(project.banner_media)) {
        allImages.push({
          id: `project-${project.id}-banner-${imageIndex++}`,
          image: project.banner_media
        });
      }

      // Gallery'den random 2 görsel seç
      try {
        const galleryImages = await fetchProjectGallery(project.id);
        const imageGalleryImages = galleryImages.filter(img => img && isImageFile(img));
        
        if (imageGalleryImages.length > 0) {
          // Random shuffle (Fisher-Yates)
          const shuffled = [...imageGalleryImages];
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          }
          
          // İlk 2 görseli al (veya mevcut kadarsa)
          const selectedImages = shuffled.slice(0, Math.min(3, shuffled.length));
          
          for (const galleryImage of selectedImages) {
            allImages.push({
              id: `project-${project.id}-gallery-${imageIndex++}`,
              image: galleryImage
            });
          }
        }
      } catch (error) {
        console.error(`Error fetching gallery for project ${project.id}:`, error);
      }
    }
    
    return {
      props: {
        images: allImages.map(item => ({
          id: item.id,
          image: normalizeImageUrl(item.image)
        }))
      },
      revalidate: 60
    };
  } catch (error) {
    console.error('Gallery static props error:', error);
    return {
      props: {
        images: []
      },
      revalidate: 60
    };
  }
};