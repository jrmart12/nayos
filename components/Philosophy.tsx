"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import CheckeredPattern from "./CheckeredPattern";
import DottedLine from "./DottedLine";

export default function Philosophy() {
    return (
        <section id="about" className="py-20 bg-transparent relative overflow-hidden">
            {/* Top Left Checkered Pattern */}
            <div className="hidden md:block absolute top-0 left-0 w-64 md:w-96 opacity-80 z-0">
                <CheckeredPattern className="w-full h-auto" />
            </div>

            <div className="container mx-auto px-4 relative z-10 mt-12">
                {/* "THIS IS HOW WE DO IT" Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16 border-4 border-[#9B292C] rounded-3xl p-8 md:p-12 bg-[#FFF8F0] relative z-20"
                >
                    <h2 className="text-4xl md:text-6xl font-black text-[#9B292C] mb-12 uppercase tracking-tight">
                        Así lo hacemos.
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                        {/* Image */}
                        <div className="relative h-100 rounded-3xl overflow-hidden shadow-2xl">
                            <Image
                                src="/burger-about.png"
                                alt="Burger being made"
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Text */}
                        <div className="text-left">
                            <h3 className="text-2xl md:text-3xl font-black text-[#9B292C] mb-6 uppercase">
                                En nuestro lugar, nos especializamos en un servicio al cliente increíble y rápido.
                            </h3>
                            <p className="text-base md:text-lg text-gray-700 leading-relaxed font-mono">
                                Estamos en una misión de servir nuestros productos rápidamente y superar tus expectativas cada vez.
                                Creemos en un menú ágil que refleja la vibra de nuestro restaurante, aumenta la eficiencia y hace que ordenar en línea sea fácil.
                                Todo esto para elevar tu experiencia como cliente. Esto – no es solo un concepto;
                                es nuestro estilo de vida.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Dotted Line Separator */}
                <DottedLine className="my-16" />

                {/* "ENJOY LIFE JUST A LITTLE MORE" Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto"
                >
                    {/* Text */}
                    <div className="text-left order-2 md:order-1">
                        <h3 className="text-3xl md:text-4xl font-black text-[#9B292C] mb-6 uppercase">
                            Disfruta la vida un poco más.
                        </h3>
                        <p className="text-base md:text-lg text-gray-700 leading-relaxed font-mono">
                            Creemos que una pequeña pausa, un momento para abrazar, gratitud, reunirse con amigos,
                            y compartir una hamburguesa increíble puede ayudarte a disfrutar la vida un poco más.
                        </p>
                    </div>

                    {/* Image */}
                    <div className="relative h-90 rounded-3xl overflow-hidden shadow-2xl order-1 md:order-2">
                        <Image
                            src="/burger-about2.jpg"
                            alt="Enjoying a burger"
                            fill
                            className="object-cover"
                        />
                    </div>
                </motion.div>

                {/* Story Section with Checkered Background */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="max-w-4xl mx-auto text-center mt-20"
                >
                    <div className="bg-[#FFF8F0] rounded-3xl shadow-2xl p-8 md:p-12 border-4 border-[#9B292C] relative overflow-hidden z-20">

                        <div className="relative z-10">
                            <div className="mb-6">
                                <Image
                                    src="/smashed.svg"
                                    alt="Nayos Logo"
                                    width={180}
                                    height={180}
                                    className="mx-auto"
                                />
                            </div>
                            <h3 className="text-3xl md:text-4xl font-black text-[#9B292C] mb-6 uppercase">
                                El Primer Smash'd Burger de La Ceiba
                            </h3>
                            <p className="text-base md:text-lg text-gray-700 leading-relaxed font-mono mb-4">
                                Se le conoce como el Rey del Smash, pero todos lo conocen como Nayos. Él es el cerebro
                                detrás de nuestras hamburguesas smash signature, creando su propia receta que convierte cada ingrediente,
                                cada componente y cada salsa en pura felicidad hamburguesera.
                            </p>
                            <p className="text-base md:text-lg text-gray-700 leading-relaxed font-mono mb-4">
                                Nayos es el primer lugar de smash'd burgers en La Ceiba. Somos una marca cool y relajada,
                                entregando un producto que es simple pero de calidad absoluta.
                            </p>
                            <p className="text-base md:text-lg text-gray-700 leading-relaxed font-mono mb-4">
                                Nuestras carnes son <span className="font-black text-[#9B292C]">100% CARNE FRESCA BLACK ANGUS</span> y
                                nuestras papas están cocinadas a la perfección, con una textura delgada y crujiente.
                            </p>
                            <p className="text-lg md:text-xl font-black text-[#9B292C] mt-6 uppercase">
                                Después de conocernos, esperamos que nos veas como algo más que un gran producto!
                            </p>
                        </div>


                    </div>
                </motion.div>
            </div>
        </section>
    );
}
