"use client";
import AnimatedText from "@/components/AnimatedText";
import gsap from "gsap";
import { useEffect, useRef } from "react";

export default function About() {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!lineRef.current) return;

    gsap.to(lineRef.current, {
      width: "100%",
      duration: 1,
      ease: "power2.out",
      delay: 1.5,
    });
  }, []);
  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-white px-5 py-50 gap-8">
      <div className="w-full lg:w-1/2 flex flex-col gap-12 relative">
        <div>
          <AnimatedText as="p" className="text-3xl font-medium max-w-xl" delay={0}>
            A collective of visionaries shaping tomorrow, where creativity and
            innovation intersect. Our studio is built on the belief that bold
            ideas and meticulous execution drive meaningful design.
          </AnimatedText>
        </div>
        <div className="sticky top-150">
          <div className="relative py-4">
            <div className="relative mb-2">
      <div ref={lineRef} className="h-[1px] bg-[rgba(0,0,0,0.1)] w-0" />
            </div>
            <div className="flex flex-col md:flex-row gap-3 md:gap-0 align-start justify-between h-full">
              <AnimatedText
                as="span"
                className="lg:w-1/2 text-sm font-medium uppercase"
                delay={0.5}
              >
                Our Vision
              </AnimatedText>
              <div className="lg:w-1/2">
                <AnimatedText
                  as="p"
                  className="opacity-60 text-sm"
                  delay={1}
                  // style={{ whiteSpace: "pre-line" }} // istersen ekle
                >
                  We craft innovative design strategies for forward thinking
                  brands, combining aesthetics with purpose to create impactful
                  solutions.
                </AnimatedText>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sağ Kısım: Görsel */}
      <div className="w-full aspect-[.75/1] lg:w-1/2">
        <img
          src="/images/sample-about.png"
          alt="About Visual"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
