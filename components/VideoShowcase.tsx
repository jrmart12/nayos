"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

const features = [
    { icon: "🧀", title: "Queso Premium", sub: "Derretido perfecto" },
    { icon: "✨", title: "Salsa Nayos", sub: "Receta secreta" },
    { icon: "🔥", title: "Smashed Perfecto", sub: "Corteza crujiente" },
    { icon: "🥩", title: "100% Carne Fresca", sub: "Carne ANGUS" },
];

export default function VideoShowcase() {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <section className="bg-transparent text-gray-900 relative overflow-hidden">
            {/* Scrolling Marquee */}
            <div className="bg-[#9B292C] text-white py-3 md:py-4 overflow-hidden relative">
                <div className="flex animate-marquee whitespace-nowrap">
                    <span className="text-xl md:text-3xl font-black uppercase mr-8">
                        SMASH&apos;D BURGERS LA CEIBA • SMASH&apos;D TO PERFECTION • SMASH&apos;D BURGERS LA CEIBA • SMASH&apos;D TO PERFECTION •
                    </span>
                    <span className="text-xl md:text-3xl font-black uppercase mr-8">
                        SMASH&apos;D BURGERS LA CEIBA • SMASH&apos;D TO PERFECTION • SMASH&apos;D BURGERS LA CEIBA • SMASH&apos;D TO PERFECTION •
                    </span>
                </div>
            </div>

            <div className="container mx-auto px-4 relative z-10 py-14 md:py-20">
                {/* Three Column Layout: Heading + description | phone | features */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10 items-center max-w-7xl mx-auto">
                    {/* Left - Heading + description */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="order-2 lg:order-1"
                    >
                        <h2 className="text-3xl md:text-4xl font-black text-[#9B292C] uppercase leading-tight mb-4">
                            Así hacemos<br />nuestras burgers
                        </h2>
                        <div className="checkered-strip !h-4 max-w-[220px] mb-6" />
                        <div className="bg-white border-4 border-[#9B292C] rounded-2xl p-5">
                            <p className="text-sm md:text-base text-gray-900 leading-relaxed font-black uppercase">
                                Cada burger comienza con carne 100% fresca que <span className="text-[#9B292C]">smash-eamos</span> en
                                nuestra plancha caliente para crear esa corteza crujiente y dorada que todos amamos.
                            </p>
                        </div>
                    </motion.div>

                    {/* Center - Phone frame with media */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        onViewportEnter={() => setIsPlaying(true)}
                        transition={{ duration: 0.7, delay: 0.15 }}
                        className="order-1 lg:order-2 flex justify-center"
                    >
                        <div className="relative w-60 md:w-[280px] aspect-353/566">
                            {/* Screen */}
                            <div className="absolute left-[3.7%] right-[4%] top-[14%] bottom-[18%] ">
                                {isPlaying ? (
                                    <video className="w-full h-full object-cover" autoPlay loop muted playsInline>
                                        <source src="/burger-video.mp4" type="video/mp4" />
                                    </video>
                                ) : (
                                    <div className="absolute inset-0 bg-[#7A2123] animate-pulse" />
                                )}
                            </div>
                            {/* Phone frame overlay */}
                            <Image
                                src="/brand/phone-frame-outline.png"
                                alt=""
                                fill
                                className="object-contain pointer-events-none select-none z-20"
                            />
                        </div>
                    </motion.div>

                    {/* Right - Features list */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="order-3 space-y-4"
                    >
                        {features.map((f) => (
                            <div key={f.title} className="flex items-center gap-3 bg-white border-4 border-[#9B292C] rounded-xl p-3.5">
                                <div className="text-3xl">{f.icon}</div>
                                <div>
                                    <h4 className="text-sm font-black uppercase text-[#9B292C]">{f.title}</h4>
                                    <p className="text-xs text-gray-700 font-bold">{f.sub}</p>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Divider */}
                <div className="h-1 bg-[#9B292C] rounded-full max-w-6xl mx-auto my-14" />

                {/* "En nuestro lugar" block */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center max-w-6xl mx-auto"
                >
                    <div className="relative h-84 md:h-90 rounded-3xl overflow-hidden shadow-2xl">
                        <Image src="/burger-about.png" alt="Nuestra burger" fill className="object-cover" />
                    </div>
                    <div className="text-left">
                        <h3 className="text-2xl md:text-3xl font-black text-[#9B292C] mb-5 uppercase leading-tight">
                            En nuestro lugar, nos especializamos en un servicio al cliente increíble y rápido.
                        </h3>
                        <p className="text-sm md:text-base text-gray-700 leading-relaxed font-mono">
                            Estamos en una misión de servir nuestros productos rápidamente, y superar tus expectativas elevando una de las comidas callejeras que todos amamos, las hamburguesas. Creemos en un menú ágil que refleja la vibra de nuestro restaurante, aumenta la eficiencia y hace que ordenar en línea sea fácil. Todo esto para elevar tu experiencia como cliente. Esto – no es solo un concepto; es nuestro estilo de vida.
                        </p>
                    </div>
                </motion.div>
            </div>

            <style jsx>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 18s linear infinite;
                }
            `}</style>
        </section>
    );
}
