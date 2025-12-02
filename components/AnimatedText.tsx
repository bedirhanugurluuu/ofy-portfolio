"use client";
import { useEffect, useRef, ReactNode } from "react";
import SplitType from "split-type";
import gsap from "gsap";

interface AnimatedTextProps {
  children: ReactNode;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  preserveDisplay?: boolean;
}

export default function AnimatedText({
  children,
  as: Tag = "p",
  className = "",
  style,
  delay = 0,
  preserveDisplay = false,
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

  // If preserveDisplay is true, don't apply any display styles that might interfere with flex
  const elementStyle = preserveDisplay ? { display: 'contents' } : {};
  const combinedStyle = { ...elementStyle, ...style };

  return (
    <Tag ref={textRef as any} className={className} style={combinedStyle}>
      {children}
    </Tag>
  );
}
