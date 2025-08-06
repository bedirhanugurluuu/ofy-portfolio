"use client";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import AnimatedText from '@/components/AnimatedText';  // doğru path'e göre güncelle

interface Project {
  id: number;
  title: string;
  subtitle: string;
  slug: string;
  video_url?: string | null;
  banner_image?: string | null;
  description: string;
  gallery_images: string[];
  client_name?: string;
  year?: number;
  role?: string;
}

export default function ProjectDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    fetch(`http://localhost:5000/api/projects/${slug}`)
      .then(res => res.json())
      .then(data => {
        const gallery_images = (data.gallery_images || []).map((img: string) =>
          `http://localhost:5000/${img.replace(/\\/g, '/')}`
        );

        const banner_image = data.banner_image
          ? `http://localhost:5000/${data.banner_image.replace(/\\/g, '/')}`
          : null;

        setProject({ ...data, gallery_images, banner_image });
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <AnimatedText as="p">Loading...</AnimatedText>;
  if (!project) return <AnimatedText as="p">Project not found.</AnimatedText>;

  return (
    <div className="w-full">

      {/* Banner or Video Section */}
      <section className="relative w-full h-screen">
        {project.video_url ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={project.video_url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : project.banner_image ? (
          <Image
            src={project.banner_image}
            alt="Banner"
            layout="fill"
            objectFit="cover"
            priority
          />
        ) : null}

        {/* SEO h1 (gizli) */}
        <h1 className="sr-only">{project.title}</h1>

        {/* Subtitle (p) — Sol ortalı */}
        <AnimatedText
          as="div"
          className="absolute top-1/2 left-5 -translate-y-1/2 text-white text-3xl font-semibold max-w-[320px]"
          delay={0.5}
        >
          {project.subtitle}
        </AnimatedText>

        {/* Metadata — En altta, yan yana */}
        <div className="absolute bottom-5 left-5 text-white text-sm flex flex-wrap gap-8" style={{ letterSpacing: 0, }}>
          {project.client_name && (
            <AnimatedText as="div" className="font-semibold" delay={0.7}>
              CLIENT <span className="pl-2 opacity-40">{project.client_name}</span>
            </AnimatedText>
          )}
          {project.year && (
            <AnimatedText as="div" className="font-semibold" delay={0.9}>
              YEAR <span className="pl-2 opacity-40">{project.year}</span>
            </AnimatedText>
          )}
          {project.role && (
            <AnimatedText as="div" className="font-semibold" delay={1.1}>
              ROLE <span className="pl-2 opacity-40">{project.role}</span>
            </AnimatedText>
          )}
        </div>
      </section>

      {/* Açıklama */}
      {project.description && (
        <section className="mx-auto px-5 pt-12 pb-30">
          <h2 className='opacity-40'>Project Description</h2>
          <p>{project.description}</p>
        </section>
      )}

      {/* Galeri */}
      {project.gallery_images.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {project.gallery_images.map((img, index) => (
            <Image
              key={index}
              src={img}
              alt={`Project image ${index + 1}`}
              width={600}
              height={400}
              className="w-full object-cover rounded-lg"
            />
          ))}
        </section>
      )}
    </div>
  );
}
