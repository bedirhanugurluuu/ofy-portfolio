"use client";
import React, { useEffect, useRef, useState } from "react";
import { ContactContent, normalizeImageUrl, isSupabaseImage } from "@/lib/api";
import AnimatedText from "./AnimatedText";
import gsap from "gsap";
import Image from "next/image";
import Keypad from "./Keypad";
import ContactForm from "./ContactForm";

interface ContactPageProps {
  content: ContactContent;
}

export default function ContactPage({ content }: ContactPageProps) {
  const contactRef = useRef<HTMLDivElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();
    
    tl.fromTo([contactRef.current, socialsRef.current], 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power2.out" }
    );
  }, []);

  useEffect(() => {
    // Grid pattern'i sadece contact sayfasında ekle
    const styleId = 'contact-grid-pattern';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        body {
          position: relative;
          overflow-x: hidden;
        }
        body::before {
          --size: 45px;
          --line: #FFFFFF3B;
          content: '';
          height: 100vh;
          width: 100vw;
          position: absolute;
          background: linear-gradient(90deg, var(--line) 1px, transparent 1px var(--size)) calc(var(--size) * 0.36) 50% / var(--size) var(--size), linear-gradient(var(--line) 1px, transparent 1px var(--size)) 0% calc(var(--size) * 0.32) / var(--size) var(--size);
          -webkit-mask: linear-gradient(-20deg, transparent 65%, white);
          mask: linear-gradient(-20deg, transparent 65%, white);
          top: 0;
          left: 0;
          transform-style: flat;
          pointer-events: none;
          z-index: 3;
        }
        .bg-black {
          position: relative;
          z-index: 1;
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      // Sayfa değiştiğinde temizle
      const style = document.getElementById(styleId);
      if (style) {
        style.remove();
      }
    };
  }, []);

  return (
    <div className="bg-black text-white">
      <div className="pt-37">
        <div>
          <div className="flex flex-col lg:flex-row lg:items-start lg:gap-8 px-5">
            <div>
                {/* Title */}
                <div className="mb-45 max-w-[420px]">
                  <AnimatedText className="text-3xl md:text-4xl font-medium text-white max-w-4xl">
                    {content.title || "Contact"}
                  </AnimatedText>
                </div>

                {/* Contact Info Grid */}
                <div className="flex flex-wrap gap-4 mb-10">
                  {/* Contact */}
                  <div ref={contactRef} className="space-y-4 min-w-[240px]">
                    <h3 className="text-xs font-medium uppercase tracking-wider mb-1 text-white">
                      CONTACT
                    </h3>
                    <div className="space-y-2">
                      <a
                        href={`tel:${content.phone.replace(/\s+/g, '')}`}
                        className="text-sm opacity-60 hover:opacity-100 font-medium mb-0 block transition-opacity text-white"
                      >
                        {content.phone}
                      </a>
                      <a
                        href={`mailto:${content.email.replace(/\s+/g, '')}`}
                        className="text-sm opacity-60 hover:opacity-100 font-medium mb-0 block transition-opacity text-white"
                      >
                        {content.email}
                      </a>
                    </div>
                  </div>

                  {/* Socials */}
                  <div ref={socialsRef} className="space-y-4 min-w-[200px]">
                    <h3 className="text-xs font-medium uppercase tracking-wider mb-1 text-white">
                      SOCIALS
                    </h3>
                    <div className="space-y-2">
                      {content.social_items?.map((item, index) => (
                        <a
                          key={index}
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium opacity-60 hover:opacity-100 transition-opacity block mb-0 text-white"
                        >
                          {item.name}
                        </a>
                      )) || (
                        <>
                          <a
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium opacity-60 hover:opacity-100 transition-opacity block mb-0 text-white"
                          >
                            Instagram
                          </a>
                          <a
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium opacity-60 hover:opacity-100 transition-opacity block mb-0 text-white"
                          >
                            LinkedIn
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                </div>
            </div>

            {/* Form and Keypad Container */}
            <div className="flex flex-1 flex-col lg:flex-row gap-8 lg:items-center w-full lg:w-auto items-center justify-end">
              {/* Contact Form */}
              <div className="lg:mt-0 mt-6 w-full lg:w-[35%]">
                <ContactForm />
              </div>

              {/* Keypad */}
              <div className="lg:mt-0 mt-6 mb-10 lg:mb-0">
                <Keypad />
              </div>
            </div>
          </div>

          {/* Full Width Image */}
           <div className="relative w-full" style={{ aspectRatio: '3.076923076923077 / 1' }}>
             {content.image_path ? (
               <Image
                 src={normalizeImageUrl(content.image_path)}
                 alt="Contact"
                 fill
                 className="object-cover"
                 sizes="100vw"
                 loading="lazy"
                 placeholder="blur"
                 blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                 unoptimized={isSupabaseImage(normalizeImageUrl(content.image_path))}
               />
             ) : (
               <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                 <span className="text-gray-500 text-lg">Contact Image Placeholder</span>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}
