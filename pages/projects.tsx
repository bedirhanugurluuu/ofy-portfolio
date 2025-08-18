import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { fetchProjects, normalizeImageUrl } from "@/lib/api";
import React from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { GetServerSideProps } from "next";

interface Project {
  id: number;
  title: string;
  subtitle: string;
  slug: string;
  client_name?: string;
  year?: number;
  role?: string;
  thumbnail_media?: string;
  banner_media?: string;
  description?: string;
  is_featured?: boolean;
  featured_order?: number;
  created_at: string;
  updated_at: string;
}

type Props = {
  projects: Project[];
};

export default function ProjectsPage({ projects }: Props) {
  const router = useRouter();
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [hoveredThumbnail, setHoveredThumbnail] = React.useState<string | null>(null);
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });

  const normalizeMedia = (path: string) => {
    if (!path) return { type: "unknown", url: "" };
    const fullUrl = normalizeImageUrl(path);
    if (fullUrl.toLowerCase().endsWith(".mp4")) return { type: "video", url: fullUrl };
    if (/\.(jpg|jpeg|png|gif|webp)$/i.test(fullUrl)) return { type: "image", url: fullUrl };
    return { type: "unknown", url: fullUrl };
  };

  const hoveredMedia = hoveredThumbnail ? normalizeMedia(hoveredThumbnail) : null;
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <div className="min-h-screen px-5 pt-35 md:pt-50 pb-10">
      {/* Header */}
      <div className="flex justify-between items-end mb-10">
        <h1 className="text-3xl md:text-4xl font-medium">
          All Projects ({projects.length})
        </h1>
        <button
            className="relative cursor-pointer overflow-hidden group uppercase text-sm md:text-md"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
        >
            {viewMode === "grid" ? "List View" : "Grid View"}
            <span
                className="
                absolute bottom-0 left-0 h-[1px] bg-black
                w-full scale-x-0
                group-hover:scale-x-100
                transition-transform duration-300 ease-in-out
                origin-left hover:origin-left
                group-hover:[transform-origin:left]
                group-[&:not(:hover)]:origin-right
                "
            />
        </button>
      </div>

      {/* Hover preview for List View */}
      <AnimatePresence>
        {hoveredMedia && viewMode === "list" && isDesktop && (
          <motion.div
            className="fixed pointer-events-none z-50 overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{
              top: mousePos.y + 20,
              left: mousePos.x + 20,
              position: "fixed",
              width: "168px",
              height: "210px",
              aspectRatio: 0.8 / 1,
            }}
          >
            {hoveredMedia.type === "video" ? (
              <video
                src={hoveredMedia.url}
                autoPlay
                muted
                loop
                preload="none"
                className="w-full h-full object-cover"
                playsInline
                style={{aspectRatio: 0.8 / 1,}}
              />
            ) : (
              <Image
                src={hoveredMedia.url}
                alt="Preview"
                width={200}
                height={120}
                className="object-cover"
                loading="lazy"
                style={{aspectRatio: 0.8 / 1,}}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* GRID VIEW */}
      {viewMode === "grid" && (
        <motion.div layout className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-5">
          {projects.map((project, i) => {
            const media = normalizeMedia(project.thumbnail_media);

            return (
              <Link key={project.id} href={`/projects/${project.slug}`} passHref >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative overflow-hidden block cursor-pointer"
                  style={{ aspectRatio: 0.8 / 1 }}
                >
                  {media.type === "video" ? (
                    <video
                      src={media.url}
                      autoPlay
                      muted
                      loop
                      className="w-full object-cover h-full"
                    />
                  ) : media.type === "image" ? (
                    <Image
                      src={media.url}
                      alt={project.title}
                      width={600}
                      height={400}
                      className="w-full object-cover h-full scale-105 group-hover:scale-100 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full bg-gray-200 flex items-center justify-center">
                      <span>Media yok</span>
                    </div>
                  )}

                    <div className="absolute bottom-4 left-4 text-white font-regular">
                        <h2 className="text-sm font-bold">{project.title}</h2>
                        <p className="text-sm opacity-40 group-hover:opacity-100 transition-opacity">
                            {project.subtitle}
                        </p>
                    </div>
                </motion.div>
              </Link>
            );
          })}
        </motion.div>
      )}

      {/* LIST VIEW */}
      {viewMode === "list" && (
        <div className="w-full">
            {/* Header */}
            <div className="grid grid-cols-[1fr_1fr_auto] md:grid-cols-[1fr_1fr_1fr_auto] pb-2 font-medium text-sm uppercase">
                <div>Project</div>
                <div>Client</div>
                <div className="hidden md:block">Role</div>
                <div className="text-right w-[36px]">Year</div>
            </div>

            {/* Rows */}
            {projects.map((project, i) => (
                <motion.div
                    key={project.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    onMouseEnter={(e) => {
                        setHoveredThumbnail(project.thumbnail_media);
                        setMousePos({ x: e.clientX, y: e.clientY });
                    }}
                    onMouseMove={(e) => {
                        setMousePos({ x: e.clientX, y: e.clientY });
                    }}
                    onMouseLeave={() => setHoveredThumbnail(null)}
                    onClick={() => router.push(`/projects/${project.slug}`)}
                    className="grid grid-cols-[1fr_1fr_auto] md:grid-cols-[1fr_1fr_1fr_auto] pb-[6px] cursor-pointer group font-medium"
                >
                    <div className="opacity-100 md:opacity-50 group-hover:opacity-100 transition">{project.title}</div>
                    <div className="opacity-100 md:opacity-50 group-hover:opacity-100 transition">{project.client_name}</div>
                    <div className="opacity-100 md:opacity-50 group-hover:opacity-100 transition hidden md:block">{project.role}</div>
                    <div className="opacity-100 md:opacity-50 group-hover:opacity-100 transition text-right w-[36px]">{project.year}</div>
                </motion.div>
            ))}
            </div>

      )}
    </div>
  );
}

// SSR ile veri çekmek için:
export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const projects = await fetchProjects();

    return {
      props: {
        projects,
      },
    };
  } catch (error) {
    console.error("Projeler SSR alınamadı:", error);
    return {
      props: {
        projects: [],
      },
    };
  }
};
