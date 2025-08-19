import React from "react";
import Image from "next/image";
import AnimatedText from "@/components/AnimatedText";
import ButtonWithHoverArrow from "@/components/ButtonWithHoverArrow";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { fetchProjectBySlugSSR, fetchProjectsSSR, fetchProjectGallery, normalizeImageUrl, Project } from "@/lib/api";
import FeaturedProjects from "@/components/FeaturedProjects";

interface ProjectDetailProps {
  project: Project | null;
  galleryImages: string[];
}

export default function ProjectDetail({ project, galleryImages }: ProjectDetailProps) {
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

      {/* Featured Projects Section */}
      <FeaturedProjects />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const slug = context.params?.slug as string;

  try {
    const project = await fetchProjectBySlugSSR(slug);
    
    // Gallery images'ı fetch et
    const galleryImages = project ? await fetchProjectGallery(project.id) : [];

    return {
      props: {
        project,
        galleryImages,
      },
    };
  } catch (error) {
    return { notFound: true };
  }
};

