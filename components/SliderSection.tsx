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

    return null;
  }

  

  return (
    <section className="w-full px-5 py-20">
      <div className="relative">
        {/* Full-width image with aspect ratio */}
        <div className="relative w-full aspect-[.7090909090909091/1] md:aspect-[2.230769230769231/1]">
          <Image
            src={normalizeImageUrl(currentItem.image_path || '')}
            alt={currentItem.title}
            fill
            className="object-cover"
            sizes="100vw"
            
            onError={(e) => console.error('Main image failed to load:', e)}
          />
          <div className="absolute left-0 top-0 w-full h-full flex items-center justify-center" style={{background: 'linear-gradient(114deg, rgba(0, 0, 0, 0.51) 0%, rgba(0, 0, 0, 0) 47.051%)'}}></div>
          {/* Content overlay */}
           <div className="absolute inset-0 flex items-start justify-start">
             <div className="text-left text-white p-5 md:p-10 max-w-2xl" key={currentIndex}>
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

        {/* Desktop: Thumbnail dots navigation */}
        <div className="absolute bottom-8 left-12 hidden md:block">
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
                     src={normalizeImageUrl(item.image_path || '')}
                     alt={`Slide ${index + 1}`}
                     width={134}
                     height={90}
                     className="object-cover w-full h-full"
     
                     onError={(e) => console.error(`Thumbnail ${index + 1} failed to load:`, e)}
                   />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Mobile: Arrow navigation */}
        <div className="md:hidden relative w-full pt-5">
          <div className="flex items-center space-x-4 justify-end">
            {/* Previous arrow */}
            <button
              onClick={() => {
                const prevIndex = currentIndex === 0 ? sliderItems.length - 1 : currentIndex - 1;
                setCurrentIndex(prevIndex);
              }}
              className="w-10 h-10 bg-[#ececec] rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white/30"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Current slide indicator */}
            <div className="text-black text-sm font-medium">
              {currentIndex + 1} / {sliderItems.length}
            </div>

            {/* Next arrow */}
            <button
              onClick={() => {
                const nextIndex = currentIndex === sliderItems.length - 1 ? 0 : currentIndex + 1;
                setCurrentIndex(nextIndex);
              }}
              className="w-10 h-10 bg-[#ececec] rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white/30"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
