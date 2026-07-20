import IntroBanner from '@/components/IntroBanner'
import FeaturedProjects from '@/components/FeaturedProjects';
import ServicesSlider from '@/components/ServicesSlider';
import AboutBanner from '@/components/AboutBanner';
import FromTheJournal from '@/components/FromTheJournal';
import SEO from '@/components/SEO';
import Head from 'next/head';
import { GetStaticProps } from 'next';
import {
  fetchProjectsSSR,
  fetchIntroBannersSSR,
  normalizeImageUrl,
  Project,
  IntroBanner as IntroBannerType,
} from '@/lib/api';

interface HomeProps {
  featuredProjects: Project[];
  introBanners: IntroBannerType[];
}

export default function Home({ featuredProjects, introBanners }: HomeProps) {
  const firstBanner = introBanners[0];
  const lcpDesktop = firstBanner?.image
    ? normalizeImageUrl(firstBanner.image)
    : '';
  const lcpMobile = firstBanner
    ? normalizeImageUrl(
        firstBanner.order_index === 3 && firstBanner.image_mobile
          ? firstBanner.image_mobile
          : firstBanner.image || ''
      )
    : '';

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "OFY - Creative Portfolio & Design Studio",
    "url": "https://farukyilmaz.com",
    "description": "OFY is a creative design studio specializing in brand strategy, visual design, and digital experiences.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://farukyilmaz.com/projects?search={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "OFY",
      "logo": {
        "@type": "ImageObject",
        "url": "https://farukyilmaz.com/images/og-image.jpg"
      }
    }
  };

  return (
    <>
      <Head>
        {/* LCP: discover banner images before JS/hydration */}
        {lcpMobile && (
          <link
            rel="preload"
            as="image"
            href={lcpMobile}
            fetchPriority="high"
            media="(max-width: 767px)"
          />
        )}
        {lcpDesktop && (
          <link
            rel="preload"
            as="image"
            href={lcpDesktop}
            fetchPriority="high"
            media="(min-width: 768px)"
          />
        )}
      </Head>
      <SEO 
        title="Faruk Yılmaz Design Studio"
        description="OFY is a creative design studio specializing in brand strategy, visual design, and digital experiences. We create compelling stories that leave lasting impressions."
        image="https://farukyilmaz.com/images/og-image.jpg"
        schema={schema}
      />
      <div>
        <IntroBanner
          initialBanners={introBanners}
          initialProjects={featuredProjects}
        />
        <FeaturedProjects initialProjects={featuredProjects} />
        <ServicesSlider />
        <AboutBanner />
        <FromTheJournal />
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const [allProjects, introBanners] = await Promise.all([
      fetchProjectsSSR(),
      fetchIntroBannersSSR()
    ]);

    const featuredProjects = allProjects
      .filter((project: Project) => project.is_featured)
      .sort((a, b) => (a.featured_order || 0) - (b.featured_order || 0))
      .slice(0, 4);

    return {
      props: {
        featuredProjects,
        introBanners
      },
      revalidate: 60
    };
  } catch (error) {
    console.error('Static props error:', error);
    return {
      props: {
        featuredProjects: [],
        introBanners: []
      },
      revalidate: 60
    };
  }
};
