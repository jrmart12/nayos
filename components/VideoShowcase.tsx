"use client";

import { motion } from "framer-motion";
import CheckeredPattern from "./CheckeredPattern";

import { useState } from "react";

export default function VideoShowcase() {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <section className="py-20 bg-transparent text-gray-900 relative overflow-hidden">


            <div className="container mx-auto px-4 relative z-10 mt-12">
                {/* Centered Title */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <div className="bg-white border-4 border-[#9B292C] rounded-2xl p-6 inline-block">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#9B292C] uppercase tracking-tight leading-tight">
                            Así Hacemos Nuestras Burgers
                        </h2>
                        <p className="text-base md:text-lg text-gray-700 mt-4 font-bold uppercase">
                            El arte del smash perfecto
                        </p>
                    </div>
                </motion.div>

                {/* Three Column Layout: Description Left, Video Center, Features Right */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start max-w-7xl mx-auto">

                    {/* Left - Description */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="order-2 lg:order-1"
                    >
                        <div className="bg-white border-4 border-[#9B292C] rounded-2xl p-6">
                            <p className="text-base md:text-lg text-gray-900 leading-relaxed font-black uppercase">
                                Cada burger comienza con carne 100% fresca que <span className="text-[#9B292C]">smash-eamos</span> en
                                nuestra plancha caliente para crear esa corteza crujiente y dorada que todos amamos.
                            </p>
                        </div>

                        {/* Features Icons */}
                        <div className="mt-6 space-y-4">
                            <div className="flex items-center gap-3 bg-white border-4 border-[#9B292C] rounded-xl p-4">
                                <div className="text-4xl">🥩</div>
                                <div>
                                    <h4 className="text-sm font-black uppercase text-[#9B292C]">100% Carne Fresca</h4>
                                    <p className="text-xs text-gray-700 font-bold">Carne ANGUS</p>
                                </div>
                            </div>

                        </div>
                    </motion.div>

                    {/* Center - Video */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        onViewportEnter={() => setIsPlaying(true)}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="order-1 lg:order-2"
                    >
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-[#9B292C] border-4 border-[#9B292C] min-h-[300px]">
                            {/* Video Element - Autoplay, Loop, Muted */}
                            {isPlaying ? (
                                <video
                                    className="w-full h-auto max-h-[500px] md:max-h-[600px] object-contain bg-[#9B292C]"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                >
                                    <source src="/burger-video.mp4" type="video/mp4" />
                                    Tu navegador no soporta el elemento de video.
                                </video>
                            ) : (
                                <div className="absolute inset-0 bg-[#9B292C] animate-pulse" />
                            )}
                        </div>
                    </motion.div>

                    {/* Right - Features */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="order-3"
                    >
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 bg-white border-4 border-[#9B292C] rounded-xl p-4">
                                <div className="text-4xl">🧀</div>
                                <div>
                                    <h4 className="text-sm font-black uppercase text-[#9B292C]">Queso Premium</h4>
                                    <p className="text-xs text-gray-700 font-bold">Derretido perfecto</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-white border-4 border-[#9B292C] rounded-xl p-4">
                                <div className="text-4xl">✨</div>
                                <div>
                                    <h4 className="text-sm font-black uppercase text-[#9B292C]">Salsa Nayos</h4>
                                    <p className="text-xs text-gray-700 font-bold">Receta secreta</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-white border-4 border-[#9B292C] rounded-xl p-4">
                                <div className="text-4xl">🔥</div>
                                <div>
                                    <h4 className="text-sm font-black uppercase text-[#9B292C]">Smashed Perfecto</h4>
                                    <p className="text-xs text-gray-700 font-bold">Corteza crujiente</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

        </section>
    );
}
