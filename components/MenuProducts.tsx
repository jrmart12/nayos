"use client";

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Product {
    _id: string
    name: string
    slug: { current: string }
    description?: string
    price?: number
    image?: any
    category?: string
    isBestSeller?: boolean
}

interface MenuProductsProps {
    products: Product[]
}

// Category configuration
const categoryConfig: Record<string, { icon: string; label: string; order: number }> = {
    'all': { icon: '🍽️', label: 'Todos', order: 0 },
    'hamburguesas': { icon: '🍔', label: 'Hamburguesas', order: 1 },
    'pollo': { icon: '🍗', label: 'Pollo', order: 2 },
    'combos': { icon: '🎉', label: 'Combos', order: 3 },
    'acompanamientos': { icon: '🍟', label: 'Acompañamientos', order: 4 },
    'bebidas': { icon: '🥤', label: 'Bebidas', order: 5 },
}

const ITEMS_PER_PAGE = 4

export default function MenuProducts({ products }: MenuProductsProps) {
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [page, setPage] = useState(0)
    const [isMobile, setIsMobile] = useState(false)
    const productsGridRef = useRef<HTMLDivElement | null>(null)

    // Detect mobile on mount
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // Get unique categories from products
    const categories = ['all', ...new Set(products.map(p => p.category?.toLowerCase() || 'otros'))]
        .filter(cat => categoryConfig[cat] || cat === 'otros')
        .sort((a, b) => {
            const orderA = categoryConfig[a]?.order ?? 99
            const orderB = categoryConfig[b]?.order ?? 99
            return orderA - orderB
        })

    // Filter products based on selected category
    const filteredProducts = selectedCategory === 'all'
        ? products
        : products.filter(p => (p.category?.toLowerCase() || 'otros') === selectedCategory)

    // Pagination
    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE))
    const paginatedProducts = filteredProducts.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE)

    // Reset to page 0 when category changes
    const handleCategoryChange = (cat: string) => {
        setSelectedCategory(cat)
        setPage(0)
    }

    const scrollToProducts = () => {
        if (productsGridRef.current) {
            const yOffset = -100
            const y = productsGridRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset
            window.scrollTo({ top: y, behavior: 'smooth' })
        }
    }

    return (
        <div>
            {/* Category Tabs */}
            <div className="bg-background py-4 mb-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap gap-2 justify-center">
                        {categories.map((cat) => {
                            const config = categoryConfig[cat] || { icon: '🍽️', label: cat, order: 99 }
                            const isActive = selectedCategory === cat

                            return (
                                <button
                                    key={cat}
                                    onClick={() => handleCategoryChange(cat)}
                                    className={`
                                        flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm uppercase tracking-wide whitespace-nowrap transition-all
                                        ${isActive
                                            ? 'bg-primary text-white shadow-lg'
                                            : 'bg-white text-foreground border border-border hover:border-primary hover:text-primary'
                                        }
                                    `}
                                >
                                    <span>{config.icon}</span>
                                    <span>{config.label}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="container mx-auto px-4" ref={productsGridRef}>
                {paginatedProducts.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                            {paginatedProducts.map((product) => {
                                const catConfig = categoryConfig[product.category?.toLowerCase() || ''] || { icon: '🍽️', label: 'Otros' }

                                return (
                                    <Link
                                        key={product._id}
                                        href={`/menu/${product.slug.current}`}
                                        className="group bg-white rounded-2xl border border-border overflow-hidden hover:border-primary hover:shadow-xl transition-all duration-300"
                                    >
                                        {/* Mobile: Horizontal layout, Desktop: Vertical layout */}
                                        <div className="flex flex-row sm:flex-col h-full">
                                            {/* Product Image */}
                                            <div className="relative w-32 self-stretch sm:w-full sm:aspect-square shrink-0 overflow-hidden">
                                                {product.isBestSeller && (
                                                    <div className="absolute top-2 left-2 z-10 bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase">
                                                        🔥 Top
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
                                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center min-h-[120px]">
                                                        <span className="text-4xl">{catConfig.icon}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Product Info */}
                                            <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between min-w-0">
                                                <div>
                                                    <h3 className="text-sm sm:text-lg font-bold text-foreground mb-1 sm:mb-2 uppercase tracking-wide line-clamp-2">
                                                        {product.name}
                                                    </h3>

                                                    {product.description && (
                                                        <p className="text-muted text-xs sm:text-sm leading-relaxed mb-2 sm:mb-4 line-clamp-2">
                                                            {product.description}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between mt-auto">
                                                    {product.price && (
                                                        <p className="text-lg sm:text-2xl font-black text-primary">
                                                            L{product.price.toFixed(0)}
                                                        </p>
                                                    )}
                                                    <span className="text-primary text-xs font-semibold hidden sm:inline group-hover:underline">
                                                        Ver más →
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>

                        {/* Pagination Controls - Same as House Kitchen */}
                        {filteredProducts.length > ITEMS_PER_PAGE && (
                            <div className="mt-8 flex items-center justify-center gap-2">
                                {/* Previous Arrow */}
                                <button
                                    aria-label="Anterior"
                                    onClick={() => {
                                        setPage((p) => Math.max(0, p - 1))
                                        scrollToProducts()
                                    }}
                                    disabled={page === 0}
                                    className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-all ${page === 0
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-primary text-white hover:bg-accent shadow-lg'
                                        }`}
                                >
                                    <ChevronLeft size={20} />
                                </button>

                                {/* Page Numbers - Show max 3 on mobile, 5 on desktop */}
                                <div className="flex items-center gap-2">
                                    {Array.from({ length: totalPages }).map((_, i) => {
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
                                                className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold text-sm transition-all ${page === i
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
                                    className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-all ${page >= totalPages - 1
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-primary text-white hover:bg-accent shadow-lg'
                                        }`}
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🔍</div>
                        <h2 className="text-xl font-bold text-foreground mb-2">No hay productos</h2>
                        <p className="text-muted">No encontramos productos en esta categoría.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
