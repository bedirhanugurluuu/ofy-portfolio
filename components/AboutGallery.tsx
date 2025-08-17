"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { AboutGalleryImage, normalizeImageUrl } from "@/lib/api";

interface AboutGalleryProps {
  images: AboutGalleryImage[];
}

export default function AboutGallery({ images }: AboutGalleryProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (images.length === 0) return;

         const animate = () => {
       setScrollPosition((prev) => {
         const newPosition = prev + 0.5; // 0.5px at a time for slower movement
         const maxScroll = images.length * 470; // Total width of all images
         return newPosition >= maxScroll ? 0 : newPosition;
       });
       animationRef.current = requestAnimationFrame(animate);
     };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [images.length]);

  if (images.length === 0) return null;

  return (
    <section className="w-full py-20">
      <div>
        <div className="flex justify-center">
          <div className="relative overflow-hidden">
            <div
              className="flex"
              style={{
                transform: `translateX(-${scrollPosition}px)`,
                gap: '10px'
              }}
            >
              {/* Duplicate images for seamless loop */}
              {[...images, ...images].map((image, index) => (
                <div
                  key={`${image.id}-${index}`}
                  className="relative w-[450px] h-[520px] flex-shrink-0"
                >
                  <Image
                    src={normalizeImageUrl(image.image_path)}
                    alt={`Gallery image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="450px"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
