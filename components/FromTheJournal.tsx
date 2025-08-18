"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchFeaturedNews, normalizeImageUrl, News } from "@/lib/api";

export default function FromTheJournal() {
  const [featuredNews, setFeaturedNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedNews = async () => {
      try {
        const news = await fetchFeaturedNews();
        setFeaturedNews(news);
      } catch (error) {
        console.error("Featured news yüklenemedi:", error);
        // Fallback to static data if API fails
        setFeaturedNews([
          {
            id: "1",
            title: "The Art of Minimalism",
            category_text: "DESIGN",
            photographer: "Anna Surokin",
            subtitle: "The Art of Minimalism: Creating Impactful Designs with Less",
            slug: "sustainable-design",
            content: "The Art of Minimalism: Creating Impactful Designs with Less",
            image_path: "/images/journal1.jpg",
            featured: true,
            published_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "2",
            title: "Art Direction from scratch",
            category_text: "ART DIRECTION",
            photographer: "Anna Surokin",
            subtitle: "Art Direction from scratch: Creating a unique art direction for a brand",
            slug: "urban-inspiration",
            content: "Art Direction from scratch: Creating a unique art direction for a brand",
            image_path: "/images/journal2.jpg",
            featured: true,
            published_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "3",
            title: "Material Matters",
            category_text: "DESIGN",
            photographer: "Anna Surokin",
            subtitle: "We launched a new project redefining sustainable branding",
            slug: "material-matters",
            content: "We launched a new project redefining sustainable branding",
            image_path: "/images/journal3.jpg",
            featured: true,
            published_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedNews();
  }, []);

  return (
    <section className="px-4 py-12">
      {/* Header */}
        <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-medium">From the Journal</h2>
            <Link href="/blog" className="group relative inline-block overflow-hidden text-sm font-medium">
                <span className="hidden md:block transition-transform duration-300 group-hover:-translate-y-full" style={{ letterSpacing: 0, }}>
                    READ ALL ARTICLES
                </span>
                <span className="hidden md:block absolute left-0 top-full transition-transform duration-300 group-hover:-translate-y-full" style={{ letterSpacing: 0, }}>
                    READ ALL ARTICLES
                </span>
                <span className="block md:hidden transition-transform duration-300 group-hover:-translate-y-full" style={{ letterSpacing: 0, }}>
                    READ ALL
                </span>
                <span className="block md:hidden absolute left-0 top-full transition-transform duration-300 group-hover:-translate-y-full" style={{ letterSpacing: 0, }}>
                    READ ALL
                </span>
            </Link>
        </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-square w-full bg-gray-200 rounded-lg mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))
        ) : (
          featuredNews.map((article, index) => (
            <Link
              href={`/blog/${article.slug}`}
              key={article.id}
              className="group block"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                {article.image_path ? (
                  <Image
                    src={normalizeImageUrl(article.image_path)}
                    alt={article.subtitle}
                    fill
                    loading="lazy"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}
              </div>

              <div className="mt-4 px-1">
                {/* Line */}
                <div className="relative h-[1px] bg-gray-300 mb-3">
                  <div className="absolute left-0 top-0 h-full bg-black w-0 group-hover:w-full transition-all ease-in duration-500" />
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-sm font-medium opacity-50" style={{ letterSpacing: 0 }}>{article.category_text}</h3>
                <p className="text-xl font-medium">{article.subtitle}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
