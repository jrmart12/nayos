"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface HeroData {
    _id: string;
    title?: string;
    subtitle?: string;
    primaryButtonText?: string;
    primaryButtonLink?: string;
}

interface HeroProps {
    data?: HeroData;
}

export default function Hero({ data }: HeroProps) {
    const title = data?.title || "Smash'd Burgers";
    const subtitle = data?.subtitle || "Las mejores Smash'd Burgers de La Ceiba";
    const primaryBtnText = data?.primaryButtonText || "ORDENA AHORA";
    const primaryBtnLink = data?.primaryButtonLink || "/menu";

    return (
        <section className="relative bg-transparent overflow-hidden pb-6">
            <div
                className="absolute inset-0 -z-10"
                style={{
                    backgroundColor: "#FFF8F0",
                    backgroundImage:
                        "linear-gradient(#FDF0E0 1px, transparent 1px), linear-gradient(90deg, #FDF0E0 1px, transparent 1px)",
                    backgroundSize: "35px 35px",
                }}
            />
            <div className="container relative z-10">
                <div className="max-w-7xl ">
                    {/* Horizontal Banner */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative w-screen overflow-hidden h-[600px]"
                    >
                        {/* Background image */}
                        <Image
                            src="/burger-headers.png"
                            alt="Deliciosa hamburguesa Nayos"
                            fill
                            className="object-cover object-center"
                            priority
                        />

                        {/* Best in La Ceiba badge */}
                        <div className="absolute top-3 left-3 md:top-36 md:left-28 z-20 w-24 md:w-80">
                            <Image
                                src="/brand/best.svg"
                                alt="Best in La Ceiba"
                                width={636}
                                height={478}
                                className="w-full h-auto drop-shadow-lg"
                            />
                        </div>

                        {/* Floating content card (top-right) */}
                        <div className="absolute top-32 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:top-26 md:right-26 z-20">
                            <div className="bg-[#FFF8F0]/95 backdrop-blur-sm rounded-2xl shadow-2xl px-5 py-10 md:px-7 md:py-6 w-[80vw] max-w-[460px]  md:w-[340px] text-center">

                                <div className="relative w-44 h-8 mb-2 mx-auto md:w-44 md:h-14 md:mb-4">
                                    <Image
                                        src="/smashed.svg"
                                        alt="Loading..."
                                        fill
                                        className="object-contain"
                                    />
                                </div>

                                <h1
                                    className="text-3xl md:text-5xl font-black text-[#9B292C] leading-none uppercase mb-2"
                                    style={{ fontFamily: 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif' }}
                                >
                                    {title}
                                </h1>
                                <p className="text-[11px] md:text-sm text-gray-800 mb-3 font-bold leading-tight">
                                    {subtitle}
                                </p>
                                <a
                                    href={primaryBtnLink}
                                    className="inline-block bg-[#9B292C] text-white px-5 py-2 md:px-6 md:py-2.5 rounded-lg font-black text-[11px] md:text-sm uppercase tracking-wider hover:bg-[#7A2123] transition-all transform hover:scale-105 shadow-xl"
                                >
                                    {primaryBtnText}
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
