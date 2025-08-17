"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ButtonWithHoverArrow from "../components/ButtonWithHoverArrow";
import axiosInstance from "../utils/axiosInstance";

type Banner = {
  id: number;
  image: string;
  title_line1: string;
  title_line2: string;
  button_text: string;
  button_link: string;
};

interface IntroBannerProps {
  initialBanners?: Banner[];
}

export default function IntroBanner({ initialBanners = [] }: IntroBannerProps) {
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [firstImageLoaded, setFirstImageLoaded] = useState(false);
  const [overlayGone, setOverlayGone] = useState(false);
  const [readyToStart, setReadyToStart] = useState(false);

  // Eğer initialBanners boşsa, client-side'da fetch et
  useEffect(() => {
    if (initialBanners.length === 0) {
      axiosInstance
        .get<Banner[]>("/api/intro-banners")
        .then((res) => setBanners(res.data))
        .catch(() => setBanners([]));
    }
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
          src={process.env.NEXT_PUBLIC_API_BASE_URL + currentBanner.image}
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
        <div className="absolute inset-0 flex flex-col justify-center items-start text-white text-left px-4 z-30 space-y-2">
          <div className="overflow-hidden banner-title">
            <h1 className="text-2xl md:text-3xl font-bold leading-tight animate-[slideUp_0.8s_ease-out_forwards]">
              {currentBanner.title_line1}
            </h1>
          </div>
          <div className="overflow-hidden">
            <p className="text-2xl md:text-3xl font-bold text-white animate-[slideUp_0.8s_ease-out_forwards] [animation-delay:0.15s] opacity-0">
              {currentBanner.title_line2}
            </p>
          </div>
          <div className="overflow-hidden">
            <Link
              href={currentBanner.button_link}
              className="group relative inline-flex items-center gap-2 border border-white/20 bg-white/10 backdrop-blur-md px-5 py-2 text-sm hover:bg-white/20 transition-colors animate-[slideUp_0.8s_ease-out_forwards] [animation-delay:0.3s] opacity-0"
            >
              {currentBanner.button_text}
              <ButtonWithHoverArrow />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
