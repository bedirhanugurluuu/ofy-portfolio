"use client";
import React, { useEffect, useRef } from "react";
import { ContactContent, normalizeImageUrl } from "@/lib/api";
import AnimatedText from "./AnimatedText";
import gsap from "gsap";
import Image from "next/image";

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

  return (
    <div className="bg-white">
      <div className="pt-37">
        <div>
          {/* Title */}
          <div className="mb-45 px-5 max-w-[420px]">
            <AnimatedText className="text-3xl md:text-4xl font-medium text-gray-900 max-w-4xl">
              {content.title || "Contact"}
            </AnimatedText>
          </div>

          {/* Contact Info Grid */}
          <div className="flex flex-wrap gap-4 mb-10 px-5">
            {/* Contact */}
            <div ref={contactRef} className="space-y-4 min-w-[240px]">
              <h3 className="text-xs font-medium uppercase tracking-wider mb-1">
                CONTACT
              </h3>
              <div className="space-y-2">
                <a
                  href={`tel:${content.phone.replace(/\s+/g, '')}`}
                  className="text-sm opacity-40 hover:opacity-100 font-medium mb-0 block transition-opacity"
                >
                  {content.phone}
                </a>
                <a
                  href={`mailto:${content.email.replace(/\s+/g, '')}`}
                  className="text-sm opacity-40 hover:opacity-100 font-medium mb-0 block transition-opacity"
                >
                  {content.email}
                </a>
              </div>
            </div>

            {/* Socials */}
            <div ref={socialsRef} className="space-y-4 min-w-[200px]">
              <h3 className="text-xs font-medium uppercase tracking-wider mb-1">
                SOCIALS
              </h3>
              <div className="space-y-2">
                {content.social_items?.map((item, index) => (
                  <a
                    key={index}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium opacity-40 hover:opacity-100 transition-opacity block mb-0"
                  >
                    {item.name}
                  </a>
                )) || (
                  <>
                    <a
                      href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium opacity-40 hover:opacity-100 transition-opacity block mb-0"
                    >
                      Instagram
                    </a>
                    <a
                      href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium opacity-40 hover:opacity-100 transition-opacity block mb-0"
                    >
                      LinkedIn
                    </a>
                  </>
                )}
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
