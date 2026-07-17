import SEO from "@/components/SEO";
import {
  fetchNews,
  isSupabaseImage,
  News,
  normalizeImageUrl,
} from "@/lib/api";
import { motion } from "framer-motion";
import { GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";

type Props = { news: News[] };

const aspectRatios: Record<string, string> = {
  "aspect-square": "1 / 1",
  "aspect-[3/2]": "3 / 2",
  "aspect-video": "16 / 9",
};

export default function BlogPage({ news }: Props) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Journal - OFY Portfolio",
    description: "Insights, thoughts, and stories from our creative journey.",
    url: "https://farukyilmaz.com/blog",
    publisher: { "@type": "Organization", name: "OFY" },
    blogPost: news.map((article) => ({
      "@type": "BlogPosting",
      headline: article.title,
      datePublished: article.created_at,
      dateModified: article.updated_at,
      url: `https://farukyilmaz.com/blog/${article.slug}`,
      image: article.news_images[0]
        ? normalizeImageUrl(article.news_images[0].image_path)
        : null,
    })),
  };

  return (
    <>
      <SEO
        title="Faruk Yılmaz | Blog"
        description="Insights, thoughts, and stories from our creative journey."
        image="https://farukyilmaz.com/images/blog-og.jpg"
        schema={schema}
      />
      <main className="min-h-screen px-5 pb-10 pt-35 md:pt-50">
        <h1 className="text-3xl font-medium md:text-4xl">Journal</h1>
        <div className="my-10 h-px bg-black/10" />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((article, index) => {
            const image = article.news_images[0]?.image_path;
            const src = image ? normalizeImageUrl(image) : "";

            return (
              <Link key={article.id} href={`/blog/${article.slug}`}>
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group cursor-pointer"
                >
                  <div
                    className="relative mb-4 w-full overflow-hidden rounded-sm bg-neutral-100"
                    style={{
                      aspectRatio: aspectRatios[article.aspect_ratio] || "1 / 1",
                    }}
                  >
                    {src ? (
                      <Image
                        src={src}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        loading="lazy"
                        unoptimized={isSupabaseImage(src)}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-gray-500">
                        No image
                      </div>
                    )}
                  </div>
                  <h2 className="border-t border-black/10 pt-3 text-xl font-medium">
                    {article.title}
                  </h2>
                </motion.article>
              </Link>
            );
          })}
        </div>

        {news.length === 0 && (
          <p className="py-20 text-center text-gray-500">No articles yet.</p>
        )}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  try {
    return { props: { news: await fetchNews() }, revalidate: 600 };
  } catch (error) {
    console.error("News SSG alınamadı:", error);
    return { props: { news: [] }, revalidate: 600 };
  }
};
