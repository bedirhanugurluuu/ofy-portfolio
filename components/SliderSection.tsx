"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { SliderItem, normalizeImageUrl } from "@/lib/api";
import gsap from "gsap";
import AnimatedText from "./AnimatedText";

interface SliderSectionProps {
  sliderItems: SliderItem[];
}

export default function SliderSection({ sliderItems }: SliderSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  


  const currentItem = sliderItems[currentIndex];

    const handleDotClick = (index: number) => {
    if (index === currentIndex) return;
    setCurrentIndex(index);
  };



  if (!currentItem || sliderItems.length === 0) {
    console.log('SliderSection: No items or currentItem is null', { sliderItems, currentItem });
    return null;
  }

  console.log('SliderSection: Rendering with', { currentItem, imageUrl: normalizeImageUrl(currentItem.image_path) });

  return (
    <section className="w-full px-5 py-20">
      <div className="relative">
        {/* Full-width image with aspect ratio */}
        <div className="relative w-full" style={{ aspectRatio: '2.230769230769231 / 1' }}>
          <Image
            src={normalizeImageUrl(currentItem.image_path)}
            alt={currentItem.title}
            fill
            className="object-cover"
            sizes="100vw"
            onLoad={() => console.log('Main image loaded successfully')}
            onError={(e) => console.error('Main image failed to load:', e)}
          />
          <div className="absolute left-0 top-0 w-full h-full flex items-center justify-center" style={{background: 'linear-gradient(114deg, rgba(0, 0, 0, 0.51) 0%, rgba(0, 0, 0, 0) 47.051%)'}}></div>
          {/* Content overlay */}
           <div className="absolute inset-0 flex items-start justify-start">
             <div className="text-left text-white px-10 py-10 max-w-2xl" key={currentIndex}>
                <div className="overflow-hidden mb-2">
                  <h2
                    className="text-sm font-medium uppercase animate-[slideUpMenu_0.8s_ease-out_forwards]"
                    style={{ color: '#FFFFFF66' }}
                  >
                    {currentItem.title}
                  </h2>
                </div>
                 <AnimatedText
                   className="text-xl md:text-2xl font-medium mb-9 max-w-[400px]"
                 >
                   {currentItem.subtitle}
                 </AnimatedText>
                 <div className="overflow-hidden">
                    <p
                      className="text-sm font-medium animate-[slideUpMenu_0.8s_ease-out_forwards]"
                      style={{ color: '#FFFFFF66' }}
                    >
                      {currentItem.sub_subtitle}
                    </p>
                 </div>
             </div>
           </div>
        </div>

        {/* Thumbnail dots navigation */}
        <div className="absolute bottom-8 left-12">
          <div className="flex space-x-3">
            {sliderItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => handleDotClick(index)}
                className="relative group transition-all duration-300 cursor-pointer"
              >
                {/* Thumbnail image */}
                 <div className={`w-33 h-22 overflow-hidden transition-all duration-300 ${
                   index === currentIndex
                     ? 'opacity-100'
                     : 'opacity-20 group-hover:opacity-100'
                 }`}>
                  <Image
                     src={normalizeImageUrl(item.image_path)}
                     alt={`Slide ${index + 1}`}
                     width={134}
                     height={90}
                     className="object-cover w-full h-full"
                     onLoad={() => console.log(`Thumbnail ${index + 1} loaded successfully`)}
                     onError={(e) => console.error(`Thumbnail ${index + 1} failed to load:`, e)}
                   />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
