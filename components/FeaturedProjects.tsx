// components/FeaturedProjects.tsx
import Image from "next/image";
import Link from "next/link";

const FeaturedProjects = () => {
  return (
    <section className="my-20 px-4 md:px-5">
      <div className="flex items-end justify-between mb-5">
        <h2 className="text-2xl md:text-3xl font-medium">Featured Projects</h2>
        <Link href="/projects" className="group relative inline-block overflow-hidden text-sm font-medium">
            <span className="hidden md:block transition-transform duration-300 group-hover:-translate-y-full" style={{ letterSpacing: 0 }}>
                VIEW ALL PROJECTS
            </span>
            <span className="block md:hidden transition-transform duration-300 group-hover:-translate-y-full" style={{ letterSpacing: 0 }}>
                VIEW ALL
            </span>
            <span className="absolute left-0 top-full hidden md:block transition-transform duration-300 group-hover:-translate-y-full" style={{ letterSpacing: 0 }}>
                VIEW ALL PROJECTS
            </span>
            <span className="absolute left-0 top-full block md:hidden transition-transform duration-300 group-hover:-translate-y-full" style={{ letterSpacing: 0 }}>
                VIEW ALL
            </span>
        </Link>
        </div>
      <div className="flex flex-col gap-5">
        {/* First Row */}
        <div className="flex flex-col md:flex-row gap-5">
            <Link
                href="/project/1"
                className="flex-[0.6] bg-gray-100 overflow-hidden group relative"
                style={{ aspectRatio: '3/2' }}
            >
                <Image
                    src="/images/project1.jpg"
                    alt="Project 1"
                    width={800}
                    height={500}
                    className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-500"
                />
                <div className="absolute bottom-4 left-4 text-white font-regular">
                    <h3 className="text-sm font-bold transition-colors duration-300">
                        Jeep
                    </h3>
                    <p className="text-sm opacity-40 transition-opacity duration-300 group-hover:opacity-100">
                        Power, precision, and adventure redefined.
                    </p>
                </div>
            </Link>
            <Link
                href="/project/2"
                className="flex-[0.4] bg-gray-100 overflow-hidden group relative"
                style={{ aspectRatio: '1' }}
            >
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-500"
                >
                    <source src="/videos/project2.mp4" type="video/mp4" />
                </video>
                <div className="absolute bottom-4 left-4 text-white font-regular">
                    <h3 className="text-sm font-bold transition-colors duration-300">
                        All Natural
                    </h3>
                    <p className="text-sm opacity-40 transition-opacity duration-300 group-hover:opacity-100">
                        The next wave of pure natural skincare
                    </p>
                </div>
            </Link>
        </div>

        {/* Second Row */}
        <div className="flex flex-col md:flex-row gap-5">
            <Link
                href="/project/3"
                className="flex-[0.4] bg-gray-100 overflow-hidden group relative"
                style={{ aspectRatio: '1' }}
            >
                <Image
                src="/images/project3.jpg"
                alt="Project 3"
                width={800}
                height={500}
                className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-500"
                />
                <div className="absolute bottom-4 left-4 text-white font-regular">
                    <h3 className="text-sm font-bold transition-colors duration-300">
                        Golden Hour
                    </h3>
                    <p className="text-sm opacity-40 transition-opacity duration-300 group-hover:opacity-100">
                        A timeless toast to refined elegance.
                    </p>
                </div>
            </Link>
            <Link
                href="/project/4"
                className="flex-[0.6] bg-gray-100 overflow-hidden group relative"
                style={{ aspectRatio: '3/2' }}
            >
                <Image
                src="/images/project4.jpg"
                alt="Project 4"
                width={800}
                height={500}
                className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-500"
                />
                <div className="absolute bottom-4 left-4 text-white font-regular">
                    <h3 className="text-sm font-bold transition-colors duration-300">
                        Sennheiser
                    </h3>
                    <p className="text-sm opacity-40 transition-opacity duration-300 group-hover:opacity-100">
                        Immersive sound meets minimalist design.
                    </p>
                </div>
            </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
