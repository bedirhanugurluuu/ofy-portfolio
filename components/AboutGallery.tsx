"use client";
import React from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { AboutGalleryImage, normalizeImageUrl, isSupabaseImage } from "@/lib/api";

interface AboutGalleryProps {
  images: AboutGalleryImage[];
}

export default function AboutGallery({ images }: AboutGalleryProps) {
  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      watchDrag: false,
      containScroll: false,
    },
    [
      AutoScroll({
        speed: 0.6,
        startDelay: 0,
        stopOnInteraction: false,
        stopOnMouseEnter: false,
        stopOnFocusIn: false,
      }),
    ]
  );

  if (images.length === 0) return null;

  // Loop'un her zaman dolu görünmesi için yeterli slide oluştur (panel verisi değişmez)
  const slides =
    images.length >= 8
      ? images
      : Array.from({ length: Math.ceil(8 / images.length) }, () => images).flat();

  return (
    <section className="w-full py-10 md:py-20">
      <div className="overflow-hidden select-none pointer-events-none" ref={emblaRef}>
        <div className="flex">
          {slides.map((image, index) => (
            <div
              key={`${image.id}-${index}`}
              className="relative w-[280px] md:w-[450px] h-[324px] md:h-[520px] flex-shrink-0 min-w-0 mr-[10px]"
            >
              <Image
                src={normalizeImageUrl(image.image_path)}
                alt={`Gallery image ${(index % images.length) + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 280px, 450px"
                draggable={false}
                unoptimized={isSupabaseImage(normalizeImageUrl(image.image_path))}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
