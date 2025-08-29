"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import ButtonWithHoverArrow from "../components/ButtonWithHoverArrow";
import { useHeaderSettings } from "../hooks/useHeaderSettings";
import Image from "next/image";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { settings: headerSettings, loading } = useHeaderSettings();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const forceBlackTextPages = ["/about", "/blog", "/careers", "/projects", "/contact"];
  const isDarkText = pathname ?
    forceBlackTextPages.includes(pathname) || pathname.startsWith("/blog/") :
    false;

  // Varsayılan menü öğeleri (fallback)
  const defaultNavItems = [
    { href: "/projects", label: "WORK" },
    { href: "/about", label: "ABOUT" },
    { href: "/blog", label: "NEWS" },
    { href: "/careers", label: "CAREERS" },
  ];

  // Her zaman menü öğelerini göster - loading olsa bile varsayılan öğeleri kullan
  const navItems = headerSettings?.menu_items?.sort((a: any, b: any) => a.order - b.order) || defaultNavItems;

  return (
    <>
      <header
        className={clsx(
          "fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center transition-all duration-300",
          scrolled || menuOpen || isDarkText
            ? "bg-white text-black"
            : "bg-transparent text-white"
        )}
      >
        <Link href="/" className="flex items-center space-x-1 z-50">
          {headerSettings?.logo_image_url ? (
            <div className="relative w-20 h-8">
              <Image
                src={headerSettings.logo_image_url}
                alt="Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          ) : (
            <div className="w-20 h-8 flex items-center justify-center">
              <span className="text-lg font-bold">OFY</span>
            </div>
          )}
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-35">
          <nav className="flex space-x-4 text-sm uppercase font-medium">
            {navItems.map((item: any) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative h-[20px] overflow-hidden"
              >
                <span className="block transition-transform duration-300 group-hover:-translate-y-full">
                  {item.label}
                </span>
                <span className="absolute left-0 top-full block transition-transform duration-300 group-hover:-translate-y-full">
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>
          <Link
            href="/contact"
            className="group ml-4 inline-flex items-center space-x-2 text-sm font-medium"
          >
            <span style={{ letterSpacing: 0 }}>GET IN TOUCH</span>
            <ButtonWithHoverArrow />
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden z-50 relative"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {/* Bu div içine özel hamburger animasyonu geliyor */}
          <div className="relative w-6 h-5">
            <span
              className={clsx(
                "absolute right-0 w-full bg-current transition-all duration-300",
                "h-[1px]",
                menuOpen ? "rotate-45 top-2.5" : "top-1"
              )}
            />
            <span
              className={clsx(
                "absolute right-0 w-full bg-current transition-all duration-300",
                "h-[1px]",
                menuOpen ? "-rotate-45 top-2.5" : "top-3.5"
              )}
            />
          </div>
        </button>

      </header>

      {/* Mobile Menu */}
      <div
        className={clsx(
          "fixed inset-0 bg-white text-black z-40 flex flex-col items-start px-6 justify-start gap-6 transition-all duration-500 ease-in-out",
          menuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
        )}
        style={{ top: "60px" }}
      >
        <nav className="flex flex-col items-start gap-1 text-4xl font-medium w-full pt-20">
          {navItems.map((item: any, index: number) => (
            <div
              key={item.href}
              className="overflow-hidden"
            >
              <Link
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={clsx(
                  "block opacity-0 hover:opacity-60",
                  menuOpen && "animate-[slideUp_0.8s_ease-out_forwards]"
                )}
                style={{
                  animationDelay: menuOpen ? `${0.5 + index * 0.15}s` : "0s",
                  animationFillMode: "forwards",
                }}
              >
                {item.label}
              </Link>
            </div>
          ))}
        </nav>
        <div className="overflow-hidden mt-6 w-full">
          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className={clsx(
              "flex align-center gap-2 text-base font-medium opacity-0 hover:opacity-60",
              menuOpen && "animate-[slideUp_0.8s_ease-out_forwards]"
            )}
            style={{
              animationDelay: menuOpen ? `${0.5 + navItems.length * 0.15}s` : "0s",
              animationFillMode: "forwards",
            }}
          >
            GET IN TOUCH
            <ButtonWithHoverArrow />
          </Link>
        </div>
      </div>

    </>
  );
}