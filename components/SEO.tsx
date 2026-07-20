import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  DEFAULT_OG_IMAGE,
  SITE_BRAND,
  SITE_NAME,
  SITE_URL,
  TWITTER_HANDLE,
} from '@/lib/site-config';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  schema?: any;
  canonical?: string;
  robots?: string;
  noindex?: boolean;
}

export default function SEO({
  title = `${SITE_NAME} Design Studio`,
  description = `${SITE_NAME} is a creative design studio specializing in brand strategy, visual design, and digital experiences. We create compelling stories that leave lasting impressions.`,
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  publishedTime,
  modifiedTime,
  author = SITE_NAME,
  section,
  tags = [],
  schema,
  canonical,
  robots,
  noindex = false,
}: SEOProps) {
  const router = useRouter();
  const path = router.asPath.split('?')[0].split('#')[0];
  const url = canonical || `${SITE_URL}${path === '/' ? '' : path}`;
  const robotsContent =
    robots || (noindex ? 'noindex, nofollow' : 'index, follow');

  const defaultSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: DEFAULT_OG_IMAGE,
    description:
      'Creative design studio specializing in brand strategy and visual design',
    sameAs: [
      'https://www.linkedin.com/in/faruk-yilmaz',
      'https://www.behance.net/FarukYilmaz',
    ],
  };

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content={robotsContent} />
      <meta name="author" content={author} />
      <meta
        name="keywords"
        content="design studio, brand strategy, visual design, creative agency, portfolio"
      />

      <link rel="canonical" href={url} />

      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={SITE_BRAND} />
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:creator" content={TWITTER_HANDLE} />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {type === 'article' && (
        <>
          {publishedTime && (
            <meta property="article:published_time" content={publishedTime} />
          )}
          {modifiedTime && (
            <meta property="article:modified_time" content={modifiedTime} />
          )}
          {author && <meta property="article:author" content={author} />}
          {section && <meta property="article:section" content={section} />}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema || defaultSchema),
        }}
      />

      <link rel="preconnect" href="https://lsxafginsylkeuyzuiau.supabase.co" />
      <link rel="dns-prefetch" href="https://lsxafginsylkeuyzuiau.supabase.co" />
    </Head>
  );
}
