import IntroBanner from '@/components/IntroBanner'
import FeaturedProjects from '@/components/FeaturedProjects';
import ServicesSlider from '@/components/ServicesSlider';
import AboutBanner from '@/components/AboutBanner';
import FromTheJournal from '@/components/FromTheJournal';
import { GetStaticProps } from 'next';
import { fetchProjectsSSR, fetchIntroBannersSSR, Project, IntroBanner as IntroBannerType } from '@/lib/api';

interface HomeProps {
  featuredProjects: Project[];
  introBanners: IntroBannerType[];
}

export default function Home({ featuredProjects, introBanners }: HomeProps) {
  return (
    <div>
      <IntroBanner initialBanners={introBanners} />
      <FeaturedProjects initialProjects={featuredProjects} />
      <ServicesSlider />
      <AboutBanner />
      <FromTheJournal />
    </div>
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
      .filter((project: Project) => project.featured)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
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