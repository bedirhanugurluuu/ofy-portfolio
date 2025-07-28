"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ButtonWithHoverArrow from "../components/ButtonWithHoverArrow";

const images = [
  "/images/small1.jpg",
  "/images/small2.jpg",
  "/images/small3.jpg", // SON: bu büyüyecek
];

export default function IntroBanner() {
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [firstImageLoaded, setFirstImageLoaded] = useState(false);
  const [overlayGone, setOverlayGone] = useState(false);
  const [readyToStart, setReadyToStart] = useState(false);

  // Overlay animasyonu kontrolü
  useEffect(() => {
    if (index === 0) {
      const timer1 = setTimeout(() => setFirstImageLoaded(true), 50);
      const timer2 = setTimeout(() => {
        setOverlayGone(true);
        setReadyToStart(true);  // Overlay kaybolunca resimler başlasın
      }, 800); // overlay yukarı kayma animasyon süresi + biraz ekstra
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
      setFirstImageLoaded(false);
      setOverlayGone(false);
    }
  }, [index]);

  // Resim değiştirme sadece readyToStart true ise başlar
  useEffect(() => {
    if (!readyToStart) return; // hazır değilse çalışmaz

    if (index < images.length - 1) {
      const t = setTimeout(() => setIndex((p) => p + 1), 550);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setExpanded(true), 500);
      return () => clearTimeout(t);
    }
  }, [index, readyToStart]);

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

  return (
    <div className="relative w-full h-screen overflow-hidden">
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
          src={images[index]}
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
              Redefining creativity for the
            </h1>
          </div>
          <div className="overflow-hidden">
            <p className="text-2xl md:text-3xl font-bold text-white animate-[slideUp_0.8s_ease-out_forwards] [animation-delay:0.15s] opacity-0">
              future with flawless execution.
            </p>
          </div>
          <div className="overflow-hidden">
            <Link
              href="/works/grid-view"
              className="group relative inline-flex items-center gap-2 border border-white/20 bg-white/10 backdrop-blur-md px-5 py-2 text-sm hover:bg-white/20 transition-colors animate-[slideUp_0.8s_ease-out_forwards] [animation-delay:0.3s] opacity-0"
            >
              VIEW PROJECTS
              <ButtonWithHoverArrow />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
