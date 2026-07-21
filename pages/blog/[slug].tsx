import BlogImageCarousel from "@/components/BlogImageCarousel";
import SEO from "@/components/SEO";
import {
  fetchNews,
  fetchNewsBySlug,
  News,
  normalizeImageUrl,
} from "@/lib/api";
import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

type Props = {
  article: News;
  relatedArticles: News[];
};

const aspectRatios: Record<string, string> = {
  "aspect-square": "1 / 1",
  "aspect-[3/2]": "3 / 2",
  "aspect-video": "16 / 9",
};

export default function BlogDetailPage({ article, relatedArticles }: Props) {
  const router = useRouter();
  const coverImage = article.news_images[0]?.image_path;

  if (router.isFallback) {
    return (
      <div className="min-h-screen px-5 pb-10 pt-35 md:pt-50">
        <div className="grid animate-pulse gap-8 lg:grid-cols-[minmax(0,450px)_minmax(0,1fr)] min-[1920px]:grid-cols-[minmax(0,600px)_minmax(0,1fr)]">
          <div className="space-y-5">
            <div className="h-12 w-4/5 rounded bg-gray-200" />
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-5/6 rounded bg-gray-200" />
          </div>
          <div className="aspect-video rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.content.replace(/<[^>]*>/g, "").slice(0, 160),
    image: article.news_images.map((image) => normalizeImageUrl(image.image_path)),
    author: { "@type": "Organization", name: "OFY" },
    publisher: {
      "@type": "Organization",
      name: "OFY",
      logo: {
        "@type": "ImageObject",
        url: "https://farukyilmaz.com/images/logo.png",
      },
    },
    datePublished: article.created_at,
    dateModified: article.updated_at,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://farukyilmaz.com/blog/${article.slug}`,
    },
  };

  return (
    <>
      <SEO
        title={`Faruk Yılmaz | ${article.title}`}
        description={article.content.replace(/<[^>]*>/g, "").slice(0, 160)}
        image={
          coverImage
            ? normalizeImageUrl(coverImage)
            : "https://farukyilmaz.com/images/blog-og.jpg"
        }
        type="article"
        publishedTime={article.created_at}
        modifiedTime={article.updated_at}
        author="OFY Studio"
        schema={schema}
      />

      <main className="min-h-screen px-5 pb-24 pt-15 md:pt-20">
        <div>
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,450px)_minmax(0,1fr)] min-[1920px]:grid-cols-[minmax(0,600px)_minmax(0,1fr)] lg:gap-5">
            <article className="w-full lg:pr-8">
              <h1 className="mb-8 block text-3xl font-medium leading-tight md:text-xl">
                {article.title}
              </h1>
              <div
                className="blog-content w-full text-left"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </article>

            <aside className="lg:sticky lg:top-20">
              <BlogImageCarousel
                images={article.news_images}
                title={article.title}
                aspectRatio={article.aspect_ratio}
              />
            </aside>
          </div>
        </div>

        {relatedArticles.length > 0 && (
          <section className="mt-32 border-t border-black/10 pt-5">
            <div className="mb-10 flex items-end justify-between gap-4">
              <h2 className="text-3xl font-medium">Read More</h2>
              <Link href="/blog" className="text-sm font-medium">
                READ ALL ARTICLES
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.map((relatedArticle) => {
                const image = relatedArticle.news_images[0]?.image_path;

                return (
                  <Link
                    key={relatedArticle.id}
                    href={`/blog/${relatedArticle.slug}`}
                    className="group"
                  >
                    <div
                      className="relative mb-4 w-full overflow-hidden rounded-sm bg-neutral-100"
                      style={{
                        aspectRatio:
                          aspectRatios[relatedArticle.aspect_ratio] || "1 / 1",
                      }}
                    >
                      {image && (
                        <Image
                          src={normalizeImageUrl(image)}
                          alt={relatedArticle.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                          sizes="(min-width: 1024px) 33vw, 50vw"
                        />
                      )}
                    </div>
                    <div className="border-t border-black/10 pt-3">
                      <h3 className="text-xl font-medium">{relatedArticle.title}</h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const allNews = await fetchNews();
    return {
      paths: allNews.map((article) => ({ params: { slug: article.slug } })),
      fallback: "blocking",
    };
  } catch (error) {
    console.error("Static paths error:", error);
    return { paths: [], fallback: "blocking" };
  }
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  try {
    const slug = String(params?.slug || "");
    const article = await fetchNewsBySlug(slug);

    if (!article) return { notFound: true };

    const allNews = await fetchNews();
    return {
      props: {
        article,
        relatedArticles: allNews.filter((item) => item.id !== article.id).slice(0, 3),
      },
      revalidate: 300,
    };
  } catch (error) {
    console.error("Blog detay static props error:", error);
    return { notFound: true };
  }
};
