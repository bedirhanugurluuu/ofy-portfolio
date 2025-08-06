"use client";
import { useEffect, useRef, ReactNode } from "react";
import SplitType from "split-type";
import gsap from "gsap";

interface AnimatedTextProps {
  children: ReactNode;
  as?: React.ElementType;
  className?: string;
  delay?: number;
}

export default function AnimatedText({
  children,
  as: Tag = "p",
  className = "",
  delay = 0,
}: AnimatedTextProps) {
  const textRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const split = new SplitType(textRef.current, { types: "lines" });
    const tl = gsap.timeline();

    tl.from(split.lines, {
      y: 30,
      opacity: 0,
      stagger: 0.1,
      duration: 0.3,
      ease: "power2.out",
      delay,
    });

    return () => {
      split.revert();
      tl.kill();
    };
  }, [delay]);

  return (
    <Tag ref={textRef as any} className={className}>
      {children}
    </Tag>
  );
}
