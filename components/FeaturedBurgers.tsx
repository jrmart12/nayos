"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import CheckeredPattern from "./CheckeredPattern";
import { urlFor } from "@/lib/sanity";

interface Product {
    _id: string;
    name: string;
    description?: string;
    price: number;
    currency?: string;
    slug?: { current: string };
    image?: {
        asset: {
            _ref: string;
        }
    };
}

interface FeaturedBurgersProps {
    products?: Product[];
}

export default function FeaturedBurgers({ products = [] }: FeaturedBurgersProps) {
    // Si no hay productos de Sanity, usar productos de ejemplo
    const displayProducts = products.length > 0 ? products.slice(0, 3) : [
        {
            _id: '1',
            name: "NAYOS CHEESEBURGER",
            description: "CEBOLLAS A LA PLANCHA, DOBLE QUESO AMERICANO, PEPINILLOS Y SALSA NAYOS",
            price: 0,
            slug: { current: 'nayos-cheeseburger' }
        },
        {
            _id: '2',
            name: "CLASSIC BURGER",
            description: "QUESO AMERICANO, TOMATE, LECHUGA, CEBOLLA, KETCHUP Y MOSTAZA",
            price: 0,
            slug: { current: 'classic-burger' }
        },
        {
            _id: '3',
            name: "BACON BURGER",
            description: "TOCINO AHUMADO CRUJIENTE, QUESO AMERICANO Y SALSA NAYOS",
            price: 0,
            slug: { current: 'bacon-burger' }
        }
    ];

    const placeholderImages = [
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
        "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&q=80",
        "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80"
    ];

    return (
        <section className="py-20 bg-transparent relative overflow-hidden">
            {/* Bottom Right Checkered Pattern */}
            <div className="hidden md:block absolute bottom-0 right-0 w-64 md:w-96 opacity-80 z-0 rotate-180">
                <CheckeredPattern className="w-full h-auto" />
            </div>

            <div className="container mx-auto px-4 relative z-10 mt-8">
                {/* Header with Border */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-left mb-16 border-4 border-[#9B292C] rounded-2xl p-6 bg-white inline-block"
                >
                    <p className="text-sm md:text-base text-[#9B292C] font-bold mb-2 uppercase tracking-wider">
                        Hamburguesa Smashed • 100% Carne Fresca Black Angus
                    </p>
                </motion.div>

                {/* Burgers Grid with Images - Alternating Layout */}
                <div className="space-y-12 max-w-6xl mx-auto mb-16">
                    {displayProducts.map((product, index) => {
                        const imageUrl = product.image
                            ? urlFor(product.image).width(800).height(600).url()
                            : placeholderImages[index % placeholderImages.length];

                        const isEven = index % 2 === 0;

                        return (
                            <motion.div
                                key={product._id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <Link
                                    href={product.slug?.current ? `/menu/${product.slug.current}` : '/menu'}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-center group cursor-pointer"
                                >
                                    {/* Burger Image - Alternates between left and right */}
                                    <div className={`relative h-48 md:h-80 rounded-3xl overflow-hidden shadow-2xl border-4 border-[#9B292C] ${isEven ? 'order-1' : 'order-1 md:order-2'}`}>
                                        <Image
                                            src={imageUrl}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Burger Info - Alternates between right and left */}
                                    <div className={`border-b-4 border-[#9B292C] pb-4 md:pb-6 ${isEven ? 'order-2' : 'order-2 md:order-1'}`}>
                                        <h3 className="text-xl md:text-3xl lg:text-4xl font-black text-[#9B292C] mb-2 md:mb-3 uppercase tracking-tight group-hover:text-[#7A2123] transition-colors">
                                            {product.name}
                                        </h3>
                                        {product.description && (
                                            <p className="text-xs md:text-sm lg:text-base text-gray-700 font-bold uppercase tracking-wide">
                                                {product.description}
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                {/* CTA Button */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="text-center mt-12"
                >
                    <Link
                        href="/menu"
                        className="inline-block bg-[#9B292C] text-white px-12 py-5 rounded-lg font-black text-xl uppercase tracking-wider hover:bg-[#7A2123] transition-all transform hover:scale-105 shadow-2xl"
                    >
                        ¡Ordena en Línea Ahora!
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
