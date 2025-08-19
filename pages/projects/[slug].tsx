import React from "react";
import Image from "next/image";
import AnimatedText from "@/components/AnimatedText";
import ButtonWithHoverArrow from "@/components/ButtonWithHoverArrow";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { fetchProjectBySlugSSR, fetchProjectsSSR, fetchProjectGallery, normalizeImageUrl, Project } from "@/lib/api";

interface ProjectDetailProps {
  project: Project | null;
  moreProjects: Project[];
  galleryImages: string[];
}

export default function ProjectDetail({ project, moreProjects, galleryImages }: ProjectDetailProps) {
  if (!project) return <p>Project not found.</p>;

  return (
    <div className="w-full">
      {/* Banner or Video Section */}
      <section className="relative w-full h-screen">
        {project.banner_media && (
          <Image
            src={normalizeImageUrl(project.banner_media)}
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
          {project.client_name && (
            <AnimatedText as="div" className="font-semibold" delay={0.5}>
              CLIENT <span className="pl-2 opacity-40">{project.client_name}</span>
            </AnimatedText>
          )}
          {project.year && (
            <AnimatedText as="div" className="font-semibold" delay={0.6}>
              YEAR <span className="pl-2 opacity-40">{project.year}</span>
            </AnimatedText>
          )}
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
          
          {/* Sağ: External Link */}
          {project.external_link && (
            <div className="sm:w-1/3 flex justify-end">
              <a
                href={project.external_link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-2 border border-black/20 bg-black/5 backdrop-blur-md px-5 py-2 text-sm hover:bg-black/10 transition-colors"
              >
                View Live Site
                <ButtonWithHoverArrow />
              </a>
            </div>
          )}
        </section>
      )}

      {/* Gallery Images Section */}
      {galleryImages && galleryImages.length > 0 && (
        <section className="px-5 pb-20">
          <div className="flex flex-col gap-5">
            {(() => {
              const rows = [];
              for (let i = 0; i < galleryImages.length; i += 3) {
                // İlk resim (tek başına)
                if (i < galleryImages.length) {
                  const image = galleryImages[i];
                  const isVideo = image.toLowerCase().endsWith('.mp4') || image.toLowerCase().endsWith('.webm');
                  
                  rows.push(
                    <div key={i} className="w-full relative aspect-[16/9]">
                      {isVideo ? (
                        <video
                          src={normalizeImageUrl(image)}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full object-cover"
                        />
                        ) : (
                          <Image
                            src={normalizeImageUrl(image)}
                            alt={`Gallery image ${i + 1}`}
                            fill
                            className="object-cover"
                            sizes="100vw"
                          />
                        )}
                    </div>
                  );
                }
                
                // Sonraki 2 resim (yan yana)
                if (i + 1 < galleryImages.length) {
                  const secondImage = galleryImages[i + 1];
                  const thirdImage = galleryImages[i + 2];
                  const isSecondVideo = secondImage.toLowerCase().endsWith('.mp4') || secondImage.toLowerCase().endsWith('.webm');
                  const isThirdVideo = thirdImage && (thirdImage.toLowerCase().endsWith('.mp4') || thirdImage.toLowerCase().endsWith('.webm'));
                  
                  rows.push(
                    <div key={`${i}-pair`} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative aspect-[3/4]">
                        {isSecondVideo ? (
                          <video
                            src={normalizeImageUrl(secondImage)}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full object-cover h-full"
                          />
                        ) : (
                          <Image
                            src={normalizeImageUrl(secondImage)}
                            alt={`Gallery image ${i + 2}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        )}
                      </div>
                      {thirdImage && (
                        <div className="relative aspect-[3/4]">
                          {isThirdVideo ? (
                            <video
                              src={normalizeImageUrl(thirdImage)}
                              autoPlay
                              loop
                              muted
                              playsInline
                              className="w-full object-cover h-full"
                            />
                          ) : (
                            <Image
                              src={normalizeImageUrl(thirdImage)}
                              alt={`Gallery image ${i + 3}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  );
                }
              }
              return rows;
            })()}
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
    
    // Mevcut projeyi hariç tut, featured projeleri al ve 3 tane göster
    const moreProjects = allProjects
      .filter((p: Project) => p.slug !== slug && p.is_featured)
      .sort((a, b) => (a.featured_order || 0) - (b.featured_order || 0))
      .slice(0, 3);
    
    // Gallery images'ı fetch et
    const galleryImages = project ? await fetchProjectGallery(project.id) : [];

    return {
      props: {
        project,
        moreProjects,
        galleryImages,
      },
    };
  } catch (error) {
    return { notFound: true };
  }
};

