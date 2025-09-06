"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Project, normalizeImageUrl } from "@/lib/api";
import ButtonWithHoverArrow from "./ButtonWithHoverArrow";
import AlternativeVideoPlayer from "./AlternativeVideoPlayer";

interface InsightCard {
  title: string;
  text: string;
  projectId?: number;
}

interface InsightsSectionProps {
  title: string;
  subtitle?: string;
  insights: InsightCard[];
  projects: Project[];
}

export default function InsightsSection({ title, subtitle, insights, projects }: InsightsSectionProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);



  const getProjectById = (id?: number): Project | null => {
    if (!id) return null;

    return projects.find(project => project.id === id.toString()) || null;
  };

  if (!mounted) return null;

  return (
    <section className="w-full py-10 md:py-20">
      <div className="px-5">
        {/* Header */}
        <div className="mb-8 md:mb-16">
          <h2 className="text-4xl font-medium mb-4">{title}</h2>
          {subtitle && (
            <p className="text-lg text-gray-600 max-w-2xl">{subtitle}</p>
          )}
        </div>

        {/* Insights Grid */}
        <div className="grid items-start md:items-center md:grid-cols-2 gap-5">
          {insights.map((insight, index) => {
            const project = getProjectById(insight.projectId);
            return (
              <div key={index} className="flex flex-col justify-between bg-[#F8F8F8] p-5 h-[437px] md:h-auto aspect-auto md:aspect-[1.46154/1]">
                {/* Insight Content */}
                <div className="mb-6">
                  <h3 className="text-sm uppercase font-medium mb-2 opacity-40">{insight.title}</h3>
                  <p className="text-xl md:text-2xl font-medium max-w-[590px]" style={{ lineHeight: '27px' }}>{insight.text}</p>
                </div>

                {/* Related Case Study Card */}
                {project && (
                  <div className="flex justify-end gap-4 rounded-lg">
                    <Link
                        href={`/projects/${project.slug}`}
                        className="contents"
                    >
                        <div className="relative flex group max-w-[322px] h-[80px] md:h-[100px] flex-1 gap-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: '5px' }}>
                            {/* Project Thumbnail */}
                            <div className="absolute group top-2 right-2" style={{ rotate: '-45deg' }}>
                                <ButtonWithHoverArrow />
                            </div>
                            <div className="flex-shrink-0">
                                <div className="w-[70px] h-[70px] md:w-[90px] md:h-[90px] relative overflow-hidden" style={{ aspectRatio: '1 / 1' }}>
                                    {project.thumbnail_media ? (
                                    project.thumbnail_media.toLowerCase().endsWith('.mp4') || 
                                    project.thumbnail_media.toLowerCase().endsWith('.webm') ? (
                                        <AlternativeVideoPlayer
                                        src={normalizeImageUrl(project.thumbnail_media)}
                                        className="w-full h-full object-cover"
                                        muted
                                        loop
                                        playsInline
                                        />
                                    ) : (
                                        <Image
                                        src={normalizeImageUrl(project.thumbnail_media)}
                                        alt={project.title}
                                        fill
                                        className="object-cover"
                                        />
                                    )
                                    ) : (
                                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                        <span className="text-gray-500 text-xs">No image</span>
                                    </div>
                                    )}
                                </div>
                            </div>

                            {/* Project Info */}
                            <div className="min-w-0 flex flex-col justify-between">
                                <p className="text-xs uppercase tracking-wide mb-1 font-medium">
                                    Related Case Study
                                </p>
                                <div className="block group">
                                    <h4 className="text-xs font-medium">
                                        {project.title}
                                    </h4>
                                    {project.role && (
                                        <p className="text-xs opacity-40 font-medium">{project.role}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
