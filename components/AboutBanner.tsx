import Link from "next/link";
import ButtonWithHoverArrow from "../components/ButtonWithHoverArrow";

export default function AboutBanner() {
  return (
    <section className="relative w-full overflow-hidden px-4 mb-20">
        <div className="relative">
            <img
                src="/images/about-banner.png"
                alt="About Banner"
                className="aspect-[0.6363636364/1] md:aspect-[2.32/1] relative"
                style={{ objectFit: "cover" }}
            />

            <div className="absolute inset-0 flex items-start">
                <div className="text-white max-w-4xl text-left p-4 md:p-8">
                    <p className="hidden md:block mb-6 text-4xl font-medium">
                        Where bold concepts meet timeless execution, creating designs that inspire and endure.
                    </p>
                    <p className="block md:hidden mb-6 text-3xl font-medium max-w-[260]">
                        Where bold ideas meet great design.
                    </p>
                    <Link
                        href="/about"
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm text-white group hover:bg-gray-200!important transition"
                        style={{ background: "rgba(255, 255, 255, 0.1)", backdropFilter: "blur(15px)", letterSpacing: "0", border: "1px solid rgba(255, 255, 255, 0.1)" }}
                    >
                        ABOUT US
                        <ButtonWithHoverArrow />
                    </Link>
                </div>
            </div>
        </div>
    </section>
  );
}
