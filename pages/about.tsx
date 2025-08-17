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
          title: "About Us",
          subtitle: "A collective of visionaries shaping tomorrow",
          main_text: "A collective of visionaries shaping tomorrow, where creativity and innovation intersect. Our studio is built on the belief that bold ideas and meticulous execution drive meaningful design.",
          vision_title: "Our Vision",
          vision_text: "We craft innovative design strategies for forward thinking brands, combining aesthetics with purpose to create impactful solutions.",
          image_path: "/images/sample-about.png",
          approach_title: "approach",
          approach_subtitle: "The epitome of forward-thinking design, where bold concepts meet refined execution.",
          brand_strategy_title: "Brand Strategy",
          brand_strategy_text: "We craft strategic foundations that define your brand's identity, positioning, and messaging. Our approach ensures that every element aligns with your vision and resonates with your audience, creating a strong and lasting impact in your industry. Through research and insight-driven strategies, we help brands establish their voice, differentiate themselves from competitors, and create meaningful connections with their customers.",
          visual_design_title: "Visual Design",
          visual_design_text: "Our design process transforms ideas into striking visuals that capture your brand's essence. From logo creation to comprehensive brand systems, we blend creativity with strategy to deliver a cohesive and visually compelling identity. Every design decision is made with intention, ensuring that your brand not only looks exceptional but also tells a compelling story that engages and inspires.",
          launch_title: "Launch",
          launch_text: "We guide brands from concept to execution, ensuring a seamless transition from strategy to market. Whether it's a full-scale brand rollout or a product launch, we provide the tools and assets needed to establish a strong presence and drive engagement. Our expertise in digital and physical touchpoints ensures that your brand makes an impactful debut, creating momentum and lasting visibility in your industry.",
          insights_title: "Insights",
          insights_subtitle: "Discover our latest thinking and strategic approaches",
          insight_1_title: "Brand Evolution",
          insight_1_text: "How modern brands adapt and evolve in an ever-changing digital landscape.",
          insight_1_project_id: 1,
          insight_2_title: "Design Systems",
          insight_2_text: "Building scalable design systems that grow with your business.",
          insight_2_project_id: 2,
          insight_3_title: "User Experience",
          insight_3_text: "Creating meaningful connections through thoughtful user experience design.",
          insight_3_project_id: 3,
                     insight_4_title: "Digital Transformation",
           insight_4_text: "Navigating the digital transformation journey with strategic design thinking.",
           insight_4_project_id: 4,
           clients_title: "Clients",
           clients_list: "Nike\nElectronic Arts\nZapier\nBrownkind\nTonal\nMountain Hardwear\nAppfire\nTAE\n22 System\nArticle One Eyewear\nBetter World\nGucci\nSalt & Stone\nAudi\nLululemon\nPuma",
           industries_title: "Industries",
           industries_list: "Travel\nSports & Fitness\nMedia & Entertainment\nBeauty\nGaming\nFood & Beverage\nCyber\nEnergy\nBanking & Finance\nHealth & Wellness\nApparel & Lifestyle\nHome Goods\nEmerging Technology\nHospitality\nAutomotive"
        }
      },
      revalidate: 60
    };
  }
};

