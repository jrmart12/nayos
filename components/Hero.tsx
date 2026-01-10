"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import CheckeredPattern from "./CheckeredPattern";

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
        <section className="relative min-h-[80vh] bg-transparent overflow-hidden pb-12">

            {/* Scrolling Marquee Text */}
            <div className="bg-[#9B292C] text-white py-4 overflow-hidden relative z-10">
                <div className="flex animate-marquee">
                    <span className="text-2xl md:text-4xl font-black uppercase whitespace-nowrap">
                        SMASH'D BURGERS LA CEIBA • SMASH'D TO PERFECTION • SMASH'D BURGERS LA CEIBA • SMASH'D TO PERFECTION •
                    </span>
                    <span className="text-2xl md:text-4xl font-black uppercase whitespace-nowrap">
                        SMASH'D BURGERS LA CEIBA • SMASH'D TO PERFECTION • SMASH'D BURGERS LA CEIBA • SMASH'D TO PERFECTION •
                    </span>
                </div>
            </div>

            {/* Divider Lines */}
            <div className="h-1 bg-black"></div>
            <div className="h-1 bg-black mt-1"></div>

            <div className="container mx-auto px-4 relative z-10 py-8 md:py-12">
                <div className="max-w-7xl mx-auto">
                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-center">
                        {/* Left Side - Large Image */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            {/* Large Image */}
                            <div className="relative h-[300px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl border-4 border-[#9B292C]">
                                <Image
                                    src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&q=80"
                                    alt="Deliciosa hamburguesa Nayos"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                                {/* Badges */}
                                <div className="absolute top-4 right-4 flex gap-2 z-20">
                                    <div className="w-20 h-20 bg-[#9B292C] rounded-full border-4 border-white flex items-center justify-center shadow-xl">
                                        <div className="text-center">
                                            <div className="text-white text-[10px] font-black leading-tight">BEST</div>
                                            <div className="text-white text-[10px] font-black leading-tight">IN</div>
                                            <div className="text-white text-[10px] font-black leading-tight">LA CEIBA</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Side - Text Content */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-center lg:text-left"
                        >
                            {/* Logo */}
                            <div className="mb-4 md:mb-8 flex justify-center lg:justify-start">
                                <Image
                                    src="/smashed.svg"
                                    alt="Nayos Logo"
                                    width={180}
                                    height={180}
                                    className="w-62 h-62 md:w-74 md:h-24"
                                />
                            </div>

                            {/* Main Heading */}
                            <h1
                                className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-[#9B292C] mb-4 md:mb-6 leading-none uppercase"
                                style={{ fontFamily: 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif' }}
                            >
                                {title}
                            </h1>

                            {/* Subtitle */}
                            <p className="text-base md:text-xl lg:text-2xl text-gray-800 mb-4 md:mb-8 font-bold">
                                {subtitle}
                            </p>

                            {/* CTA Button */}
                            <a
                                href={primaryBtnLink}
                                className="inline-block bg-[#9B292C] text-white px-8 py-3 md:px-12 md:py-5 rounded-lg font-black text-base md:text-xl uppercase tracking-wider hover:bg-[#7A2123] transition-all transform hover:scale-105 shadow-2xl"
                            >
                                {primaryBtnText}
                            </a>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Bottom Right Checkered Pattern */}
            <div className="hidden md:block absolute bottom-0 right-0 w-64 md:w-96 opacity-80 z-0 rotate-180">
                <CheckeredPattern className="w-full h-auto" />
            </div>


            {/* CSS for Marquee Animation */}
            <style jsx>{`
                @keyframes marquee {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                .animate-marquee {
                    animation: marquee 10s linear infinite;
                }
            `}</style>
        </section>
    );
}
