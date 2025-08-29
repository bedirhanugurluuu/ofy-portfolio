"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ButtonWithHoverArrow from "../components/ButtonWithHoverArrow";
import { fetchIntroBanners, normalizeImageUrl, fetchProjects, Project } from "@/lib/api";

import { IntroBanner as IntroBannerType } from "@/lib/api";

interface IntroBannerProps {
  initialBanners?: IntroBannerType[];
}

export default function IntroBanner({ initialBanners = [] }: IntroBannerProps) {
  const [banners, setBanners] = useState<IntroBannerType[]>(initialBanners);
  const [projects, setProjects] = useState<Project[]>([]);
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [firstImageLoaded, setFirstImageLoaded] = useState(false);
  const [overlayGone, setOverlayGone] = useState(false);
  const [readyToStart, setReadyToStart] = useState(false);

  // Eğer initialBanners boşsa, client-side'da fetch et
  useEffect(() => {
    if (initialBanners.length === 0) {
      fetchIntroBanners()
        .then((data) => setBanners(data))
        .catch(() => setBanners([]));
    }
    
    // Projeleri fetch et
    fetchProjects()
      .then((data) => setProjects(data))
      .catch(() => setProjects([]));
  }, [initialBanners.length]);

  useEffect(() => {
    if (index === 0) {
      const timer1 = setTimeout(() => setFirstImageLoaded(true), 50);
      const timer2 = setTimeout(() => {
        setOverlayGone(true);
        setReadyToStart(true);
      }, 800);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
      setFirstImageLoaded(false);
      setOverlayGone(false);
    }
  }, [index]);

  useEffect(() => {
    if (!readyToStart) return;

    if (index < banners.length - 1) {
      const t = setTimeout(() => setIndex((p) => p + 1), 550);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setExpanded(true), 500);
      return () => clearTimeout(t);
    }
  }, [index, readyToStart, banners.length]);

  useEffect(() => {
    if (!expanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [expanded]);

  if (banners.length === 0)
    return <div className="relative w-full min-h-screen overflow-hidden" />;

  const currentBanner = banners[index];
  
  // Bağlantılı projeyi bul
  const relatedProject = currentBanner.project_id 
    ? projects.find(p => p.id === currentBanner.project_id) 
    : null;

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <div
        className="absolute ease-out"
        style={{
          width: expanded ? "100vw" : 300,
          height: expanded ? "100vh" : 200,
          top: "50%",
          left: "50%",
          transform: expanded
            ? "translate(-50%, -50%)"
            : index === 0
            ? firstImageLoaded
              ? "translate(-50%, -50%)"
              : "translate(-50%, -20%)"
            : "translate(-50%, -50%)",
          overflow: "hidden",
          transitionProperty: "width, height, transform",
          transitionDuration: "500ms",
          transitionTimingFunction: "ease-out",
        }}
      >
        <Image
          src={normalizeImageUrl(currentBanner.image || '')}
          alt="banner"
          fill
          priority
          className="object-cover"
          onLoadingComplete={() => setFirstImageLoaded(true)}
        />
        {index === 0 && !overlayGone && (
          <div
            className="absolute bg-white w-full h-full top-0 left-0"
            style={{
              transition: "transform 800ms ease-out",
              transform: firstImageLoaded ? "translateY(-100%)" : "translateY(0)",
              zIndex: 10,
            }}
          />
        )}
      </div>
      {expanded && (
        <>
          {/* Ana içerik */}
          <div className="absolute inset-0 flex flex-col justify-center items-start text-white text-left px-4 z-30 space-y-2">
            {currentBanner.title_line1 && (
              <div className="overflow-hidden banner-title">
                <h1 className="text-2xl md:text-3xl font-bold leading-tight animate-[slideUp_0.8s_ease-out_forwards]">
                  {currentBanner.title_line1}
                </h1>
              </div>
            )}
            {currentBanner.title_line2 && (
              <div className="overflow-hidden">
                <p className="text-2xl md:text-3xl font-bold text-white animate-[slideUp_0.8s_ease-out_forwards] [animation-delay:0.15s] opacity-0">
                  {currentBanner.title_line2}
                </p>
              </div>
            )}
            {currentBanner.button_text && currentBanner.button_link && (
              <div className="overflow-hidden">
                <Link
                  href={currentBanner.button_link}
                  className="group relative inline-flex items-center gap-2 border border-white/20 bg-white/10 backdrop-blur-md px-5 py-2 text-sm hover:bg-white/20 transition-colors animate-[slideUp_0.8s_ease-out_forwards] [animation-delay:0.3s] opacity-0"
                >
                  {currentBanner.button_text}
                  <ButtonWithHoverArrow />
                </Link>
              </div>
            )}
          </div>

          {/* Alt köşe - Scroll ve Project Info */}
          <div className="absolute bottom-8 left-8 right-8 z-30 animate-[slideUp_0.8s_ease-out_forwards] [animation-delay:0.45s] opacity-0">
            <div className="flex justify-between items-end">
              {/* Sol taraf - Scroll to view more */}
              {currentBanner.scroll_text && (
                <button
                  onClick={() => {
                    const element = document.getElementById('featured-projects');
                    if (element) {
                      element.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                      });
                    }
                  }}
                  className="group relative inline-flex items-center font-medium gap-2 text-white opacity-40 hover:opacity-100 transition-opacity text-sm cursor-pointer"
                >
                  {currentBanner.scroll_text}
                </button>
              )}

              {/* Sağ taraf - Project Info */}
              {relatedProject && (
                <Link href={`/projects/${relatedProject.slug}`} className="contents">
                  <div className="relative flex group w-[320px] h-[100px] gap-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: '5px' }}>
                    {/* Project Thumbnail */}
                    <div className="absolute group top-2 right-2" style={{ rotate: '-45deg' }}>
                      <ButtonWithHoverArrow />
                    </div>
                    <div className="flex-shrink-0">
                      <div className="w-[90px] h-[90px] relative overflow-hidden" style={{ aspectRatio: '1 / 1' }}>
                        {relatedProject.thumbnail_media ? (
                          relatedProject.thumbnail_media.toLowerCase().endsWith('.mp4') || 
                          relatedProject.thumbnail_media.toLowerCase().endsWith('.webm') ? (
                            <video
                              src={normalizeImageUrl(relatedProject.thumbnail_media)}
                              className="w-full h-full object-cover"
                              muted
                              loop
                              playsInline
                            />
                          ) : (
                            <Image
                              src={normalizeImageUrl(relatedProject.thumbnail_media)}
                              alt={relatedProject.title}
                              fill
                              className="object-cover"
                            />
                          )
                        ) : (
                          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                            <span className="text-gray-500 text-xs">No image</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Project Info */}
                    <div className="min-w-0 flex flex-col justify-between">
                      <p className="text-xs uppercase tracking-wide mb-1 font-medium">
                        Latest Case Studies
                      </p>
                      <div className="block group">
                        <h4 className="text-xs font-medium">
                          {relatedProject.title}
                        </h4>
                        {relatedProject.role && (
                          <p className="text-xs opacity-40 font-medium">{relatedProject.role}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
