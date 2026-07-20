"use client";

import {
  fetchFeaturedNews,
  isSupabaseImage, shouldUnoptimizeImage,
  News,
  normalizeImageUrl,
} from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const aspectRatios: Record<string, string> = {
  "aspect-square": "1 / 1",
  "aspect-[3/2]": "3 / 2",
  "aspect-video": "16 / 9",
};

export default function FromTheJournal() {
  const [featuredNews, setFeaturedNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedNews()
      .then(setFeaturedNews)
      .catch((error) => console.error("Featured news yüklenemedi:", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="px-4 py-12">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="text-2xl font-medium">From the Archive</h2>
        <Link href="/blog" className="text-sm font-medium">
          READ ALL ARTICLES
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-square w-full rounded-lg bg-gray-200" />
                <div className="mt-4 h-6 w-3/4 rounded bg-gray-200" />
              </div>
            ))
          : featuredNews.map((article) => {
              const image = article.news_images[0]?.image_path;
              const src = image ? normalizeImageUrl(image) : "";

              return (
                <Link
                  href={`/blog/${article.slug}`}
                  key={article.id}
                  className="group block"
                >
                  <div
                    className="relative w-full overflow-hidden rounded-lg bg-neutral-100"
                    style={{
                      aspectRatio: aspectRatios[article.aspect_ratio] || "1 / 1",
                    }}
                  >
                    {src ? (
                      <Image
                        src={src}
                        alt={article.title}
                        fill
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        unoptimized={shouldUnoptimizeImage(src)}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-gray-500">
                        No image
                      </div>
                    )}
                  </div>
                  <h3 className="mt-4 border-t border-black/10 px-1 pt-3 text-xl font-medium">
                    {article.title}
                  </h3>
                </Link>
              );
            })}
      </div>
    </section>
  );
}
