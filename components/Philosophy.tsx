"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Philosophy() {
  return (
    <section
      id="about"
      className="py-16 md:py-20 bg-transparent relative overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative shadow-2xl w-full"
      >
        {/* Squiggle pattern background */}
        <div
          className="absolute inset-0 opacity-100"
          style={{
            backgroundImage: "url('/brand/pattern-squiggle-red.png')",
            backgroundSize: "850px",
            backgroundRepeat: "repeat",
          }}
        />

        {/* Best in La Ceiba badge */}
        <div className="hidden md:block absolute top-4 right-4 md:-top-10 md:right-78 z-220 w-44 md:w-50">
          <Image
            src="/brand/best.svg"
            alt="Best in La Ceiba"
            width={636}
            height={478}
            className="w-full h-auto drop-shadow-lg"
          />
        </div>

        <div className="container relative z-10">
          {/* Adjust md:translate-x-[Npx] below to nudge left(-)/right(+) */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-[220px_auto] gap-6 md:gap-0 items-end p-6 md:p-12 mx-auto max-w-5xl justify-center md:translate-x-10px">
            {/* Mascot */}
            <div className="hidden md:flex md:justify-end relative z-20 md:-mr-8">
              <Image
                src="/brand/mascot-standing.svg"
                alt="Nayos - El Rey del Smash"
                width={208}
                height={597}
                className="h-72 md:h-[460px] w-auto drop-shadow-xl"
              />
            </div>

            {/* Cream card */}
            <div className="bg-[#FFF8F0] rounded-3xl p-6 md:p-5 w-full relative z-10">
              <div className="relative w-44 h-14 mb-4 mx-auto">
                <Image
                  src="/smashed.svg"
                  alt="Loading..."
                  fill
                  className="object-contain"
                />
              </div>

              <h3 className="text-2xl md:text-3xl font-black text-[#9B292C] mb-5 uppercase text-center leading-tight">
                El Primer Smash&apos;d Burger de La Ceiba
              </h3>
              <p className="text-sm md:text-base text-gray-700 leading-relaxed font-mono mb-3 text-center">
                Se le conoce como el Rey del Smash, pero todos lo conocen como
                Nayos. Él es el cerebro detrás de nuestras hamburguesas smash
                signature, creando su propia receta que convierte cada
                ingrediente, cada componente y cada salsa en pura felicidad
                hamburguesera.
              </p>
              <p className="text-sm md:text-base text-gray-700 leading-relaxed font-mono mb-3 text-center">
                Nayos es el primer lugar de smash&apos;d burgers en La Ceiba.
                Somos una marca cool y relajada, entregando un producto que es
                simple pero de calidad absoluta.
              </p>
              <p className="text-sm md:text-base text-gray-700 leading-relaxed font-mono mb-4 text-center">
                Nuestras carnes son{" "}
                <span className="font-black text-[#9B292C]">
                  100% CARNE FRESCA BLACK ANGUS
                </span>{" "}
                y nuestras papas están cocinadas a la perfección, con una
                textura delgada y crujiente.
              </p>
              <p className="text-base md:text-lg font-black text-[#9B292C] uppercase text-center">
                ¡Después de conocernos, esperamos que nos veas como algo más que
                un gran producto!
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
