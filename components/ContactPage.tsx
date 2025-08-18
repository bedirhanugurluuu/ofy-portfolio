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
  const addressRef = useRef<HTMLDivElement>(null);
  const hoursRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();
    
    tl.fromTo([contactRef.current, socialsRef.current, addressRef.current, hoursRef.current], 
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
              Contact
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
                  href={`tel:${content.phone}`}
                  className="text-sm opacity-40 hover:opacity-100 font-medium mb-0 block transition-opacity"
                >
                  {content.phone}
                </a>
                <a
                  href={`mailto:${content.email}`}
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
                <a
                  href={content.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium opacity-40 hover:opacity-100 transition-opacity block mb-0"
                >
                  Instagram
                </a>
                <a
                  href={content.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium opacity-40 hover:opacity-100 transition-opacity block mb-0"
                >
                  LinkedIn
                </a>
              </div>
            </div>

            {/* Address */}
            <div ref={addressRef} className="space-y-4 min-w-[260px]">
              <h3 className="text-xs font-medium uppercase tracking-wider mb-1">
                ADDRESS
              </h3>
              <div className="space-y-2">
                <p className="text-sm opacity-40 hover:opacity-100 font-medium mb-0">{content.address_line1}</p>
                <p className="text-sm opacity-40 hover:opacity-100 font-medium mb-0">{content.address_line2}</p>
              </div>
            </div>

            {/* Studio Hours */}
            <div ref={hoursRef} className="space-y-4 min-w-[260px]">
              <h3 className="text-xs font-medium uppercase tracking-wider mb-1">
                STUDIO HOURS
              </h3>
              <div className="space-y-2">
                <p className="text-sm opacity-40 hover:opacity-100 font-medium mb-0">{content.studio_hours_weekdays}</p>
                <p className="text-sm opacity-40 hover:opacity-100 font-medium mb-0">{content.studio_hours_weekend}</p>
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
