import React from "react";
import dynamic from "next/dynamic";
import { GetStaticProps } from 'next';
import { fetchAbout, AboutContent, fetchAwards, Award, fetchSlider, SliderItem, fetchWhatWeDo, WhatWeDoContent, fetchProjectsSSR, Project } from '@/lib/api';

const AnimatedAbout = dynamic(() => import("@/components/AnimatedAbout"), {
});

interface AboutPageProps {
  aboutContent: AboutContent;
  awards: Award[];
  sliderItems: SliderItem[];
  whatWeDoContent: WhatWeDoContent;
  projects: Project[];
}

export default function AboutPage({ aboutContent, awards, sliderItems, whatWeDoContent, projects }: AboutPageProps) {
  return <AnimatedAbout initialContent={aboutContent} awards={awards} sliderItems={sliderItems} whatWeDoContent={whatWeDoContent} initialProjects={projects} />;
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const [aboutContent, awards, sliderItems, whatWeDoContent, projects] = await Promise.all([
      fetchAbout(),
      fetchAwards(),
      fetchSlider(),
      fetchWhatWeDo(),
      fetchProjectsSSR()
    ]);
    
    console.log('About page getStaticProps:', { 
      aboutContent: aboutContent ? 'exists' : 'null',
      awards: awards ? awards.length : 0,
      sliderItems: sliderItems ? sliderItems.length : 0,
      whatWeDoContent: whatWeDoContent ? 'exists' : 'null',
      projects: projects ? projects.length : 0
    });
    
    return {
      props: {
        aboutContent,
        awards,
        sliderItems,
        whatWeDoContent,
        projects
      },
      revalidate: 60 // 1 dakikada bir yenile
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
        awards: [],
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

