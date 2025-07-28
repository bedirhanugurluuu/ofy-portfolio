"use client";
import { useEffect, useRef } from "react";
import SplitType from "split-type";
import gsap from "gsap";

export default function About() {
  const imageRef = useRef<HTMLDivElement>(null);
  const introTextRef = useRef<HTMLParagraphElement>(null);
  const visionTitleRef = useRef<HTMLHeadingElement>(null);  // Our Vision başlığı için
  const visionTextRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      !introTextRef.current ||
      !visionTitleRef.current ||
      !visionTextRef.current ||
      !lineRef.current
    )
      return;

    const splitIntro = new SplitType(introTextRef.current, { types: "lines" });
    const splitVisionTitle = new SplitType(visionTitleRef.current, { types: "lines" });
    const splitVisionText = new SplitType(visionTextRef.current, { types: "lines" });

    const tl = gsap.timeline();

    // İlk paragraf animasyonu
    tl.from(splitIntro.lines, {
      y: 30,
      opacity: 0,
      stagger: 0.1,
      duration: 0.3,
      ease: "power2.out",
    });

    // Our Vision başlığı animasyonu
    tl.from(
      splitVisionTitle.lines,
      {
        y: 30,
        opacity: 0,
        stagger: 0.15,
        duration: 0.3,
        ease: "power2.out",
      },
      "+=0.1"
    );

    // Alt paragraf animasyonu
    tl.from(
      splitVisionText.lines,
      {
        y: 30,
        opacity: 0,
        stagger: 0.15,
        duration: 0.3,
        ease: "power2.out",
      },
      "+=0.1"
    );

    // Çizgi animasyonu
    tl.to(
      lineRef.current,
      {
        width: "100%",
        duration: 1,
        ease: "power2.out",
      },
      "+=0.1"
    );

    return () => {
      splitIntro.revert();
      splitVisionTitle.revert();
      splitVisionText.revert();
      tl.kill();
    };
  }, []);

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-white px-5 py-50 gap-8">
      <div className="w-full lg:w-1/2 flex flex-col gap-12 relative">
        <div>
          <p ref={introTextRef} className="text-3xl font-medium max-w-xl">
            A collective of visionaries shaping tomorrow, where creativity and
            innovation intersect. Our studio is built on the belief that bold
            ideas and meticulous execution drive meaningful design.
          </p>
        </div>
        <div className="sticky top-150">
          <div className="relative py-4">
            <div className="relative mb-2">
              <div
                ref={lineRef}
                className="h-[1px] bg-[rgba(0,0,0,0.1)]"
                style={{ width: "0%" }}
              />
            </div>
            <div className="flex align-start justify-between h-full">
              <span
                ref={visionTitleRef}
                className="lg:w-1/2 text-sm font-medium uppercase"
                style={{ letterSpacing: 0 }}
              >
                Our Vision
              </span>
              <div className="lg:w-1/2">
                <p
                  ref={visionTextRef}
                  className="opacity-60 text-sm"
                  style={{ whiteSpace: "pre-line" }}
                >
                  We craft innovative design strategies for forward thinking
                  brands, combining aesthetics with purpose to create impactful
                  solutions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sağ Kısım: Görsel */}
      <div className="w-full aspect-[.75/1] lg:w-1/2" ref={imageRef}>
        <img
          src="/images/sample-about.png"
          alt="About Visual"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
