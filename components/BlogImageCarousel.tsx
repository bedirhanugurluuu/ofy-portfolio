import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState } from "react";
import { isSupabaseImage, NewsImage, normalizeImageUrl } from "@/lib/api";

type Props = {
  images: NewsImage[];
  title: string;
  aspectRatio: string;
};

const aspectRatios: Record<string, string> = {
  "aspect-square": "1 / 1",
  "aspect-[3/2]": "3 / 2",
  "aspect-video": "16 / 9",
};

type ImageProps = {
  src: string;
  alt: string;
  aspectRatio: string;
  priority?: boolean;
};

function CarouselImage({ src, alt, aspectRatio, priority = false }: ImageProps) {
  const ratio = aspectRatios[aspectRatio] || "1 / 1";
  const unoptimized = isSupabaseImage(src);

  return (
    <>
      <Image
        src={src}
        alt={alt}
        width={0}
        height={0}
        sizes="100vw"
        priority={priority}
        className="block h-auto w-full lg:hidden"
        unoptimized={unoptimized}
      />
      <div
        className="relative hidden w-full overflow-hidden lg:block"
        style={{ aspectRatio: ratio, height: "calc(100vh - 100px)" }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          priority={priority}
          sizes="(min-width: 1024px) 70vw, 100vw"
          unoptimized={unoptimized}
        />
      </div>
    </>
  );
}

export default function BlogImageCarousel({ images, title, aspectRatio }: Props) {
  if (images.length === 0) {
    return (
      <div className="flex min-h-48 w-full items-center justify-center bg-neutral-100 text-sm text-neutral-500 lg:aspect-square">
        Görsel eklenmemiş
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <CarouselImage
        src={normalizeImageUrl(images[0].image_path)}
        alt={title}
        aspectRatio={aspectRatio}
        priority
      />
    );
  }

  return (
    <Carousel images={images} title={title} aspectRatio={aspectRatio} />
  );
}

function Carousel({ images, title, aspectRatio }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  useEffect(() => {
    if (!emblaApi) return;

    const updateSelectedIndex = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    updateSelectedIndex();
    emblaApi.on("select", updateSelectedIndex);

    return () => {
      emblaApi.off("select", updateSelectedIndex);
    };
  }, [emblaApi]);

  return (
    <div className="relative overflow-hidden" ref={emblaRef}>
      <div className="flex">
        {images.map((image, index) => (
          <div className="relative min-w-0 flex-[0_0_100%]" key={image.id}>
            <CarouselImage
              src={normalizeImageUrl(image.image_path)}
              alt={`${title} — ${index + 1}`}
              aspectRatio={aspectRatio}
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 right-4 flex gap-1.5 rounded-full bg-black/25 px-3 py-2 backdrop-blur-sm">
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            aria-label={`${index + 1}. görsele git`}
            aria-current={selectedIndex === index ? "true" : undefined}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`h-1.5 rounded-full transition-all ${
              selectedIndex === index ? "w-6 bg-white" : "w-1.5 bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
