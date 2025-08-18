import React from "react";
import dynamic from "next/dynamic";
import { GetStaticProps } from 'next';
import { fetchAbout, AboutContent, fetchAwards, Award, fetchSlider, SliderItem, fetchWhatWeDo, WhatWeDoContent } from '@/lib/api';

const AnimatedAbout = dynamic(() => import("@/components/AnimatedAbout"), {
});

interface AboutPageProps {
  aboutContent: AboutContent;
  awards: Award[];
  sliderItems: SliderItem[];
  whatWeDoContent: WhatWeDoContent;
}

export default function AboutPage({ aboutContent, awards, sliderItems, whatWeDoContent }: AboutPageProps) {
  return <AnimatedAbout initialContent={aboutContent} awards={awards} sliderItems={sliderItems} whatWeDoContent={whatWeDoContent} />;
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const [aboutContent, awards, sliderItems, whatWeDoContent] = await Promise.all([
      fetchAbout(),
      fetchAwards(),
      fetchSlider(),
      fetchWhatWeDo()
    ]);
    
    console.log('About page getStaticProps:', { sliderItems });
    
    return {
      props: {
        aboutContent,
        awards,
        sliderItems,
        whatWeDoContent
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
          image_path: "/images/sample-about.png",
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

