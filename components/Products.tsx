"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface Product {
    _id: string;
    name: string;
    slug?: { current: string };
    description: string;
    price: number;
    image?: {
        asset: {
            _ref: string;
        };
    };
    category: string;
    isBestSeller?: boolean;
    isFeatured?: boolean;
}

interface ProductsProps {
    title?: string;
    description?: string;
    products: Product[];
}

export default function Products({ title, description, products }: ProductsProps) {
    const [page, setPage] = useState(0);
    const sectionRef = useRef<HTMLElement>(null);
    const pageSize = 4;
    const totalPages = Math.ceil(products.length / pageSize);

    const paginatedProducts = products.slice(page * pageSize, (page + 1) * pageSize);

    const scrollToTop = () => {
        if (sectionRef.current) {
            const yOffset = -100;
            const y = sectionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    return (
        <section ref={sectionRef} id="menu" className="py-20 bg-background relative z-10">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-black text-foreground uppercase tracking-tighter mb-4">
                        {title || 'Nuestro'} <span className="text-primary">{title ? '' : 'Menú'}</span>
                    </h2>
                    <p className="text-muted max-w-2xl mx-auto">
                        {description || 'Ingredientes frescos, sabor inigualable, hamburguesas.'}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {paginatedProducts.map((product, index) => (
                        <motion.div
                            key={product._id || index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            <Link
                                href={product.slug ? `/menu/${product.slug.current}` : '#'}
                                className="block group"
                            >
                                <div className="bg-white rounded-2xl border border-border overflow-hidden hover:border-primary hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                                    {/* Product Image */}
                                    <div className="relative aspect-square overflow-hidden">
                                        {product.isBestSeller && (
                                            <div className="absolute top-3 left-3 z-10 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold uppercase">
                                                Más vendido
                                            </div>
                                        )}
                                        {product.image ? (
                                            <Image
                                                src={urlFor(product.image).width(500).height(500).url()}
                                                alt={product.name}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted bg-gray-100">
                                                <span className="text-4xl">🍔</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-5 flex-1 flex flex-col">
                                        <h3 className="text-lg font-bold text-foreground mb-2 uppercase tracking-wide line-clamp-2">
                                            {product.name}
                                        </h3>

                                        {product.description && (
                                            <p className="text-muted text-sm leading-relaxed mb-4 flex-1 line-clamp-2">
                                                {product.description}
                                            </p>
                                        )}

                                        <div className="flex items-center justify-between mt-auto">
                                            {product.price && (
                                                <p className="text-2xl font-black text-primary">
                                                    L{product.price.toFixed(0)}
                                                </p>
                                            )}
                                            <span className="text-primary text-sm font-semibold group-hover:underline">
                                                Ver más →
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="mt-12 flex items-center justify-center gap-2">
                        <button
                            aria-label="Anterior"
                            onClick={() => {
                                setPage((p) => Math.max(0, p - 1));
                                scrollToTop();
                            }}
                            disabled={page === 0}
                            className={`w-10 h-10 flex items-center justify-center rounded-full font-bold transition-all ${page === 0
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-primary text-white hover:bg-accent shadow-lg'
                                }`}
                        >
                            <ChevronLeft size={20} />
                        </button>

                        <div className="flex items-center gap-2">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    aria-label={`Página ${i + 1}`}
                                    onClick={() => {
                                        setPage(i);
                                        scrollToTop();
                                    }}
                                    className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-sm transition-all ${page === i
                                        ? 'bg-primary text-white shadow-lg scale-110'
                                        : 'bg-white text-foreground border border-border hover:border-primary'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            aria-label="Siguiente"
                            onClick={() => {
                                setPage((p) => Math.min(totalPages - 1, p + 1));
                                scrollToTop();
                            }}
                            disabled={page >= totalPages - 1}
                            className={`w-10 h-10 flex items-center justify-center rounded-full font-bold transition-all ${page >= totalPages - 1
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-primary text-white hover:bg-accent shadow-lg'
                                }`}
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
