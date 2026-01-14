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
        'hamburguesas': 'Burgers',
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
        : '/nayos_logo.png'

    const description = product.description || `Disfruta de ${product.name} en Nayos Burgers.`
    const priceText = product.price ? ` - L${product.price.toFixed(0)}` : ''

    return {
        title: product.name,
        description: `${description}${priceText}`,
        openGraph: {
            title: `${product.name}${priceText} | Nayos Burgers`,
            description: description,
            url: `https://nayosburger.com/menu/${slug}`,
            siteName: 'Nayos Burgers',
            images: [{
                url: productImage,
                width: 1200,
                height: 630,
                alt: product.name
            }],
            locale: 'es_HN',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${product.name}${priceText}`,
            description: description,
            images: [productImage],
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
        <div className="min-h-screen relative" style={{ backgroundImage: 'url(/sand-beige.jpg)', backgroundSize: 'cover', backgroundAttachment: 'fixed' }}>
            <Navbar settings={settings} />
            <main className="pt-28 pb-16">
                {/* Breadcrumb */}
                <section className="py-4 relative z-10">
                    <div className="container mx-auto px-4">
                        <nav className="text-sm">
                            <Link href="/" className="text-[#9B292C] hover:text-[#7A2123] transition-colors font-semibold">Inicio</Link>
                            <span className="mx-2 text-gray-600">/</span>
                            <Link href="/menu" className="text-[#9B292C] hover:text-[#7A2123] transition-colors font-semibold">Menú</Link>
                            <span className="mx-2 text-gray-600">/</span>
                            <span className="text-gray-900 font-bold">{product.name}</span>
                        </nav>
                    </div>
                </section>

                {/* Product Details - Alternating Layout */}
                <section className="py-8 relative z-10">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center mb-12">
                            {/* Product Image */}
                            <div className="relative h-64 md:h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 border-[#9B292C] order-1">
                                {product.image ? (
                                    <Image
                                        src={urlFor(product.image).width(1000).height(1200).url()}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                        <span className="text-8xl">🍔</span>
                                    </div>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="order-2 space-y-6">
                                <div>
                                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#9B292C] mb-4 leading-tight uppercase tracking-tight" style={{ fontFamily: 'Impact, Haettenschweiler, sans-serif' }}>
                                        {product.name}
                                    </h1>

                                    {product.category && (
                                        <span className="inline-block bg-[#9B292C] text-white px-4 py-2 rounded-lg text-sm font-bold mb-4 uppercase tracking-wider">
                                            {translateCategory(product.category)}
                                        </span>
                                    )}
                                </div>

                                {/* Badges */}
                                <div className="flex gap-2 flex-wrap">
                                    {product.isFeatured && (
                                        <span className="inline-block bg-yellow-400 text-yellow-900 text-xs px-3 py-1 rounded-lg font-bold uppercase">
                                            ⭐ Destacado
                                        </span>
                                    )}
                                    {product.isBestSeller && (
                                        <span className="inline-block bg-yellow-400 text-yellow-900 text-xs px-3 py-1 rounded-lg font-bold uppercase">
                                            🔥 Más Vendido
                                        </span>
                                    )}
                                </div>

                                {/* Description */}
                                {product.description && (
                                    <div className="border-t-4  border-[#9B292C] py-6">
                                        <p className="text-sm md:text-base lg:text-lg text-gray-700 font-bold uppercase tracking-wide leading-relaxed">
                                            {product.description}
                                        </p>
                                    </div>
                                )}



                                {/* Price */}

                            </div>
                        </div>

                        {/* Gallery */}
                        {product.gallery && product.gallery.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                                {product.gallery.map((image, index) => (
                                    <div key={index} className="relative h-32 md:h-40 rounded-2xl overflow-hidden border-4 border-[#9B292C] shadow-lg">
                                        <Image
                                            src={urlFor(image).width(400).height(400).url()}
                                            alt={`${product.name} ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Nutritional Info */}
                        {product.nutritionalInfo && (
                            <div className="bg-white border-4 border-[#9B292C] rounded-2xl p-6 shadow-xl mb-12">
                                <h3 className="text-2xl font-black text-[#9B292C] mb-4 uppercase" style={{ fontFamily: 'Impact, Haettenschweiler, sans-serif' }}>Información Nutricional</h3>
                                <div className="space-y-3">
                                    {product.nutritionalInfo.calories && (
                                        <div className="flex justify-between items-center border-b-2 border-gray-200 pb-2">
                                            <span className="text-gray-700 font-bold">Calorías:</span>
                                            <span className="text-[#9B292C] font-black">{product.nutritionalInfo.calories}</span>
                                        </div>
                                    )}
                                    {product.nutritionalInfo.protein && (
                                        <div className="flex justify-between items-center border-b-2 border-gray-200 pb-2">
                                            <span className="text-gray-700 font-bold">Proteína:</span>
                                            <span className="text-[#9B292C] font-black">{product.nutritionalInfo.protein}g</span>
                                        </div>
                                    )}
                                    {product.nutritionalInfo.fat && (
                                        <div className="flex justify-between items-center border-b-2 border-gray-200 pb-2">
                                            <span className="text-gray-700 font-bold">Grasa:</span>
                                            <span className="text-[#9B292C] font-black">{product.nutritionalInfo.fat}g</span>
                                        </div>
                                    )}
                                    {product.nutritionalInfo.carbs && (
                                        <div className="flex justify-between items-center border-b-2 border-gray-200 pb-2">
                                            <span className="text-gray-700 font-bold">Carbohidratos:</span>
                                            <span className="text-[#9B292C] font-black">{product.nutritionalInfo.carbs}g</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Product Cut Selector */}
                        <div className="mt-12">
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
                </section>

                {/* Related Products */}
                {relatedProducts && relatedProducts.length > 0 && (
                    <section className="py-16 relative z-10">
                        <div className="container mx-auto px-4 max-w-6xl">
                            <h2 className="text-4xl md:text-5xl font-black text-[#9B292C] mb-12 text-center uppercase tracking-tight" style={{ fontFamily: 'Impact, Haettenschweiler, sans-serif' }}>
                                También te puede gustar
                            </h2>

                            <div className="space-y-12">
                                {relatedProducts.slice(0, 3).map((relatedProduct: Product, index: number) => {
                                    const isEven = index % 2 === 0

                                    return (
                                        <Link
                                            key={relatedProduct._id}
                                            href={`/menu/${relatedProduct.slug.current}`}
                                            className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-center group cursor-pointer"
                                        >
                                            {/* Product Image - Alternates between left and right */}
                                            <div className={`relative h-48 md:h-80 rounded-3xl overflow-hidden shadow-2xl border-4 border-[#9B292C] ${isEven ? 'order-1' : 'order-1 md:order-2'}`}>
                                                {relatedProduct.image ? (
                                                    <Image
                                                        src={urlFor(relatedProduct.image).width(800).height(600).url()}
                                                        alt={relatedProduct.name}
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
                                                    {relatedProduct.name}
                                                </h3>
                                                {relatedProduct.description && (
                                                    <p className="text-xs md:text-sm lg:text-base text-gray-700 font-bold uppercase tracking-wide mb-4">
                                                        {relatedProduct.description}
                                                    </p>
                                                )}
                                                {relatedProduct.price && (
                                                    <p className="text-2xl md:text-3xl lg:text-4xl font-black text-[#9B292C] mt-4" style={{ fontFamily: 'Impact, Haettenschweiler, sans-serif' }}>
                                                        L{relatedProduct.price.toFixed(0)}
                                                    </p>
                                                )}
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    </section>
                )}
            </main>
            <Footer settings={settings} />
        </div>
    )
}
