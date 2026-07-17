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

export default function BlogImageCarousel({ images, title, aspectRatio }: Props) {
  const ratio = aspectRatios[aspectRatio] || "1 / 1";

  if (images.length === 0) {
    return (
      <div
        className="flex w-full items-center justify-center bg-neutral-100 text-sm text-neutral-500"
        style={{ aspectRatio: ratio }}
      >
        Görsel eklenmemiş
      </div>
    );
  }

  if (images.length === 1) {
    const src = normalizeImageUrl(images[0].image_path);

    return (
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: ratio, height: "calc(100vh - 100px)" }}
      >
        <Image
          src={src}
          alt={title}
          fill
          className="object-cover"
          priority
          sizes="(min-width: 1024px) 70vw, 100vw"
          unoptimized={isSupabaseImage(src)}
        />
      </div>
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
        {images.map((image, index) => {
          const src = normalizeImageUrl(image.image_path);

          return (
            <div
              className="relative min-w-0 flex-[0_0_100%]"
              key={image.id}
              style={{ aspectRatio: aspectRatios[aspectRatio] || "1 / 1", height: "calc(100vh - 100px)" }}
            >
              <Image
                src={src}
                alt={`${title} — ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="(min-width: 1024px) 70vw, 100vw"
                unoptimized={isSupabaseImage(src)}
              />
            </div>
          );
        })}
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
