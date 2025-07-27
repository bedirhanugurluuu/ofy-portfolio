"use client";
import Image from "next/image";
import Link from "next/link";

export default function FromTheJournal() {
  const cards = [
    {
      href: "/articles/sustainable-design",
      title: "DESIGN",
      subtitle: "The Art of Minimalism: Creating Impactful Designs with Less",
      image: "/images/journal1.jpg",
      aspect: "aspect-square",
    },
    {
      href: "/articles/urban-inspiration",
      title: "ART DIRECTION",
      subtitle: "Art Direction from scratch: Creating a unique art direction for a brand",
      image: "/images/journal2.jpg",
      aspect: "aspect-[3/2]",
    },
    {
      href: "/articles/material-matters",
      title: "DESIGN",
      subtitle: "We launched a new project redefining sustainable branding",
      image: "/images/journal3.jpg",
      aspect: "aspect-square",
    },
  ];

  return (
    <section className="px-4 py-12">
      {/* Header */}
        <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-medium">From the Journal</h2>
            <Link href="" className="group relative inline-block overflow-hidden text-sm font-medium">
                <span className="hidden md:block transition-transform duration-300 group-hover:-translate-y-full" style={{ letterSpacing: 0, }}>
                    READ ALL ARTICLES
                </span>
                <span className="hidden md:block absolute left-0 top-full transition-transform duration-300 group-hover:-translate-y-full" style={{ letterSpacing: 0, }}>
                    READ ALL ARTICLES
                </span>
                <span className="block md:hidden transition-transform duration-300 group-hover:-translate-y-full" style={{ letterSpacing: 0, }}>
                    READ ALL
                </span>
                <span className="block md:hidden absolute left-0 top-full transition-transform duration-300 group-hover:-translate-y-full" style={{ letterSpacing: 0, }}>
                    READ ALL
                </span>
            </Link>
        </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <Link
            href={card.href}
            key={index}
            className="group block"
          >
            <div className={`relative ${card.aspect} w-full overflow-hidden rounded-lg`}>
              <Image
                src={card.image}
                alt={card.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="mt-4 px-1">
              {/* Line */}
              <div className="relative h-[1px] bg-gray-300 mb-3">
                <div className="absolute left-0 top-0 h-full bg-black w-0 group-hover:w-full transition-all ease-in duration-500" />
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-sm font-medium opacity-50" style={{ letterSpacing: 0 }}>{card.title}</h3>
              <p className="text-xl font-medium">{card.subtitle}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
