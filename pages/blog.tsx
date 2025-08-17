import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { fetchNews, normalizeImageUrl } from "@/lib/api";
import React from "react";
import { GetServerSideProps } from "next";

interface News {
  id: number;
  title: string;
  subtitle: string;
  slug: string;
  category_text: string;
  content?: string;
  image_path?: string;
  aspect_ratio?: string;
  is_featured?: boolean;
  featured_order?: number;
  published_at: string;
  created_at: string;
  updated_at: string;
}

type Props = {
  news: News[];
};

export default function BlogPage({ news }: Props) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen px-5 pt-35 md:pt-50 pb-10">
      {/* Header */}
      <div className="overflow-hidden">
        <h1 className="text-3xl md:text-4xl font-medium overflow-hidden animate-[slideUpMenu_0.8s_ease-out_forwards]">
          Journal
        </h1>
      </div>

      {/* Animated Line */}
      <div className="relative h-[1px] my-10">
        <div className="absolute left-0 top-0 h-full w-0 animate-[lineExpand_0.8s_ease-in-out_0.8s_forwards]" style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }} />
      </div>

      {/* News Grid */}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-5">
        {news.map((article, i) => (
          <Link key={article.id} href={`/blog/${article.slug}`} passHref>
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              {/* Image */}
              <div className={`relative ${article.aspect_ratio || 'aspect-square'} w-full overflow-hidden rounded-sm mb-4`}>
                {article.image_path ? (
                  <Image
                    src={normalizeImageUrl(article.image_path)}
                    alt={article.subtitle}
                    fill
                    className="object-cover scale-105 group-hover:scale-100 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="mt-4 px-1">
                {/* Line */}
                <div className="relative h-[1px] bg-gray-300 mb-3">
                  <div className="absolute left-0 top-0 h-full bg-black w-0 group-hover:w-full transition-all ease-in duration-500" />
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-sm font-medium opacity-50" style={{ letterSpacing: 0 }}>{article.category_text}</h3>
                <p className="text-xl font-medium">{article.subtitle}</p>
              </div>
            </motion.article>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {news.length === 0 && (
        <div className="text-center py-20">
          <h3 className="text-xl font-medium text-gray-600 mb-2">No articles yet</h3>
          <p className="text-gray-500">Check back soon for new content.</p>
        </div>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const news = await fetchNews();

    return {
      props: {
        news,
      },
    };
  } catch (error) {
    console.error("News SSR alınamadı:", error);
    return {
      props: {
        news: [],
      },
    };
  }
};
