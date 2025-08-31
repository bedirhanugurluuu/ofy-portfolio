"use client";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import SplitType from 'split-type'
import gsap from 'gsap'
import { fetchServices, Service } from '@/lib/api';

export default function ServicesSlider() {
    const [services, setServices] = useState<Service[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [index, setIndex] = useState(0);
    const textRef = useRef<HTMLParagraphElement | null>(null);
    const titleLineRef = useRef<HTMLHeadingElement | null>(null);
    const isInView = useInView(titleLineRef, { once: true, margin: '-100px' });

    // Services'leri fetch et
    useEffect(() => {
        fetchServices()
            .then((data) => {
                if (data && data.length > 0) {
                    setServices(data);
                    setIndex(0); // İlk service'i göster
                }
            })
            .catch((error) => {
                console.error('Services yükleme hatası:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const formatNumber = (i: number) => (i < 9 ? `0${i + 1}` : `${i + 1}`);

    const number = formatNumber(index);

    const prevSlide = () => {
        if (!services) return;
        setIndex((prev) => (prev - 1 + services.length) % services.length);
    };

    const nextSlide = () => {
        if (!services) return;
        setIndex((prev) => (prev + 1) % services.length);
    };

    useEffect(() => {
        if (!textRef.current || !services || !services[index]) return;

        // Her değişimde içeriği sıfırla (SplitType yeniden çalışsın)
        textRef.current.innerHTML = services[index].description;

        const split = new SplitType(textRef.current, {
            types: 'lines',
        });

        gsap.from(split.lines, {
            y: 30,
            opacity: 0,
            stagger: 0.15,
            duration: 0.6,
            ease: 'power2.out',
            delay: 0.7,
        });

        // Clean-up: split'i yok et
        return () => {
            split.revert();
        };
    }, [index, services]);

    // Loading durumunda hiçbir şey gösterme
    if (loading || !services || services.length === 0) {
        return null;
    }

    return (
        <section className="my-20 px-4 md:px-5">
            {/* Başlık ve çizgi */}
            <div className="mb-5 md:mb-10">
                <h2
                    ref={titleLineRef}
                    className="text-3xl font-medium mb-5 md:mb-10"
                >
                    Approach
                </h2>
                <motion.div
                    initial={{ width: 0 }}
                    animate={isInView ? { width: "100%" } : { width: 0 }}
                    transition={{ duration: 1 }}
                    className="h-[1px] bg-[rgba(0,0,0,0.1)]"
                />
            </div>
            <div className="flex flex-col md:flex-row items-start gap-5 md:gap-10">
                {/* Sayılar */}
                <div className="flex md:[flex:0.4] text-[100px] md:text-[150px] font-regular md:w-[100px] relative h-[120px] overflow-hidden">
                    {[0, 1].map((pos) => (
                    <div key={pos} className="relative w-[60px] md:w-[85px] h-[120px] overflow-hidden" style={{ lineHeight: '110px' }}>
                        <AnimatePresence mode="wait" >
                            <motion.div
                                key={`${number[pos]}-${index}`}
                                initial={{ y: 150 }}
                                animate={{ y: 0, transition: { duration: pos === 0 ? 0.25 : 0.5 } }}
                                exit={{ y: -150, transition: { duration: pos === 0 ? 0.15 : 0.35 } }}
                                className="absolute left-0 top-0"
                                style={{ lineHeight: '110px' }}
                            >
                                <span className="text-black">
                                    {number[pos]}
                                </span>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                    ))}
                </div>

                {/* Metinler */}
                <div className=" md:[flex:0.6] w-full overflow-hidden">
                    <div className="overflow-hidden">
                        <h2
                            key={`title-${index}-${services[index]?.id}`}
                            className="text-2xl font-medium mb-3 animate-[slideUp_0.8s_ease-out_forwards]"
                        >
                            {services[index].title}
                        </h2>
                    </div>
                    <div className="w-full max-w-[600px] overflow-hidden">
                        <p 
                            key={`description-${index}-${services[index]?.id}`}
                            ref={textRef} 
                            className="text-xl md:text-2xl opacity-[0.5] md:h-[200px] font-medium leading-relaxed whitespace-pre-line" 
                            style={{ lineHeight: '1.2' }} 
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={prevSlide}
                            className="p-3 bg-gray-200 rounded-full hover:bg-gray-100 transition cursor-pointer"
                            aria-label="Previous Slide"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="black" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                        </button>
                        <button
                            onClick={nextSlide}
                            className="p-3 bg-gray-200 rounded-full hover:bg-gray-100 transition cursor-pointer"
                            aria-label="Next Slide"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="black" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
