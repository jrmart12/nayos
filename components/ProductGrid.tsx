"use client"
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { useMemo, useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import FadeInUp from './animations/FadeInUp'

interface Product {
    _id: string
    name: string
    slug: { current: string }
    description?: string
    price?: number
    comparePrice?: number
    image?: SanityImageSource
    category?: string
    isFeatured?: boolean
    isBestSeller?: boolean
}

interface ProductGridProps {
    products: Product[]
}

// Category icons mapping - Burger categories
const categoryIcons: Record<string, string> = {
    'hamburguesas': '🍔',
    'pollo': '🍗',
    'acompanamientos': '🍟',
    'bebidas': '🥤',
    'combos': '🎉',
    'otros': '🍽️',
}

// Translation function for categories - Burger categories
const translateCategory = (category: string): string => {
    const translations: Record<string, string> = {
        'hamburguesas': 'Hamburguesas',
        'pollo': 'Pollo',
        'acompanamientos': 'Acompañamientos',
        'bebidas': 'Bebidas',
        'combos': 'Combos',
        'otros': 'Otros',
    }

    return translations[category.toLowerCase()] || category
}

export default function ProductGrid({ products }: ProductGridProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('Todos')
    const sliderRef = useRef<HTMLDivElement | null>(null)
    const productsGridRef = useRef<HTMLDivElement | null>(null)
    const [page, setPage] = useState<number>(0)
    const [isMobile, setIsMobile] = useState(false)
    const pageSize = 4

    // Detect mobile on mount to avoid hydration mismatch
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // Group products by translated category
    const groupedProducts = products.reduce((acc, product) => {
        const category = translateCategory(product.category || 'Otros')
        if (!acc[category]) {
            acc[category] = []
        }
        acc[category].push(product)
        return acc
    }, {} as Record<string, Product[]>)

    // Derive a unique set of categories (translated) with custom order
    const categories = useMemo(() => {
        const cats = Object.keys(groupedProducts)

        // Define custom order for burger menu
        const categoryOrder = [
            'Hamburguesas',
            'Pollo',
            'Combos',
            'Acompañamientos',
            'Bebidas',
            'Otros'
        ]

        // Sort by custom order
        cats.sort((a, b) => {
            const indexA = categoryOrder.indexOf(a)
            const indexB = categoryOrder.indexOf(b)

            // If both are in the order array, sort by index
            if (indexA !== -1 && indexB !== -1) {
                return indexA - indexB
            }
            // If only A is in order, put it first
            if (indexA !== -1) return -1
            // If only B is in order, put it first
            if (indexB !== -1) return 1
            // Otherwise, alphabetical
            return a.localeCompare(b)
        })

        return ['Todos', ...cats]
    }, [groupedProducts])

    // Helper function to compare product names with numeric awareness
    const compareProductNames = (nameA: string, nameB: string): number => {
        // Extract leading numbers if present
        const numA = nameA.match(/^(\d+)/);
        const numB = nameB.match(/^(\d+)/);

        if (numA && numB) {
            // Both have leading numbers, compare numerically
            const diff = parseInt(numA[1], 10) - parseInt(numB[1], 10);
            if (diff !== 0) return diff;
            // If numbers are equal, compare the rest alphabetically
            return nameA.localeCompare(nameB);
        }

        // If only one has a leading number, it comes first
        if (numA) return -1;
        if (numB) return 1;

        // Neither has leading numbers, compare alphabetically
        return nameA.localeCompare(nameB);
    };

    // Determine the flattened set of visible products based on the selected category
    const visibleProducts: Product[] = useMemo(() => {
        let products: Product[] = [];

        if (selectedCategory === 'Todos') {
            products = Object.values(groupedProducts).flat();
        } else {
            products = groupedProducts[selectedCategory] || [];
        }

        // Sort products by category order when showing "Todos"
        if (selectedCategory === 'Todos') {
            const categoryOrder = [
                'hamburguesas',
                'pollo',
                'combos',
                'acompanamientos',
                'bebidas',
                'otros'
            ];

            products.sort((a, b) => {
                const indexA = categoryOrder.indexOf(a.category?.toLowerCase() || 'otros');
                const indexB = categoryOrder.indexOf(b.category?.toLowerCase() || 'otros');

                // If both are in the order list, sort by their position
                if (indexA !== -1 && indexB !== -1) {
                    if (indexA !== indexB) {
                        return indexA - indexB;
                    }
                    // Same category, sort by name with numeric awareness
                    return compareProductNames(a.name, b.name);
                }
                // If only A is in the list, it comes first
                if (indexA !== -1) return -1;
                // If only B is in the list, it comes first
                if (indexB !== -1) return 1;
                // Otherwise, sort by name with numeric awareness
                return compareProductNames(a.name, b.name);
            });
        } else {
            // When viewing a specific category, sort by name with numeric awareness
            products.sort((a, b) => compareProductNames(a.name, b.name));
        }

        return products;
    }, [groupedProducts, selectedCategory]);

    const totalPages = Math.max(1, Math.ceil(visibleProducts.length / pageSize))
    const paginatedProducts = useMemo(() => {
        const start = page * pageSize
        return visibleProducts.slice(start, start + pageSize)
    }, [visibleProducts, page])

    const scrollLeft = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: -200, behavior: 'smooth' })
        }
    }

    const scrollRight = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: 200, behavior: 'smooth' })
        }
    }

    const scrollToProducts = () => {
        if (productsGridRef.current) {
            const yOffset = -100 // Offset for fixed navbar
            const y = productsGridRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset
            window.scrollTo({ top: y, behavior: 'smooth' })
        }
    }

    return (
        <section className="relative z-10 bg-background py-8">
            <div className="container mx-auto px-4">
                {/* Category Slider with Icons */}
                <div className="mb-12 relative group">
                    {/* Left Arrow */}
                    <button
                        onClick={scrollLeft}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-primary hover:bg-accent text-white p-2 rounded-full shadow-lg transition-all transform hover:scale-110"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    {/* Right Arrow */}
                    <button
                        onClick={scrollRight}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-primary hover:bg-accent text-white p-2 rounded-full shadow-lg transition-all transform hover:scale-110"
                        aria-label="Scroll right"
                    >
                        <ChevronRight size={24} />
                    </button>

                    <div
                        ref={sliderRef}
                        className="flex gap-4 overflow-x-auto no-scrollbar py-4 px-12 snap-x snap-mandatory scrollbar-hide"
                        role="tablist"
                        aria-label="Categorías de productos"
                    >
                        {categories.map((cat) => {
                            // Find the original category key from products
                            const productInCategory = cat === 'Todos'
                                ? null
                                : Object.values(groupedProducts).flat().find(p => translateCategory(p.category || '') === cat)
                            const originalCategory = productInCategory?.category?.toLowerCase() || 'otros'
                            const icon = categoryIcons[originalCategory] || '🍽️'

                            return (
                                <button
                                    key={cat}
                                    role="tab"
                                    aria-selected={selectedCategory === cat}
                                    className={`shrink-0 flex flex-col items-center gap-2 px-6 py-4 rounded-2xl font-bold text-sm whitespace-nowrap transition-all ${selectedCategory === cat
                                        ? 'bg-primary text-white border-2 border-primary shadow-lg scale-105'
                                        : 'bg-white text-foreground border-2 border-border hover:border-primary'
                                        }`}
                                    onClick={() => { setSelectedCategory(cat); setPage(0) }}
                                >
                                    <span className="text-3xl">{icon}</span>
                                    <span className="uppercase tracking-wide">{cat}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div className="mb-16" ref={productsGridRef}>
                    {/* Products Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                        {paginatedProducts.length === 0 ? (
                            <div className="text-center text-muted col-span-full bg-white rounded-2xl p-8 border border-border">
                                <p>No hay productos en esta categoría.</p>
                            </div>
                        ) : paginatedProducts.map((product, index) => (
                            <FadeInUp key={product._id} delay={index * 0.1}>
                                <Link
                                    href={`/menu/${product.slug.current}`}
                                    className="block group h-full"
                                >
                                    {/* Mobile: Horizontal layout, Desktop: Vertical layout */}
                                    <div className="bg-white rounded-2xl border border-border overflow-hidden hover:border-primary hover:shadow-xl transition-all duration-300 h-full flex flex-row sm:flex-col">
                                        {/* Product Image */}
                                        <div className="relative w-36 self-stretch sm:w-full sm:aspect-4/3 shrink-0 overflow-hidden rounded-l-2xl sm:rounded-l-none sm:rounded-t-2xl">
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
                                        <div className="p-3 sm:p-6 sm:pb-4 flex-1 flex flex-col justify-between min-w-0">
                                            <div className="flex gap-2 mb-1 sm:hidden">
                                                {product.isBestSeller && (
                                                    <span className="inline-block bg-yellow-400 text-yellow-900 text-[10px] px-2 py-0.5 rounded-full font-bold">
                                                        Más Vendido
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="text-sm sm:text-xl font-bold text-foreground mb-1 sm:mb-2 shrink-0 uppercase tracking-wide line-clamp-2">
                                                {product.name}
                                            </h3>

                                            {product.description && (
                                                <p className="text-muted text-xs sm:text-sm leading-relaxed mb-1 sm:mb-4 flex-1 line-clamp-2 sm:line-clamp-3">
                                                    {product.description}
                                                </p>
                                            )}

                                            <span className="text-primary text-xs font-medium sm:hidden mb-2">Leer más</span>

                                            {product.price && (
                                                <p className="text-lg sm:text-2xl font-black text-primary shrink-0">
                                                    L{product.price.toFixed(0)}
                                                    {product.comparePrice && product.comparePrice > product.price && (
                                                        <span className="text-muted line-through text-xs sm:text-sm ml-2">
                                                            L{product.comparePrice.toFixed(0)}
                                                        </span>
                                                    )}
                                                </p>
                                            )}

                                            <div className="hidden sm:flex gap-2 mt-auto shrink-0">
                                                {product.isFeatured && (
                                                    <span className="inline-block bg-gray-100 text-foreground text-xs px-2 py-1 rounded-full font-medium border border-border">
                                                        Destacado
                                                    </span>
                                                )}
                                                {product.isBestSeller && (
                                                    <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium border border-yellow-300">
                                                        Más Vendido
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="hidden sm:block px-6 pb-6">
                                            <div className="w-full bg-primary hover:bg-accent text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 uppercase tracking-wide">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                Ver Detalles
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </FadeInUp>
                        ))}
                    </div>
                </div>

                {/* Pagination Controls - Mobile Optimized */}
                {visibleProducts.length > pageSize && (
                    <div className="mt-8 flex items-center justify-center gap-2">
                        {/* Previous Arrow */}
                        <button
                            aria-label="Anterior"
                            onClick={() => {
                                setPage((p) => Math.max(0, p - 1))
                                scrollToProducts()
                            }}
                            disabled={page === 0}
                            className={`w-10 h-10 flex items-center justify-center rounded-full font-bold transition-all ${page === 0
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-primary text-white hover:bg-accent shadow-lg'
                                }`}
                        >
                            <ChevronLeft size={20} />
                        </button>

                        {/* Page Numbers - Show max 3 on mobile, 5 on desktop */}
                        <div className="flex items-center gap-2">
                            {Array.from({ length: totalPages }).map((_, i) => {
                                // On mobile, only show current page and adjacent pages
                                const maxVisible = isMobile ? 3 : 5;
                                const half = Math.floor(maxVisible / 2);

                                let showPage = false;
                                if (totalPages <= maxVisible) {
                                    showPage = true;
                                } else if (page <= half) {
                                    showPage = i < maxVisible;
                                } else if (page >= totalPages - half - 1) {
                                    showPage = i >= totalPages - maxVisible;
                                } else {
                                    showPage = Math.abs(page - i) <= half;
                                }

                                if (!showPage) return null;

                                return (
                                    <button
                                        key={i}
                                        aria-label={`Página ${i + 1}`}
                                        onClick={() => {
                                            setPage(i)
                                            scrollToProducts()
                                        }}
                                        aria-current={page === i ? 'true' : 'false'}
                                        className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-sm transition-all ${page === i
                                            ? 'bg-primary text-white shadow-lg scale-110'
                                            : 'bg-white text-foreground border border-border hover:border-primary'
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Next Arrow */}
                        <button
                            aria-label="Siguiente"
                            onClick={() => {
                                setPage((p) => Math.min(totalPages - 1, p + 1))
                                scrollToProducts()
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
        </section >
    )
}
