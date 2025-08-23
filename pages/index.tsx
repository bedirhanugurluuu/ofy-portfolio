import IntroBanner from '@/components/IntroBanner'
import FeaturedProjects from '@/components/FeaturedProjects';
import ServicesSlider from '@/components/ServicesSlider';
import AboutBanner from '@/components/AboutBanner';
import FromTheJournal from '@/components/FromTheJournal';
import SEO from '@/components/SEO';
import { GetStaticProps } from 'next';
import { fetchProjectsSSR, fetchIntroBannersSSR, Project, IntroBanner as IntroBannerType } from '@/lib/api';

interface HomeProps {
  featuredProjects: Project[];
  introBanners: IntroBannerType[];
}

export default function Home({ featuredProjects, introBanners }: HomeProps) {
  // Schema for homepage
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "OFY - Creative Portfolio & Design Studio",
    "url": "https://ofy-portfolio.vercel.app",
    "description": "OFY is a creative design studio specializing in brand strategy, visual design, and digital experiences.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://ofy-portfolio.vercel.app/projects?search={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "OFY",
      "logo": {
        "@type": "ImageObject",
        "url": "https://ofy-portfolio.vercel.app/images/logo.png"
      }
    }
  };

  return (
    <>
      <SEO 
        title="OFY - Creative Portfolio & Design Studio"
        description="OFY is a creative design studio specializing in brand strategy, visual design, and digital experiences. We create compelling stories that leave lasting impressions."
        image="https://ofy-portfolio.vercel.app/images/og-image.jpg"
        schema={schema}
      />
      <div>
        <IntroBanner initialBanners={introBanners} />
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
    // Paralel olarak verileri çek
    const [allProjects, introBanners] = await Promise.all([
      fetchProjectsSSR(),
      fetchIntroBannersSSR()
    ]);

    // Featured projeleri filtrele (yeni Supabase schema'sına göre)
    const featuredProjects = allProjects
      .filter((project: Project) => project.is_featured)
      .sort((a, b) => (a.featured_order || 0) - (b.featured_order || 0))
      .slice(0, 4);

    return {
      props: {
        featuredProjects,
        introBanners
      },
      revalidate: 60 // 1 dakikada bir yenile
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