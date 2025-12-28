"use client";
import React, { useEffect, useRef } from "react";
import { ContactContent } from "@/lib/api";
import AnimatedText from "./AnimatedText";
import Keypad from "./Keypad";
import ContactForm, { ContactFormRef } from "./ContactForm";

interface ContactPageProps {
  content: ContactContent;
}

export default function ContactPage({ content }: ContactPageProps) {
  const formRef = useRef<ContactFormRef>(null);

  const handleKeypadClick = (keyText: string) => {
    if (formRef.current) {
      formRef.current.submit();
    }
  };

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
          {/* Title */}
          <div className="mb-10 flex justify-center text-center px-5">
            <AnimatedText className="text-3xl md:text-4xl font-medium text-white max-w-4xl">
              {content.title || "Contact"}
            </AnimatedText>
          </div>

          {/* Form and Keypad Container - Centered */}
          <div className="flex flex-col gap-8 lg:items-center justify-center px-5">
            {/* Contact Form */}
            <div className="lg:mt-0 mt-6 w-full flex justify-center">
              <ContactForm ref={formRef} />
            </div>

            {/* Keypad */}
            <div className="lg:mt-0 mt-6 mb-10 lg:mb-0">
              <Keypad onKeyClick={handleKeypadClick} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
