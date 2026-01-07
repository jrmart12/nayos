"use client";

import { motion } from "framer-motion";

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
    const title = data?.title || "Nuestras Burgers";
    const subtitle = data?.subtitle || "Las mejores hamburguesas artesanales de La Ceiba";
    const primaryBtnText = data?.primaryButtonText || "¡Pide Ahora!";
    const primaryBtnLink = data?.primaryButtonLink || "/menu";

    const burgers = [
        { name: "Pork Belly", emoji: "🍔", delay: 0.2 },
        { name: "Bacon Cheese", emoji: "🍔", delay: 0.3 },
        { name: "Classic Chicken", emoji: "🍗", delay: 0.4 },
    ];

    return (
        <section className="relative min-h-screen bg-background overflow-hidden pt-32 pb-16">
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-4xl mx-auto mt-10">
                    {/* Main Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-foreground mb-4 leading-none"
                    >
                        {title}
                    </motion.h1>

                    {/* CTA Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mb-12"
                    >
                        <a
                            href={primaryBtnLink}
                            className="inline-block bg-primary text-white px-10 py-4 rounded-full font-bold text-lg uppercase tracking-wide hover:bg-accent transition-all transform hover:scale-105 shadow-xl"
                        >
                            {primaryBtnText}
                        </a>
                    </motion.div>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-lg md:text-xl text-muted mb-12"
                    >
                        {subtitle}
                    </motion.p>

                    {/* Featured Burgers */}
                    <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto">
                        {burgers.map((burger) => (
                            <motion.div
                                key={burger.name}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: burger.delay }}
                                className="flex flex-col items-center"
                            >
                                {/* Starburst Background */}
                                <div className="relative">
                                    <svg className="w-28 h-28 md:w-40 md:h-40" viewBox="0 0 100 100">
                                        <path
                                            d="M50 5 L54 25 L70 10 L62 28 L85 20 L68 38 L95 50 L68 62 L85 80 L62 72 L70 90 L54 75 L50 95 L46 75 L30 90 L38 72 L15 80 L32 62 L5 50 L32 38 L15 20 L38 28 L30 10 L46 25 Z"
                                            fill="#E31C25"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-amber-50 flex items-center justify-center text-3xl md:text-5xl shadow-inner">
                                            {burger.emoji}
                                        </div>
                                    </div>
                                </div>
                                <h3 className="mt-3 text-lg md:text-2xl font-black text-foreground text-center leading-tight">
                                    {burger.name.split(' ').map((word, i) => (
                                        <span key={i}>{word}<br /></span>
                                    ))}
                                </h3>
                            </motion.div>
                        ))}
                    </div>

                    {/* Hours Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="mt-16 inline-flex items-center bg-foreground text-white rounded-full px-8 py-4 gap-6 text-sm md:text-base"
                    >
                        <div className="text-center">
                            <div className="text-xs text-white/60 uppercase tracking-wide">Lunes a Sábado</div>
                            <div className="font-bold">11:00AM - 9:30PM</div>
                        </div>
                        <div className="w-px h-10 bg-white/20" />
                        <div className="text-center">
                            <div className="text-xs text-white/60 uppercase tracking-wide">Domingo</div>
                            <div className="font-bold">11:00AM - 8:00PM</div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
