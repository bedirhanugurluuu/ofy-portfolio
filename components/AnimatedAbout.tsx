"use client";
import React, { useEffect, useRef, useState } from "react";
import AnimatedText from "@/components/AnimatedText";
import gsap from "gsap";
import { AboutContent, Project, AboutGalleryImage, Award, SliderItem, WhatWeDoContent, fetchProjects, fetchAboutGallery, normalizeImageUrl } from "@/lib/api";
import InsightsSection from "@/components/InsightsSection";
import ClientsIndustriesSection from "@/components/ClientsIndustriesSection";
import AboutGallery from "@/components/AboutGallery";
import AwardsSection from "@/components/AwardsSection";
import SliderSection from "@/components/SliderSection";
import WhatWeDoSection from "@/components/WhatWeDoSection";
import FromTheJournal from "@/components/FromTheJournal";

interface AnimatedAboutProps {
  initialContent?: AboutContent;
  awards?: Award[];
  sliderItems?: SliderItem[];
  whatWeDoContent?: WhatWeDoContent;
  initialProjects?: Project[];
}

export default function AnimatedAbout({ initialContent, awards = [], sliderItems = [], whatWeDoContent, initialProjects = [] }: AnimatedAboutProps) {
  const [content, setContent] = useState<AboutContent>(initialContent || {
    id: "1",
    title: "About Us",
    subtitle: "A collective of visionaries shaping tomorrow",
    content: "A collective of visionaries shaping tomorrow, where creativity and innovation intersect.",
    description: "A collective of visionaries shaping tomorrow, where creativity and innovation intersect.",
    main_text: "A collective of visionaries shaping tomorrow, where creativity and innovation intersect. Our studio is built on the belief that bold ideas and meticulous execution drive meaningful design.",
    vision_title: "Our Vision",
    vision_text: "We craft innovative design strategies for forward thinking brands, combining aesthetics with purpose to create impactful solutions.",
    image_path: "",
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
    industries_list: "Travel\nSports & Fitness\nMedia & Entertainment\nBeauty\nGaming\nFood & Beverage\nCyber\nEnergy\nBanking & Finance\nHealth & Wellness\nApparel & Lifestyle\nHome Goods\nEmerging Technology\nHospitality\nAutomotive",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [galleryImages, setGalleryImages] = useState<AboutGalleryImage[]>([]);

  const lineRef = useRef<HTMLDivElement>(null);
  const approachLineRef1 = useRef<HTMLDivElement>(null);
  const approachLineRef2 = useRef<HTMLDivElement>(null);
  const approachLineRef3 = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Smooth entrance animation
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current, 
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          ease: "power2.out",
          delay: 0.2
        }
      );
    }
  }, []);

  // Projects ve Gallery'yi fetch et (sadece initialProjects boşsa)
  useEffect(() => {
    if (initialProjects.length === 0) {
      Promise.all([
        fetchProjects(),
        fetchAboutGallery()
      ])
        .then(([projectsData, galleryData]) => {
          setProjects(projectsData);
          setGalleryImages(galleryData);
        })
        .catch(err => {
          console.error('Error fetching data:', err);
        });
    } else {
      // Sadece gallery'yi fetch et
      fetchAboutGallery()
        .then((galleryData) => {
          setGalleryImages(galleryData);
        })
        .catch(err => {
          console.error('Error fetching gallery data:', err);
        });
    }
  }, [initialProjects.length]);

  useEffect(() => {
    if (!lineRef.current) return;

    gsap.to(lineRef.current, {
      width: "100%",
      duration: 1,
      ease: "power2.out",
      delay: 1.5,
    });
  }, []);

  useEffect(() => {
    if (!approachLineRef1.current) return;

    gsap.to(approachLineRef1.current, {
      width: "100%",
      duration: 1,
      ease: "power2.out",
      delay: 2.5,
    });
  }, []);

  useEffect(() => {
    if (!approachLineRef2.current) return;

    gsap.to(approachLineRef2.current, {
      width: "100%",
      duration: 1,
      ease: "power2.out",
      delay: 3.5,
    });
  }, []);

  useEffect(() => {
    if (!approachLineRef3.current) return;

    gsap.to(approachLineRef3.current, {
      width: "100%",
      duration: 1,
      ease: "power2.out",
      delay: 4.5,
    });
  }, []);

  return (
    <div ref={containerRef} className="w-full bg-white">
      {/* İlk Bölüm - Mevcut */}
      <div className="flex flex-col lg:flex-row w-full min-h-screen px-5 pt-37 md:pt-50 pb-15 md:pb-28 gap-8">
        <div className="w-full lg:w-1/2 flex flex-col gap-12 relative">
          <div>
            <AnimatedText
              as="p"
              className="text-2xl md:text-3xl font-medium max-w-xl"
              delay={0}
            >
              {content.main_text}
            </AnimatedText>
          </div>
          <div className="sticky top-150">
            <div className="relative py-4">
              <div className="relative mb-2">
                <div
                  ref={lineRef}
                  className="h-[1px] bg-[rgba(0,0,0,0.1)] w-0"
                />
              </div>
              <div className="flex flex-col md:flex-row gap-3 md:gap-0 align-start justify-between h-full">
                <AnimatedText
                  as="span"
                  className="lg:w-1/2 text-sm font-medium uppercase"
                  delay={0.5}
                >
                  {content.vision_title}
                </AnimatedText>
                <div className="lg:w-1/2">
                  <AnimatedText
                    as="p"
                    className="opacity-60 text-sm"
                    delay={1}
                  >
                    {content.vision_text}
                  </AnimatedText>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sağ Kısım: Görsel */}
        <div className="w-full aspect-[.75/1] lg:w-1/2">
          <img
            src={normalizeImageUrl(content.image_path || '')}
            alt="About Visual"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

        {/* Approach Bölümü */}
       <div className="px-5 py-10">
         <div className="">
           <h2 className="text-sm font-medium mb-2 opacity-40">
             {content.approach_title}
           </h2>
           <p className="text-3xl font-medium mb-30 max-w-[600px]">
             {content.approach_subtitle}
           </p>

           {/* Approach İçerikleri */}
            <div className="space-y-16">
              {/* Line */}
              <div className="relative pt-4 mb-3">
                <div className="relative">
                  <div
                    ref={approachLineRef1}
                    className="h-[1px] bg-[rgba(0,0,0,0.1)] w-0"
                  />
                </div>
              </div>

              {/* Brand Strategy */}
              <div className="flex flex-col lg:flex-row gap-2 md:gap-8 mb-9">
                <div className="lg:w-1/2">
                  <h3 className="text-lg font-medium mb-0">
                    {content.brand_strategy_title}
                  </h3>
                </div>
                <div className="lg:w-1/2">
                  <p className="text-sm font-medium leading-relaxed max-w-[340px] opacity-50" style={{lineHeight: "16px"}}>
                    {content.brand_strategy_text}
                  </p>
                </div>
              </div>

              {/* Line */}
              <div className="relative pt-4 mb-3">
                <div className="relative">
                  <div
                    ref={approachLineRef2}
                    className="h-[1px] bg-[rgba(0,0,0,0.1)] w-0"
                  />
                </div>
              </div>

              {/* Visual Design */}
              <div className="flex flex-col lg:flex-row gap-2 md:gap-8 mb-9">
                <div className="lg:w-1/2">
                  <h3 className="text-lg font-medium mb-0">
                    {content.visual_design_title}
                  </h3>
                </div>
                <div className="lg:w-1/2">
                  <p className="text-sm font-medium leading-relaxed max-w-[340px] opacity-50" style={{lineHeight: "16px"}}>
                    {content.visual_design_text}
                  </p>
                </div>
              </div>

              {/* Line */}
              <div className="relative pt-4 mb-3">
                <div className="relative">
                  <div
                    ref={approachLineRef3}
                    className="h-[1px] bg-[rgba(0,0,0,0.1)] w-0"
                  />
                </div>
              </div>

              {/* Launch */}
              <div className="flex flex-col lg:flex-row gap-2 md:gap-8 mb-9">
                <div className="lg:w-1/2">
                  <h3 className="text-lg font-medium mb-0">
                    {content.launch_title}
                  </h3>
                </div>
                <div className="lg:w-1/2">
                  <p className="text-sm font-medium leading-relaxed max-w-[340px] opacity-50" style={{lineHeight: "16px"}}>
                    {content.launch_text}
                  </p>
                </div>
              </div>
            </div>
         </div>
       </div>

       {/* Insights Section */}
       {content.insight_1_title && (
         <InsightsSection
           title={content.insights_title || "Insights"}
           subtitle={content.insights_subtitle}
           insights={[
             {
               title: content.insight_1_title || "",
               text: content.insight_1_text || "",
               projectId: content.insight_1_project_id
             },
             {
               title: content.insight_2_title || "",
               text: content.insight_2_text || "",
               projectId: content.insight_2_project_id
             },
             {
               title: content.insight_3_title || "",
               text: content.insight_3_text || "",
               projectId: content.insight_3_project_id
             },
             {
               title: content.insight_4_title || "",
               text: content.insight_4_text || "",
               projectId: content.insight_4_project_id
             }
           ].filter(insight => insight.title && insight.text)}
           projects={projects}
         />
       )}

        {/* Clients & Industries Section */}
        {content.clients_title && (
          <ClientsIndustriesSection
            clientsTitle={content.clients_title}
            clientsList={content.clients_list || ""}
            industriesTitle={content.industries_title || ""}
            industriesList={content.industries_list || ""}
          />
        )}

        {/* About Gallery Section */}
        <AboutGallery images={galleryImages} />

        {/* Awards Section */}
        <AwardsSection awards={awards || []} />

        {/* Slider Section */}
        <SliderSection sliderItems={sliderItems} />

        {/* What We Do Section */}
        {whatWeDoContent && (
          <WhatWeDoSection content={whatWeDoContent} />
        )}

        {/* From The Journal Section */}
        <FromTheJournal />
    </div>
  );
}
