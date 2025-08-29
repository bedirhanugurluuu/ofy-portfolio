"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import ButtonWithHoverArrow from "../components/ButtonWithHoverArrow";
import { fetchAboutBanner, normalizeImageUrl } from "@/lib/api";
import type { AboutBanner } from "@/lib/api";

export default function AboutBanner() {
  const [banner, setBanner] = useState<AboutBanner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutBanner()
      .then((data) => {
        if (data) {
          setBanner(data);
        }
      })
      .catch((error) => {
        console.error('About banner yükleme hatası:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Loading durumunda hiçbir şey gösterme
  if (loading || !banner) {
    return null;
  }

  return (
    <section className="relative w-full overflow-hidden px-4 mb-20">
        <div className="aspect-[0.6363636364/1] md:aspect-[2.32/1] " style={{ position: 'relative' }}>
            <Image
                src={normalizeImageUrl(banner.image)}
                alt="About Banner"
                fill
                sizes="100vw"
                loading="lazy"
                className="relative"
                style={{ objectFit: "cover" }}
            />

            <div className="absolute inset-0 flex items-start">
                <div className="text-white max-w-4xl text-left p-4 md:p-8">
                    <p className="hidden md:block mb-6 text-4xl font-medium">
                        {banner.title_desktop}
                    </p>
                    <p className="block md:hidden mb-6 text-3xl font-medium max-w-[260]">
                        {banner.title_mobile}
                    </p>
                    <Link
                        href={banner.button_link}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm text-white group hover:bg-gray-200!important transition"
                        style={{ background: "rgba(255, 255, 255, 0.1)", backdropFilter: "blur(15px)", letterSpacing: "0", border: "1px solid rgba(255, 255, 255, 0.1)" }}
                    >
                        {banner.button_text}
                        <ButtonWithHoverArrow />
                    </Link>
                </div>
            </div>
        </div>
    </section>
  );
}
