import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { fetchNewsBySlug, fetchNews, normalizeImageUrl } from "@/lib/api";
import { GetStaticProps, GetStaticPaths } from "next";
import { useRouter } from "next/router";
import AnimatedText from "@/components/AnimatedText";
import { useEffect, useRef } from "react";
import gsap from "gsap";

interface News {
  id: number;
  title: string;
  category_text: string;
  photographer: string;
  subtitle: string;
  slug: string;
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
  article: News;
  relatedArticles: News[];
};

export default function BlogDetailPage({ article, relatedArticles }: Props) {
  const router = useRouter();
  const lineRef1 = useRef<HTMLDivElement>(null);
  const lineRef2 = useRef<HTMLDivElement>(null);
  const lineRef3 = useRef<HTMLDivElement>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (lineRef3.current) {
        gsap.to(lineRef3.current, {
          width: "100%",
          duration: 1,
          ease: "power2.out",
          delay: 0,
        });
      }

      if (lineRef1.current) {
        gsap.to(lineRef1.current, {
          width: "100%",
          duration: 1,
          ease: "power2.out",
          delay: 0.5,
        });
      }

      if (lineRef2.current) {
        gsap.to(lineRef2.current, {
          width: "100%",
          duration: 1,
          ease: "power2.out",
          delay: 1.5,
        });
      }
    });

    return () => ctx.revert();
  }, []);

  if (router.isFallback) {
    return (
      <div className="min-h-screen px-5 pt-35 md:pt-50 pb-10">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-12 bg-gray-200 rounded w-2/3 mb-8"></div>
          <div className="aspect-video w-full bg-gray-200 rounded-lg mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="px-5 pt-35 md:pt-37 pb-10">

        <div className="relative h-[1px] mb-2">
        <div
          ref={lineRef3}
          className="absolute left-0 top-0 h-full bg-black w-0"
          style={{ background: 'rgba(0, 0, 0, 0.1)'}}
        />
      </div>
      {/* Article Header */}
      <div className="mb-8">
        <div className="flex pb-50 pt-5 gap-5">
          <div className="lg:w-1/2">
            <AnimatedText
              as="h1"
              className="text-3xl md:text-4xl font-medium max-w-[500px]"
              delay={0}
            >
              {article.subtitle}
            </AnimatedText>
          </div>
          <div className="lg:w-1/2">
            <AnimatedText
              as="span"
              className="flex text-2xl font-medium opacity-50 max-w-[600px]"
              delay={0.5}
            >
              {article.title}
            </AnimatedText>
          </div>
        </div>

          <div className="flex items-center pt-5 gap-5">
           <div className="lg:w-1/2 ">
             <button
               onClick={() => {
                 navigator.clipboard.writeText(window.location.href);
                 const button = document.activeElement as HTMLButtonElement;
                 const originalText = button.innerHTML;
                 button.innerHTML = 'Copied!';
                 button.classList.add('bg-green-500');
                 setTimeout(() => {
                   button.innerHTML = originalText;
                   button.classList.remove('bg-green-500');
                 }, 2000);
               }}
               className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-sm transition-colors duration-200 text-sm font-medium"
             >
               SHARE
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
               </svg>
             </button>
           </div>
          <div className="lg:w-1/2">
            <div className="relative h-[1px] mb-2">
              <div
                ref={lineRef1}
                className="absolute left-0 top-0 h-full bg-black w-0"
                style={{ background: 'rgba(0, 0, 0, 0.1)'}}
              />
            </div>
              <div className="text-sm mb-2 flex justify-between gap-2">
                <AnimatedText
                as="div"
                className=""
                delay={1}
                preserveDisplay={true}
                >
                  <div className="flex-important justify-between gap-2" style={{ display: 'flex !important' }}>
                    <span className="opacity-50">PHOTOS</span> <span className="font-medium">{article.photographer}</span>
                  </div>
                </AnimatedText>
              </div>
              <div className="relative h-[1px] mb-2">
                <div
                  ref={lineRef2}
                  className="absolute left-0 top-0 h-full bg-black w-0"
                  style={{ background: 'rgba(0, 0, 0, 0.1)'}}
                />
              </div>
              <div className="text-sm mb-2 flex justify-between gap-2">
                <AnimatedText
                  as="div"
                  className=""
                  delay={1.5}
                  preserveDisplay={true}
                >
                  <div className="flex-important justify-between gap-2" style={{ display: 'flex !important' }}>
                    <span className="opacity-50">DATE</span> <span className="font-medium">{formatDate(article.published_at)}</span>
                  </div>
               </AnimatedText>
             </div>
          </div>
        </div>
             </div>
     </div>

     {/* Featured Image */}
     {article.image_path && (
       <AnimatedText
         as="div"
         className="mb-12"
         delay={2}
       >
         <div className={`relative ${article.aspect_ratio || 'aspect-video'} w-full overflow-hidden`} style={{ aspectRatio: '2/1', }}>
           <Image
             src={normalizeImageUrl(article.image_path)}
             alt={article.subtitle}
             fill
             className="object-cover"
             priority
           />
         </div>
       </AnimatedText>
     )}

     {/* Article Content */}
     <div className="min-h-screen px-5 pt-3 pb-15">
      {article.content && (
        <div className="flex justify-center pb-37">
          <div
            className="blog-content w-full md:w-1/2 text-left"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
      )}

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="pb-5">
          <div className="flex gap-4 items-end justify-between mb-10">
            <h2 className="text-3xl font-medium">
              Read More
            </h2>
            <Link
              href="/blog"
              className="group relative inline-block overflow-hidden text-sm font-medium"
            >
              <span className="hidden md:block transition-transform duration-300 group-hover:-translate-y-full">
                READ ALL ARTICLES
              </span>
              <span className="block md:hidden transition-transform duration-300 group-hover:-translate-y-full">
                READ ALL
              </span>
              <span className="absolute left-0 top-full hidden md:block transition-transform duration-300 group-hover:-translate-y-full">
                READ ALL ARTICLES
              </span>
              <span className="absolute left-0 top-full block md:hidden transition-transform duration-300 group-hover:-translate-y-full">
                READ ALL
              </span>
            </Link>
          </div>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-5">
            {relatedArticles.slice(0, 3).map((relatedArticle) => (
              <Link
                key={relatedArticle.id}
                href={`/blog/${relatedArticle.slug}`}
                className="group cursor-pointer"
              >
                <article className="group cursor-pointer">
                  {/* Image */}
                  <div className={`relative ${relatedArticle.aspect_ratio || 'aspect-square'} w-full overflow-hidden rounded-sm mb-4`}>
                    {relatedArticle.image_path ? (
                      <Image
                        src={normalizeImageUrl(relatedArticle.image_path)}
                        alt={relatedArticle.subtitle}
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
                    <h3 className="text-sm font-medium opacity-50" style={{ letterSpacing: 0 }}>{relatedArticle.category_text}</h3>
                    <p className="text-xl font-medium">{relatedArticle.subtitle}</p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      )}
      </div>
    </>
  );
}

export const getStaticPaths = async () => {
  try {
    const allNews = await fetchNews();
    const paths = allNews.map((article) => ({
      params: { slug: article.slug },
    }));

    return {
      paths,
      fallback: 'blocking', // Yeni slug'lar için blocking
    };
  } catch (error) {
    console.error("Static paths error:", error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
};

export const getStaticProps = async ({ params }: { params: { slug: string } }) => {
  try {
    const slug = params.slug;
    const article = await fetchNewsBySlug(slug);

    if (!article) {
      return {
        notFound: true,
      };
    }

    // Get related articles (excluding current article)
    const allNews = await fetchNews();
    const relatedArticles = allNews
      .filter(n => n.id !== article.id)
      .slice(0, 3);

    return {
      props: {
        article,
        relatedArticles,
      },
      revalidate: 60, // 1 dakikada bir yenile
    };
  } catch (error) {
    console.error("Blog detay static props error:", error);
    return {
      notFound: true,
    };
  }
};
