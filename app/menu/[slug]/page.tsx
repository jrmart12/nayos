import { client, PRODUCT_QUERY, SITE_SETTINGS_QUERY, RELATED_PRODUCTS_QUERY } from '@/lib/sanity'
import { notFound } from 'next/navigation'
import { Metadata, ResolvingMetadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import Link from 'next/link'
import ProductCutSelector from '@/components/ProductCutSelector'
import { PortableText } from '@portabletext/react'

interface ProductCut {
    weight: string
    price: number
    stock: boolean
}

interface ProductOption {
    name: string
    required: boolean
    multiple: boolean
    choices: {
        label: string
        extraPrice: number
    }[]
}

interface Product {
    _id: string
    name: string
    slug: { current: string }
    description?: string
    detailedDescription?: any[]
    price?: number
    cuts?: ProductCut[]
    currency?: string
    image?: SanityImageSource
    gallery?: SanityImageSource[]
    category?: string
    isBestSeller?: boolean
    isFeatured?: boolean
    unit?: string
    options?: ProductOption[]
    allowSpecialInstructions?: boolean
    nutritionalInfo?: {
        calories?: number
        protein?: number
        fat?: number
        carbs?: number
    }
    preparation?: string
    origin?: string
    weight?: string
}

// Translation function for categories - Burger focused
const translateCategory = (category: string): string => {
    const translations: Record<string, string> = {
        'hamburguesas': 'Hamburguesas',
        'pollo': 'Pollo',
        'acompanamientos': 'Acompañamientos',
        'bebidas': 'Bebidas',
        'combos': 'Combos',
        'otros': 'Otros',
    }

    return translations[category?.toLowerCase()] || category || 'Otros'
}

interface ProductPageProps {
    params: {
        slug: string
    }
}

export const revalidate = 60

export async function generateStaticParams() {
    const products = await client.fetch(`*[_type == "product"]{ slug }`)
    return products.map((product: any) => ({
        slug: product.slug.current,
    }))
}

async function getProduct(slug: string): Promise<Product | null> {
    const query = `*[_type == "product" && slug.current == $slug][0]{
    _id,
    name,
    slug,
    description,
    detailedDescription,
    price,
    cuts,
    currency,
    image,
    gallery,
    category,
    isBestSeller,
    isFeatured,
    unit,
    options,
    allowSpecialInstructions,
    nutritionalInfo,
    preparation,
    origin,
    weight
  }`
    return await client.fetch(query, { slug })
}

export async function generateMetadata(
    { params }: ProductPageProps,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { slug } = await params
    const product = await getProduct(slug)

    if (!product) {
        return {
            title: 'Producto no encontrado | Nayos Burgers',
        }
    }

    const previousImages = (await parent).openGraph?.images || []
    const productImage = product.image
        ? urlFor(product.image).width(1200).height(630).url()
        : null

    const description = product.description || `Disfruta de ${product.name} en Nayos Burgers.`
    const priceText = product.price ? ` - L. ${product.price.toFixed(2)}` : ''

    return {
        title: product.name,
        description: `${description}${priceText}`,
        openGraph: {
            title: product.name,
            description: `${description}${priceText}`,
            url: `https://nayosburgers.com/menu/${slug}`,
            siteName: 'Nayos Burgers',
            images: productImage ? [productImage, ...previousImages] : previousImages,
            locale: 'es_HN',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: product.name,
            description: `${description}${priceText}`,
            images: productImage ? [productImage] : [],
        },
    }
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params
    const product = await getProduct(slug)
    const settings = await client.fetch(SITE_SETTINGS_QUERY)

    let relatedProducts = []
    if (product?.category) {
        const relatedQuery = `*[_type == "product" && category == $category && _id != $currentId] | order(_createdAt desc)[0...4]`
        relatedProducts = await client.fetch(relatedQuery, {
            category: product.category,
            currentId: product._id
        })
    }

    if (!product) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar settings={settings} />
            <main className="pt-28 pb-16">
                {/* Breadcrumb */}
                <section className="py-4 relative z-10">
                    <div className="container mx-auto px-4">
                        <nav className="text-sm">
                            <Link href="/" className="text-muted hover:text-primary transition-colors">Inicio</Link>
                            <span className="mx-2 text-muted/50">/</span>
                            <Link href="/menu" className="text-muted hover:text-primary transition-colors">Menú</Link>
                            <span className="mx-2 text-muted/50">/</span>
                            <span className="text-foreground font-semibold">{product.name}</span>
                        </nav>
                    </div>
                </section>

                {/* Product Details */}
                <section className="py-8 relative z-10">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Product Images */}
                            <div className="space-y-4">
                                {/* Main Image */}
                                <div className="bg-white rounded-3xl p-4 border border-border shadow-xl overflow-hidden">
                                    <div className="relative w-full aspect-square rounded-2xl overflow-hidden">
                                        {product.image ? (
                                            <Image
                                                src={urlFor(product.image).width(1000).height(1000).url()}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                                priority
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                                <span className="text-6xl">🍔</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Gallery */}
                                {product.gallery && product.gallery.length > 0 && (
                                    <div className="grid grid-cols-4 gap-4">
                                        {product.gallery.map((image, index) => (
                                            <div key={index} className="bg-white rounded-xl p-2 border border-border shadow-md">
                                                <div className="relative aspect-square rounded-lg overflow-hidden">
                                                    <Image
                                                        src={urlFor(image).width(200).height(200).url()}
                                                        alt={`${product.name} ${index + 1}`}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="bg-white rounded-3xl p-8 border border-border shadow-xl">
                                <div className="space-y-6">
                                    {/* Category Badge */}
                                    {product.category && (
                                        <span className="inline-block bg-primary text-white px-4 py-2 rounded-full text-sm font-bold">
                                            {translateCategory(product.category)}
                                        </span>
                                    )}

                                    {/* Title */}
                                    <h1 className="text-3xl md:text-5xl font-black text-foreground leading-tight">
                                        {product.name}
                                    </h1>

                                    {/* Price */}
                                    {product.cuts && product.cuts.length > 0 ? (
                                        <div className="mb-4">
                                            <p className="text-muted text-sm mb-2">Disponible en diferentes porciones</p>
                                        </div>
                                    ) : product.price ? (
                                        <div className="text-4xl font-black text-primary">
                                            L. {product.price.toFixed(2)}
                                        </div>
                                    ) : null}

                                    {/* Badges */}
                                    <div className="flex gap-2">
                                        {product.isFeatured && (
                                            <span className="inline-block bg-gray-100 text-foreground text-xs px-3 py-1.5 rounded-full font-semibold border border-border">
                                                ⭐ Destacado
                                            </span>
                                        )}
                                        {product.isBestSeller && (
                                            <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-3 py-1.5 rounded-full font-semibold border border-yellow-300">
                                                🔥 Más Vendido
                                            </span>
                                        )}
                                    </div>

                                    {/* Description */}
                                    {product.description && (
                                        <div>
                                            <h3 className="text-xl font-bold text-foreground mb-3">Descripción</h3>
                                            <p className="text-muted leading-relaxed">
                                                {product.description}
                                            </p>
                                        </div>
                                    )}

                                    {/* Detailed Description (Rich Text) */}
                                    {product.detailedDescription && product.detailedDescription.length > 0 && (
                                        <div>
                                            <h3 className="text-xl font-bold text-foreground mb-3">Detalles</h3>
                                            <div className="text-muted leading-relaxed prose prose-stone max-w-none">
                                                <PortableText value={product.detailedDescription} />
                                            </div>
                                        </div>
                                    )}

                                    {/* Nutritional Info */}
                                    {product.nutritionalInfo && (
                                        <div>
                                            <h3 className="text-xl font-bold text-foreground mb-3">Información Nutricional</h3>
                                            <div className="bg-background rounded-xl p-4 border border-border">
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    {product.nutritionalInfo.calories && (
                                                        <div>
                                                            <span className="text-muted">Calorías:</span>
                                                            <span className="text-foreground font-semibold ml-2">{product.nutritionalInfo.calories}</span>
                                                        </div>
                                                    )}
                                                    {product.nutritionalInfo.protein && (
                                                        <div>
                                                            <span className="text-muted">Proteína:</span>
                                                            <span className="text-foreground font-semibold ml-2">{product.nutritionalInfo.protein}g</span>
                                                        </div>
                                                    )}
                                                    {product.nutritionalInfo.fat && (
                                                        <div>
                                                            <span className="text-muted">Grasa:</span>
                                                            <span className="text-foreground font-semibold ml-2">{product.nutritionalInfo.fat}g</span>
                                                        </div>
                                                    )}
                                                    {product.nutritionalInfo.carbs && (
                                                        <div>
                                                            <span className="text-muted">Carbohidratos:</span>
                                                            <span className="text-foreground font-semibold ml-2">{product.nutritionalInfo.carbs}g</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Product Cut Selector */}
                                    <div className="pt-6 border-t border-border">
                                        <ProductCutSelector
                                            product={{
                                                _id: product._id,
                                                name: product.name,
                                                price: product.price,
                                                cuts: product.cuts,
                                                options: product.options,
                                                allowSpecialInstructions: product.allowSpecialInstructions,
                                                image: product.image,
                                                slug: product.slug.current,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Related Products */}
                {relatedProducts && relatedProducts.length > 0 && (
                    <section className="py-16 relative z-10">
                        <div className="container mx-auto px-4">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl md:text-4xl font-black text-foreground uppercase">
                                    También te puede gustar
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {relatedProducts.map((relatedProduct: Product) => (
                                    <Link
                                        key={relatedProduct._id}
                                        href={`/menu/${relatedProduct.slug.current}`}
                                        className="bg-white rounded-2xl border border-border overflow-hidden hover:border-primary hover:shadow-xl transition-all duration-300 group"
                                    >
                                        <div className="relative aspect-square overflow-hidden">
                                            {relatedProduct.image ? (
                                                <Image
                                                    src={urlFor(relatedProduct.image).width(500).height(500).url()}
                                                    alt={relatedProduct.name}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                                    <span className="text-4xl">🍔</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-lg font-bold text-foreground mb-2 uppercase tracking-wide line-clamp-2">
                                                {relatedProduct.name}
                                            </h3>
                                            {relatedProduct.price && (
                                                <p className="text-2xl font-black text-primary">
                                                    L{relatedProduct.price.toFixed(0)}
                                                </p>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </main>
            <Footer settings={settings} />
        </div>
    )
}
