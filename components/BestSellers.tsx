import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Product {
    _id: string
    name: string
    slug: { current: string }
    description?: string
    price?: number
    image?: SanityImageSource
    category?: string
    isFeatured?: boolean
    isBestSeller?: boolean
}

interface BestSellersProps {
    products: Product[]
}

// Translation function for categories - Restaurant focused
const translateCategory = (category: string): string => {
    const translations: Record<string, string> = {
        'beef': 'Res',
        'pork': 'Cerdo',
        'chicken': 'Pollo',
        'turkey': 'Pavo',
        'lamb': 'Cordero',
        'fish': 'Pescado',
        'seafood': 'Mariscos',
        'sausages': 'Embutidos',
        'special': 'Especiales',
        'appetizers': 'Entradas',
        'mains': 'Platos Fuertes',
        'desserts': 'Postres',
        'drinks': 'Bebidas',
        'other': 'Otros',
        'otros': 'Otros',
    }

    return translations[category?.toLowerCase()] || category || 'Otros'
}

export default function BestSellers({ products }: BestSellersProps) {
    const [page, setPage] = useState(0);
    const pageSize = 3;
    const totalPages = Math.ceil(products.length / pageSize);

    const paginatedProducts = products.slice(page * pageSize, (page + 1) * pageSize);

    const scrollToTop = () => {
        const element = document.getElementById('best-sellers');
        if (element) {
            const yOffset = -100;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    return (
        <section id="best-sellers" className="py-16 relative z-10">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-4 uppercase">
                        Los Más Vendidos
                    </h2>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                        Nuestros platillos más populares, elegidos por miles de clientes satisfechos.
                        El sabor que nos distingue.
                    </p>
                </div>

                {/* Best Sellers Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 auto-rows-fr">
                    {paginatedProducts.map((product, index) => (
                        <Link
                            key={product._id}
                            href={`/menu/${product.slug.current}`}
                            className="block group"
                        >
                            {/* Mobile: Horizontal layout, Desktop: Vertical layout */}
                            <div className="backdrop-blur-2xl bg-black/50 rounded-2xl border border-white/20 overflow-hidden hover:border-amber-500 transition-all duration-300 h-full flex flex-row sm:flex-col hover:scale-[1.02] sm:hover:scale-105 shadow-lg">
                                {/* Product Image */}
                                <div className="relative w-36 self-stretch sm:w-full sm:aspect-square shrink-0 overflow-hidden rounded-l-2xl sm:rounded-l-none sm:rounded-t-2xl">
                                    {product.image ? (
                                        <Image
                                            src={urlFor(product.image).width(500).height(500).url()}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-900/50">
                                            <svg
                                                className="w-16 h-16"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </div>
                                    )}

                                    {/* Best Seller Badge */}
                                    <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
                                        <span className="bg-yellow-500 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-md">
                                            #{index + 1 + (page * pageSize)} Más Vendido
                                        </span>
                                    </div>

                                    {/* Featured Badge - Desktop only */}
                                    {product.isFeatured && (
                                        <div className="absolute top-4 right-4 hidden sm:block">
                                            <span className="bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-full shadow-md">
                                                Destacado
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Product Info */}
                                <div className="p-3 sm:p-6 sm:pb-4 flex-1 flex flex-col justify-between min-w-0">
                                    <h3 className="text-sm sm:text-xl font-bold text-white mb-1 sm:mb-2 shrink-0 uppercase tracking-wide line-clamp-2">
                                        {product.name}
                                    </h3>

                                    {product.description && (
                                        <p className="text-white/70 text-xs sm:text-sm leading-relaxed mb-1 sm:mb-4 flex-1 line-clamp-2 sm:line-clamp-3">
                                            {product.description}
                                        </p>
                                    )}
                                    
                                    {/* Mobile: Leer más link */}
                                    <span className="text-amber-500 text-xs font-medium sm:hidden mb-2">Leer más</span>

                                    {product.price && (
                                        <p className="text-lg sm:text-2xl font-black text-amber-500 shrink-0">
                                            L{product.price.toFixed(0)}
                                        </p>
                                    )}

                                    {/* Category - Desktop only */}
                                    {product.category && (
                                        <div className="hidden sm:flex items-center justify-between mt-auto shrink-0">
                                            <span className="inline-block bg-white/10 text-white text-sm px-3 py-1 rounded-full border border-white/20">
                                                {translateCategory(product.category)}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Ver Detalles Link - Desktop only */}
                                <div className="hidden sm:block px-6 pb-6">
                                    <div className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 uppercase tracking-wide">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        Ver Detalles
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="mt-12 flex items-center justify-center gap-2">
                        {/* Previous Arrow */}
                        <button
                            aria-label="Anterior"
                            onClick={() => {
                                setPage((p) => Math.max(0, p - 1));
                                scrollToTop();
                            }}
                            disabled={page === 0}
                            className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-all ${page === 0
                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                : 'backdrop-blur-2xl bg-amber-500 text-black hover:bg-amber-600 shadow-lg'
                                }`}
                        >
                            <ChevronLeft size={20} />
                        </button>

                        {/* Page Numbers */}
                        <div className="flex items-center gap-2">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    aria-label={`Página ${i + 1}`}
                                    onClick={() => {
                                        setPage(i);
                                        scrollToTop();
                                    }}
                                    aria-current={page === i ? 'true' : 'false'}
                                    className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold text-sm transition-all ${page === i
                                        ? 'bg-amber-500 text-black shadow-lg scale-110'
                                        : 'backdrop-blur-2xl bg-black/50 text-white border border-white/20 hover:border-amber-500'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        {/* Next Arrow */}
                        <button
                            aria-label="Siguiente"
                            onClick={() => {
                                setPage((p) => Math.min(totalPages - 1, p + 1));
                                scrollToTop();
                            }}
                            disabled={page >= totalPages - 1}
                            className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-all ${page >= totalPages - 1
                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                : 'backdrop-blur-2xl bg-amber-500 text-black hover:bg-amber-600 shadow-lg'
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

