"use client";

import { useState, useEffect } from "react";
import { fetchFooter } from "@/lib/api";
import type { Footer } from "@/lib/api";

export default function Footer() {
    const [footer, setFooter] = useState<Footer | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFooter()
          .then((data) => {
            if (data) {
              setFooter(data);
            }
          })
          .catch((error) => {
            console.error('Footer yükleme hatası:', error);
          })
          .finally(() => {
            setLoading(false);
          });
    }, []);

    // Loading durumunda hiçbir şey gösterme
    if (loading || !footer) {
        return null;
    }

    return (
        <footer className="bg-black text-white relative lg:sticky bottom-0 px-4 pt-25 pb-8" style={{ zIndex: '1' }}>
            <div className="mx-auto">
                {/* CTA */}
                <div className="mb-11">
                    <p className="text-white opacity-50 text-3xl max-w-[260px] lg:max-w-none lg:text-4xl font-medium mb-2">
                        {footer.cta_title}
                    </p>
                    <a
                        href={footer.cta_link}
                        className="text-white text-3xl lg:text-4xl transition font-medium relative inline-block group hover:opacity-50"
                    >
                        <span className="block text-white group">
                            Get in touch
                        </span>
                    </a>
                </div>

                {/* Line */}
                <div className="border-t border-gray-white opacity-20 mb-5" />

                {/* Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-10 text-sm mb-20 lg:mb-55">
                    {/* Sitemap */}
                    <div>
                        <h4 className="text-white opacity-40 font-medium mb-2">SITEMAP</h4>
                        <ul className="space-y-2">
                            {footer.sitemap_items.map((item, i) => (
                                <li key={i} className="mb-0">
                                    <a
                                        href={item.link}
                                        className="text-white text-md font-medium hover:opacity-40 transition"
                                    >
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Socials */}
                    <div>
                        <h4 className="text-white opacity-40 font-medium mb-2">SOCIALS</h4>
                        <ul className="space-y-2">
                            {footer.social_items.map((item, i) => (
                                <li key={i} className="mb-0">
                                    <a
                                        href={item.link}
                                        className="text-white text-md font-medium hover:opacity-40 transition"
                                    >
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Text */}
                <div className="text-white font-medium opacity-40 text-xs text-center" style={{ letterSpacing: 0 }}>
                    {footer.copyright_text}
                </div>
            </div>
        </footer>
    );
}
