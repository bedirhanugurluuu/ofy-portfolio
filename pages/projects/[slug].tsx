import React from "react";
import Image from "next/image";
import AnimatedText from "@/components/AnimatedText";
import ButtonWithHoverArrow from "@/components/ButtonWithHoverArrow";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { fetchProjectBySlugSSR, fetchProjectsSSR, normalizeImageUrl, Project } from "@/lib/api";

interface ProjectDetailProps {
  project: Project | null;
  moreProjects: Project[];
}

export default function ProjectDetail({ project, moreProjects }: ProjectDetailProps) {
  if (!project) return <p>Project not found.</p>;

  return (
    <div className="w-full">
      {/* Banner or Video Section */}
      <section className="relative w-full h-screen">
        {project.image_path && (
          <Image
            src={normalizeImageUrl(project.image_path)}
            alt="Banner"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        )}

        {/* SEO h1 (gizli) */}
        <h1 className="sr-only">{project.title}</h1>

        {/* Subtitle (p) — Sol ortalı */}
        <AnimatedText
          as="div"
          className="absolute top-1/2 left-5 -translate-y-1/2 text-white text-2xl md:text-3xl font-semibold max-w-[320px]"
          delay={0.5}
        >
          {project.subtitle}
        </AnimatedText>

        {/* Metadata — En altta, yan yana */}
        <div className="absolute bottom-5 left-5 text-white text-sm flex flex-wrap gap-3 md:gap-8" style={{ letterSpacing: 0 }}>
          {project.role && (
            <AnimatedText as="div" className="font-semibold" delay={0.7}>
              ROLE <span className="pl-2 opacity-40">{project.role}</span>
            </AnimatedText>
          )}
        </div>
      </section>

      {project.description && (
        <section className="px-5 pt-10 md:pt-12 pb-20 md:pb-30 flex flex-col justify-between sm:flex-row gap-10">
          {/* Sol: Description */}
          <div className="sm:w-2/3 max-w-[450px]">
            <h2 className="opacity-40 text-sm mb-4 font-medium">Project Description</h2>
            <div className="text-sm font-medium" style={{ lineHeight: "16px" }}>
              {project.description
                .split(/\n{3,}/)
                .map((paragraph, idx) => (
                  <p key={idx}>
                    {paragraph.split("\n").map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </p>
                ))}
            </div>
          </div>


        </section>
      )}



      {/* More Projects Section */}
      {moreProjects.length > 0 && (
        <section className="px-5 pb-20 md:pb-30">
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-medium">More Projects</h2>
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {moreProjects.map((proj) => {
              const mediaUrl = proj.thumbnail_media ? normalizeImageUrl(proj.thumbnail_media) : '';
              const isVideo = mediaUrl.toLowerCase().endsWith('.mp4') || mediaUrl.toLowerCase().endsWith('.webm');

              return (
                <Link
                  key={proj.id}
                  href={`/projects/${proj.slug}`}
                  className="relative block overflow-hidden group"
                  style={{ aspectRatio: 0.8 / 1 }}
                >
                  {isVideo ? (
                    <video
                      src={mediaUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <Image
                      src={mediaUrl}
                      alt={proj.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      loading="lazy"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}

                  <div className="absolute bottom-4 left-4 text-white font-regular">
                    <h3 className="text-sm font-bold">{proj.title}</h3>
                    <p className="text-sm opacity-40 group-hover:opacity-100 transition-opacity">
                      {proj.subtitle}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const slug = context.params?.slug as string;

  try {
    const project = await fetchProjectBySlugSSR(slug);
    const allProjects = await fetchProjectsSSR();
    const moreProjects = allProjects.filter((p: Project) => p.slug !== slug).slice(0, 3);

    return {
      props: {
        project,
        moreProjects,
      },
    };
  } catch (error) {
    return { notFound: true };
  }
};

