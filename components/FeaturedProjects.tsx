"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchProjects } from '@/lib/api';

interface Project {
  id: number;
  title: string;
  subtitle: string;
  slug: string;
  thumbnail_media?: string | null;
  video_url?: string | null;
  featured_order?: number;
}

interface FeaturedProjectsProps {
  initialProjects?: Project[];
}

const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const normalizeImagePath = (path: string) => {
  if (!path) return "";
  return backendUrl + "/" + path.replace(/\\/g, "/").replace(/^\/+/, "");
};

const FeaturedProjects = ({ initialProjects = [] }: FeaturedProjectsProps) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  // Eğer initialProjects boşsa, client-side'da fetch et
  useEffect(() => {
    if (initialProjects.length === 0) {
      const fetchFeaturedProjects = async () => {
        try {
          const data = await fetchProjects();
          setProjects(data);
        } catch (err) {
          console.error("Veri alınamadı", err);
          setProjects([]);
        }
      };
      fetchFeaturedProjects();
    }
  }, [initialProjects.length]);

  if (projects.length === 0) return null;

  return (
    <section className="my-20 px-4 md:px-5">
      <div className="flex items-end justify-between mb-5">
        <h2 className="text-2xl md:text-3xl font-medium">Featured Projects</h2>
        <Link
          href="/projects"
          className="group relative inline-block overflow-hidden text-sm font-medium"
        >
          <span className="hidden md:block transition-transform duration-300 group-hover:-translate-y-full">
            VIEW ALL PROJECTS
          </span>
          <span className="block md:hidden transition-transform duration-300 group-hover:-translate-y-full">
            VIEW ALL
          </span>
          <span className="absolute left-0 top-full hidden md:block transition-transform duration-300 group-hover:-translate-y-full">
            VIEW ALL PROJECTS
          </span>
          <span className="absolute left-0 top-full block md:hidden transition-transform duration-300 group-hover:-translate-y-full">
            VIEW ALL
          </span>
        </Link>
      </div>

      <div className="flex flex-col gap-5">
        {/* First Row */}
        <div className="flex flex-col md:flex-row gap-5">
          {projects.slice(0, 2).map((project, index) => {
            const isVideoFile = (filePath: string | undefined) => {
              if (!filePath) return false;
              return filePath.toLowerCase().endsWith(".mp4");
            };
            const mediaPath = normalizeImagePath(project.thumbnail_media || "");

            return (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className={`${
                  index === 0 ? "flex-[0.6]" : "flex-[0.4]"
                } bg-gray-100 overflow-hidden group relative`}
                style={{ aspectRatio: index === 0 ? "3/2" : "1" }}
              >
                {isVideoFile(mediaPath) ? (
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-500"
                  >
                    <source src={mediaPath} type="video/mp4" />
                  </video>
                ) : (
                  <Image
                    src={mediaPath}
                    alt={project.title}
                    width={800}
                    height={500}
                    className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-500"
                  />
                )}
                <div className="absolute bottom-4 left-4 text-white font-regular">
                  <h3 className="text-sm font-bold">{project.title}</h3>
                  <p className="text-sm opacity-40 group-hover:opacity-100 transition-opacity">
                    {project.subtitle}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Second Row */}
        <div className="flex flex-col md:flex-row gap-5">
          {projects.slice(2, 4).map((project, index) => {
            const isVideoFile = (filePath: string | undefined) => {
              if (!filePath) return false;
              return filePath.toLowerCase().endsWith(".mp4");
            };
            const mediaPath = normalizeImagePath(project.thumbnail_media || "");

            return (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className={`${
                  index === 0 ? "flex-[0.4]" : "flex-[0.6]"
                } bg-gray-100 overflow-hidden group relative`}
                style={{ aspectRatio: index === 0 ? "1" : "3/2" }}
              >
                {isVideoFile(mediaPath) ? (
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-500"
                  >
                    <source src={mediaPath} type="video/mp4" />
                  </video>
                ) : (
                  <Image
                    src={mediaPath}
                    alt={project.title}
                    width={800}
                    height={600}
                    className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-500"
                  />
                )}
                <div className="absolute bottom-4 left-4 text-white font-regular">
                  <h3 className="text-sm font-bold">{project.title}</h3>
                  <p className="text-sm opacity-40 group-hover:opacity-100 transition-opacity">
                    {project.subtitle}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
