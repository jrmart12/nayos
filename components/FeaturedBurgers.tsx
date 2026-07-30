"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
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
    const displayProducts = products.length > 0 ? products.slice(0, 4) : [
        {
            _id: '1',
            name: "BACON CHEESE BURGER",
            description: "Pechuga de pollo empanizada, salsa dinamita, nuestra teriyaki, aderezo nayos, zanahoria tempurizada.",
            price: 0,
            slug: { current: 'bacon-cheese-burger' }
        },
        {
            _id: '2',
            name: "CHICKEN TERIYAKI BURGER",
            description: "Pechuga de pollo empanizada, salsa dinamita, nuestra teriyaki, aderezo nayos, zanahoria tempurizada.",
            price: 0,
            slug: { current: 'chicken-teriyaki-burger' }
        },
        {
            _id: '3',
            name: "BACON CHEESE BURGER",
            description: "Pechuga de pollo empanizada, salsa dinamita, nuestra teriyaki, aderezo nayos, zanahoria tempurizada.",
            price: 0,
            slug: { current: 'bacon-cheese-burger-2' }
        },
        {
            _id: '4',
            name: "SINGLE SMASHED BURGER",
            description: "Pechuga de pollo empanizada, salsa dinamita, nuestra teriyaki, aderezo nayos, zanahoria tempurizada.",
            price: 0,
            slug: { current: 'single-smashed-burger' }
        }
    ];

    const placeholderImages = [
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
        "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&q=80",
        "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80",
        "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80"
    ];

    return (
        <section className="pt-10 pb-16 bg-transparent relative overflow-hidden">
            <div
                className="absolute inset-0 -z-10"
                style={{
                    backgroundColor: "#FFF8F0",
                    backgroundImage:
                        "linear-gradient(#FDF0E0 1px, transparent 1px), linear-gradient(90deg, #FDF0E0 1px, transparent 1px)",
                    backgroundSize: "35px 35px",
                }}
            />
            {/* Title Pill */}
            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8"
                >
                    <p className="text-base md:text-2xl text-[#9B292C] font-black uppercase tracking-wide">
                        Hamburguesa Smashed &nbsp;&nbsp;&nbsp; 100% Carne Fresca Black Angus
                    </p>
                </motion.div>
            </div>

            {/* Checkered strip */}
            <div className="relative left-1/2 right-1/2 my-10 w-screen -mx-[50vw] mb-20">
                <div className="checkered-strip w-full overflow-hidden" />
            </div>

            {/* 2x2 Burger Grid (mirrored text/image) */}
            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12 max-w-6xl mx-auto">
                    {displayProducts.map((product, index) => {
                        const imageUrl = product.image
                            ? urlFor(product.image).width(800).url()
                            : placeholderImages[index % placeholderImages.length];

                        // left column (even) => text | image ; right column (odd) => image | text
                        const textFirst = index % 2 === 0;

                        return (
                            <motion.div
                                key={product._id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: (index % 2) * 0.1 }}
                            >
                                <Link
                                    href={product.slug?.current ? `/menu/${product.slug.current}` : '/menu'}
                                    className="flex items-center gap-4 md:gap-6 group cursor-pointer"
                                >
                                    {/* Text */}
                                    <div className={`flex-1 ${textFirst ? 'order-1 text-right' : 'order-2 text-left'}`}>
                                        <h3 className="text-lg md:text-2xl font-black text-[#9B292C] uppercase leading-tight tracking-tight group-hover:text-[#7A2123] transition-colors">
                                            {product.name}
                                        </h3>
                                        <div className={`h-1 bg-[#9B292C] rounded-full my-2.5 w-full`} />
                                        {product.description && (
                                            <p className="text-xs md:text-sm text-gray-700 leading-snug">
                                                {product.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Image */}
                                    <div className={`relative w-40 h-40 md:w-56 md:h-56 flex-shrink-0 rounded-2xl overflow-hidden border-4 border-[#9B292C] shadow-xl ${textFirst ? 'order-2' : 'order-1'}`}>
                                        <Image
                                            src={imageUrl}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Eating mascot + CTA over checkered strip */}
            <div className="relative mt-20">
                <div className="absolute top-[50%] left-0 -translate-y-1/2 w-full flex items-center">
                    <div className="checkered-strip flex-1" />
                    {/* center gap so the mascot sits between the strips */}
                    <div className="w-44 md:w-60 shrink-0" />
                    <div className="checkered-strip flex-1" />
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10 flex flex-col items-center"
                >
                    <div className="relative">
                        <Image
                            src="/brand/mascot-eating-clean.png"
                            alt="Nayos comiendo una burger"
                            width={508}
                            height={658}
                            className="w-36 md:w-48 h-auto"
                        />
                        <Image
                            src="/brand/heart_transparent.png"
                            alt="Corazón"
                            width={508}
                            height={658}
                            className="absolute -top-2 -right-20 w-28 md:w-28 h-auto rotate-40"
                        />
                    </div>
                    <Link
                        href="/menu"
                        className="-mt-2 inline-block bg-[#9B292C] text-white px-10 py-4 rounded-full font-black text-base md:text-lg uppercase tracking-wider hover:bg-[#7A2123] transition-all transform hover:scale-105 shadow-2xl"
                    >
                        ¡Ordena Ahora!
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
