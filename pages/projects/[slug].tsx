import React from "react";
import Image from "next/image";
import AnimatedText from "@/components/AnimatedText";
import ButtonWithHoverArrow from "@/components/ButtonWithHoverArrow";
import Link from "next/link";
import { GetStaticProps, GetStaticPaths } from "next";
import { fetchProjectBySlugSSR, fetchProjectsSSR, fetchProjectGallery, normalizeImageUrl, Project, isSupabaseImage } from "@/lib/api";
import SEO from "@/components/SEO";

interface ProjectDetailProps {
  project: Project | null;
  moreProjects: Project[];
  galleryImages: string[];
}

export default function ProjectDetail({ project, moreProjects, galleryImages }: ProjectDetailProps) {
  if (!project) return <p>Project not found.</p>;

  // Schema for project detail page
  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.title,
    "description": project.subtitle,
    "image": project.banner_media ? normalizeImageUrl(project.banner_media) : null,
    "creator": {
      "@type": "Organization",
      "name": "OFY"
    },
    "dateCreated": project.created_at,
    "dateModified": project.updated_at,
    "url": `https://farukyilmaz.com/projects/${project.slug}`,
    "mainEntity": {
      "@type": "Project",
      "name": project.title,
      "description": project.description || project.subtitle,
      "client": project.client_name,
      "year": project.year,
      "role": project.role,
      "url": project.external_link
    }
  };

  return (
    <>
      <SEO 
        title={`Faruk Yılmaz | ${project.title}`}
        description={project.subtitle}
        image={project.banner_media ? normalizeImageUrl(project.banner_media) : "https://farukyilmaz.com/images/project-og.jpg"}
        schema={schema}
      />
      <div className="w-full">
      {/* Banner or Video Section */}
      <section className="relative w-full h-screen after:content-[''] after:absolute after:inset-x-0 after:bottom-0 after:h-40 after:bg-gradient-to-t after:from-black/20 after:to-transparent after:z-10">
        {/* Desktop Banner - always use banner_media */}
        {project.banner_media && (
          <Image
            src={normalizeImageUrl(project.banner_media)}
            alt="Banner"
            fill
            style={{ objectFit: "cover" }}
            priority
            className="hidden md:block"
            unoptimized={isSupabaseImage(normalizeImageUrl(project.banner_media))}
          />
        )}
        {/* Mobile Banner - use banner_media_mobile if exists, otherwise fallback to banner_media */}
        {(project.banner_media_mobile || project.banner_media) && (
          <Image
            src={normalizeImageUrl(project.banner_media_mobile || project.banner_media || "")}
            alt="Banner Mobile"
            fill
            style={{ objectFit: "cover" }}
            priority
            className="block md:hidden"
            unoptimized={isSupabaseImage(normalizeImageUrl(project.banner_media_mobile || project.banner_media || ""))}
          />
        )}

        {/* SEO h1 (gizli) */}
        <h1 className="sr-only">{project.title}</h1>

        {/* Subtitle (p) — Sol ortalı */}
        <AnimatedText
          as="div"
          className={`absolute top-1/2 left-5 -translate-y-1/2 text-2xl md:text-3xl font-semibold max-w-[600px] z-20 ${project.hide_subtitle ? "opacity-0" : ""}`}
          style={{
            color: project.subtitle_color || "#ffffff",
          } as React.CSSProperties}
          delay={0.5}
        >
          {project.subtitle}
        </AnimatedText>

        {/* Metadata — En altta, yan yana */}
        <div className="absolute bottom-5 left-5 text-white text-sm flex flex-wrap gap-3 md:gap-8 z-20" style={{ letterSpacing: 0 }}>
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
        <section className="px-5 pt-10 md:pt-12 pb-5 md:pb-15 flex flex-col justify-between sm:flex-row gap-10">
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
                className="group relative inline-flex items-start gap-2 text-sm font-medium uppercase"
              >
                View Live Site
                <ButtonWithHoverArrow />
              </a>
            </div>
          )}
        </section>
      )}

      {/* Projede İsmi Geçen Kişiler Section */}
      {project.project_credits && project.project_credits.length > 0 && (
        <section className="px-5 pb-20">
          <div className="flex flex-col gap-1">
            {project.project_credits.map((credit, index) => (
              <div key={index} className="text-sm font-medium">
                <span className="opacity-40 mr-1">{credit.role}:</span>{" "}
                <span>{credit.name}</span>
              </div>
            ))}
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
                          controls={false}
                          className="w-full object-cover"
                        />
                        ) : (
                          <Image
                            src={normalizeImageUrl(image)}
                            alt={`Gallery image ${i + 1}`}
                            fill
                            className="object-cover"
                            sizes="100vw"
                            unoptimized={isSupabaseImage(normalizeImageUrl(image))}
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
                            unoptimized={isSupabaseImage(normalizeImageUrl(secondImage))}
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
                              unoptimized={isSupabaseImage(normalizeImageUrl(thirdImage))}
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
                  className="relative block overflow-hidden group after:content-[''] after:absolute after:inset-x-0 after:bottom-0 after:h-32 after:bg-gradient-to-t after:from-black/20 after:to-transparent after:z-10"
                  style={{ aspectRatio: 0.8 / 1 }}
                >
                  {isVideo ? (
                    <video
                      src={mediaUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      controls={false}
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
                      unoptimized={isSupabaseImage(mediaUrl)}
                    />
                  )}

                  <div className="absolute bottom-4 left-4 text-white font-regular z-20">
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
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const projects = await fetchProjectsSSR();
    
    const paths = projects.map((project: Project) => ({
      params: { slug: project.slug },
    }));

    return {
      paths,
      fallback: 'blocking' // Yeni projeler için blocking fallback
    };
  } catch (error) {
    console.error('Error generating static paths:', error);
    return {
      paths: [],
      fallback: 'blocking'
    };
  }
};

export const getStaticProps: GetStaticProps = async (context) => {
  const slug = context.params?.slug as string;

  try {
    const [project, allProjects] = await Promise.all([
      fetchProjectBySlugSSR(slug),
      fetchProjectsSSR()
    ]);
    
    // Mevcut projeyi hariç tut, featured projeleri al ve 3 tane göster
    const moreProjects = allProjects
      .filter((p: Project) => p.slug !== slug && p.is_featured)
      .sort((a, b) => (a.featured_order || 0) - (b.featured_order || 0))
      .slice(0, 3);
    
    // Gallery images'ı parallel fetch et
    const galleryImages = project ? await fetchProjectGallery(project.id) : [];

    return {
      props: {
        project,
        moreProjects,
        galleryImages,
      },
      revalidate: 60 // 1 dakikada bir yenile
    };
  } catch (error) {
    return { notFound: true };
  }
};

