import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { GetStaticProps } from 'next';
import { fetchAbout, AboutContent, fetchSlider, SliderItem, fetchWhatWeDo, WhatWeDoContent, fetchProjectsSSR, Project } from '@/lib/api';
import SEO from '@/components/SEO';

const AnimatedAbout = dynamic(() => import("@/components/AnimatedAbout"), {
});

interface AboutPageProps {
  aboutContent: AboutContent;
  sliderItems: SliderItem[];
  whatWeDoContent: WhatWeDoContent;
  projects: Project[];
}

export default function AboutPage({ aboutContent, sliderItems, whatWeDoContent, projects }: AboutPageProps) {
  // Schema for about page
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About - OFY Portfolio",
    "description": aboutContent?.description || "A collective of visionaries shaping tomorrow, where creativity and innovation intersect.",
    "url": "https://ofy-portfolio.vercel.app/about",
    "mainEntity": {
      "@type": "Organization",
      "name": "OFY",
      "description": aboutContent?.description || "Creative design studio specializing in brand strategy and visual design",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Brand Strategy",
              "description": "Brand audit, research, positioning, and tone of voice development"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Digital Design",
              "description": "UI/UX design, web design, brand identity, and illustration"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Development",
              "description": "Frontend and backend development, e-commerce, and CMS integration"
            }
          }
        ]
      }
    }
  };

  return (
    <>
      <SEO 
        title="Faruk Yılmaz | About"
        description={aboutContent?.description || "A collective of visionaries shaping tomorrow, where creativity and innovation intersect. Our studio is built on the belief that bold ideas and meticulous execution drive meaningful design."}
        image={aboutContent?.image_path ? `https://lsxafginsylkeuyzuiau.supabase.co/storage/v1/object/public/uploads/${aboutContent.image_path}` : "https://ofy-portfolio.vercel.app/images/about-og.jpg"}
        schema={schema}
      />
      <AnimatedAbout initialContent={aboutContent} sliderItems={sliderItems} whatWeDoContent={whatWeDoContent} initialProjects={projects} />
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const [aboutContent, sliderItems, whatWeDoContent, projects] = await Promise.all([
      fetchAbout(),
      fetchSlider(),
      fetchWhatWeDo(),
      fetchProjectsSSR()
    ]);
    

    
    return {
      props: {
        aboutContent,
        sliderItems,
        whatWeDoContent,
        projects
      },
      revalidate: 300 // 5 dakikada bir yenile (daha uzun cache)
    };
  } catch (error) {
    console.error('About static props error:', error);
    return {
      props: {
        aboutContent: {
          id: '',
          title: "About Us",
          subtitle: "A collective of visionaries shaping tomorrow",
          description: "A collective of visionaries shaping tomorrow, where creativity and innovation intersect. Our studio is built on the belief that bold ideas and meticulous execution drive meaningful design.",
          image_path: "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        sliderItems: [],
        whatWeDoContent: {
          id: '',
          title: "What We Do",
          subtitle: "We create digital experiences that matter",
          service_1_title: "Brand Strategy",
          service_1_items: "Brand Audit\nResearch\nAudience\nCompetitive Analysis\nPositioning\nTone of Voice\nSocial Media",
          service_2_title: "Digital Design",
          service_2_items: "UI/UX Design\nWeb Design\nMobile Design\nBrand Identity\nPrint Design\nPackaging\nIllustration",
          service_3_title: "Development",
          service_3_items: "Frontend Development\nBackend Development\nE-commerce\nCMS Integration\nAPI Development\nPerformance Optimization\nMaintenance",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      },
      revalidate: 60
    };
  }
};

