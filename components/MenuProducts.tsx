"use client";

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import CheckeredPattern from './CheckeredPattern'

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
    'hamburguesas': { icon: '🍔', label: 'Burgers', order: 1 },
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

    // Filter AND Sort products based on selected category
    let filteredProducts = selectedCategory === 'all'
        ? [...products] // Create a copy to sort
        : products.filter(p => (p.category?.toLowerCase() || 'otros') === selectedCategory)

    // Sort "all" view by category order
    if (selectedCategory === 'all') {
        filteredProducts.sort((a, b) => {
            const orderA = categoryConfig[a.category?.toLowerCase() || '']?.order ?? 99
            const orderB = categoryConfig[b.category?.toLowerCase() || '']?.order ?? 99
            return orderA - orderB
        })
    }

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
            <div className="bg-transparent py-4 mb-8">
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
                                            ? 'bg-[#9B292C] text-white shadow-lg border-2 border-[#9B292C]'
                                            : 'bg-white text-foreground border-2 border-[#9B292C] hover:bg-[#9B292C] hover:text-white'
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

            {/* Products Grid - Alternating Layout like Featured Burgers */}
            <div className="container mx-auto px-4" ref={productsGridRef}>
                {paginatedProducts.length > 0 ? (
                    <>
                        <div className="space-y-12 max-w-6xl mx-auto">
                            {paginatedProducts.map((product, index) => {
                                const imageUrl = product.image
                                    ? urlFor(product.image).width(800).height(600).url()
                                    : null
                                const isEven = index % 2 === 0

                                return (
                                    <Link
                                        key={product._id}
                                        href={`/menu/${product.slug.current}`}
                                        className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-center group cursor-pointer"
                                    >
                                        {/* Product Image - Alternates between left and right */}
                                        <div className={`relative h-48 md:h-80 rounded-3xl overflow-hidden shadow-2xl border-4 border-[#9B292C] ${isEven ? 'order-1' : 'order-1 md:order-2'}`}>
                                            {imageUrl ? (
                                                <Image
                                                    src={imageUrl}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                                    <span className="text-8xl">🍔</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Info - Alternates between right and left */}
                                        <div className={`border-b-4 border-[#9B292C] pb-4 md:pb-6 ${isEven ? 'order-2' : 'order-2 md:order-1'}`}>
                                            <h3 className="text-xl md:text-3xl lg:text-4xl font-black text-[#9B292C] mb-2 md:mb-3 uppercase tracking-tight group-hover:text-[#7A2123] transition-colors">
                                                {product.name}
                                            </h3>
                                            {product.description && (
                                                <p className="text-xs md:text-sm lg:text-base text-gray-700 font-bold uppercase tracking-wide mb-4">
                                                    {product.description}
                                                </p>
                                            )}
                                            {product.price && (
                                                <p className="text-2xl md:text-3xl lg:text-4xl font-black text-[#9B292C] mt-4" style={{ fontFamily: 'Impact, Haettenschweiler, sans-serif' }}>
                                                    L{product.price.toFixed(0)}
                                                </p>
                                            )}
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>

                        {/* Pagination Controls */}
                        {filteredProducts.length > ITEMS_PER_PAGE && (
                            <div className="mt-12 flex items-center justify-center gap-2">
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
                                        : 'bg-[#9B292C] text-white hover:bg-[#7A2123] shadow-lg'
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
                                                    ? 'bg-[#9B292C] text-white shadow-lg scale-110'
                                                    : 'bg-white text-foreground border-2 border-[#9B292C] hover:bg-[#9B292C] hover:text-white'
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
                                        : 'bg-[#9B292C] text-white hover:bg-[#7A2123] shadow-lg'
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
