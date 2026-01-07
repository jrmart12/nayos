import { client, PRODUCT_QUERY, SITE_SETTINGS_QUERY, RELATED_PRODUCTS_QUERY } from '@/lib/sanity'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import Link from 'next/link'
import ProductCutSelector from '@/components/ProductCutSelector'

interface ProductCut {
    weight: string
    price: number
    stock: boolean
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

interface ProductPageProps {
    params: {
        slug: string
    }
}

export const revalidate = 60 // Revalidate every 60 seconds

// Generate static params for all products
export async function generateStaticParams() {
    const products = await client.fetch(`*[_type == "product"]{ slug }`)
    return products.map((product: any) => ({
        slug: product.slug.current,
    }))
}

// Fetch product data
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
    nutritionalInfo,
    preparation,
    origin,
    weight
  }`
    return await client.fetch(query, { slug })
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const { slug } = await params
    const product = await getProduct(slug)

    if (!product) {
        return {
            title: 'Producto no encontrado | House Kitchen Honduras',
            description: 'El producto que buscas no está disponible.',
        }
    }

    const title = `${product.name} en La Ceiba - House Kitchen`
    const description = product.description || `Disfruta de ${product.name} en House Kitchen. El mejor sabor de La Ceiba.`
    const imageUrl = product.image ? urlFor(product.image).width(1200).height(630).url() : '/logo.png'

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [{ url: imageUrl, width: 1200, height: 630, alt: product.name }],
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [imageUrl],
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
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Product',
                        name: product.name,
                        image: product.image ? urlFor(product.image).url() : undefined,
                        description: product.description,
                        brand: {
                            '@type': 'Restaurant',
                            name: 'House Kitchen'
                        },
                        offers: {
                            '@type': 'Offer',
                            url: `https://housekitchenhn.com/menu/${product.slug.current}`,
                            priceCurrency: product.currency || 'HNL',
                            price: product.price,
                            availability: 'https://schema.org/InStock'
                        }
                    })
                }}
            />
            <Navbar settings={settings} />
            <main className="pt-24 relative min-h-screen">
                {/* Breadcrumb */}
                <section className="py-6 relative z-10">
                    <div className="container mx-auto px-4">
                        <nav className="text-sm">
                            <Link href="/" className="text-gray-300 hover:text-amber-500 transition-colors">Inicio</Link>
                            <span className="mx-2 text-gray-600">/</span>
                            <Link href="/menu" className="text-gray-300 hover:text-amber-500 transition-colors">Menú</Link>
                            <span className="mx-2 text-gray-600">/</span>
                            <span className="text-white font-semibold">{product.name}</span>
                        </nav>
                    </div>
                </section>

                {/* Product Details */}
                <section className="py-16 relative z-10">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Product Images */}
                            <div className="space-y-4">
                                {/* Main Image with glassmorphism */}
                                <div className="backdrop-blur-2xl bg-black/50 rounded-3xl p-4 border border-white/30 shadow-2xl">
                                    <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden">
                                        {product.image ? (
                                            <Image
                                                src={urlFor(product.image).width(1000).height(1200).url()}
                                                alt={product.name}
                                                fill
                                                className="object-contain"
                                                priority
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                                <span className="text-gray-400">Imagen no disponible</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Gallery */}
                                {product.gallery && product.gallery.length > 0 && (
                                    <div className="grid grid-cols-4 gap-4">
                                        {product.gallery.map((image, index) => (
                                            <div key={index} className="backdrop-blur-2xl bg-black/50 rounded-xl p-2 border border-white/20">
                                                <div className="relative h-20 rounded-lg overflow-hidden">
                                                    <Image
                                                        src={urlFor(image).width(130).height(120).url()}
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

                            {/* Product Info with glassmorphism */}
                            <div className="backdrop-blur-2xl bg-black/50 rounded-3xl p-6 md:p-8 border border-white/30 shadow-2xl">
                                <div className="space-y-6">
                                    <div>
                                        <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
                                            {product.name}
                                        </h1>

                                        {product.category && (
                                            <span className="inline-block bg-amber-500 text-black px-4 py-2 rounded-full text-sm font-bold mb-4">
                                                {translateCategory(product.category)}
                                            </span>
                                        )}

                                        {product.cuts && product.cuts.length > 0 ? (
                                            <div className="mb-4">
                                                <p className="text-gray-400 text-sm mb-2">Disponible en diferentes porciones</p>
                                                <p className="text-gray-300 text-sm">Selecciona la porción que prefieras</p>
                                            </div>
                                        ) : product.price ? (
                                            <div className="text-3xl font-bold text-red-500 mb-4">
                                                L. {product.price.toFixed(2)} {product.unit || 'porción'}
                                            </div>
                                        ) : null}

                                        {product.origin && (
                                            <p className="text-gray-300 mb-2">
                                                <span className="font-semibold">Origen:</span> {product.origin}
                                            </p>
                                        )}

                                        {product.weight && (
                                            <p className="text-gray-300 mb-4">
                                                <span className="font-semibold">Peso disponible:</span> {product.weight}
                                            </p>
                                        )}
                                    </div>

                                    {/* Badges */}
                                    <div className="flex gap-2">
                                        {product.isFeatured && (
                                            <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                                                Destacado
                                            </span>
                                        )}
                                        {product.isBestSeller && (
                                            <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                                                Más Vendido
                                            </span>
                                        )}
                                    </div>

                                    {/* Description */}
                                    {product.description && (
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-3">Descripción</h3>
                                            <p className="text-gray-300 leading-relaxed">
                                                {product.description}
                                            </p>
                                        </div>
                                    )}

                                    {/* Nutritional Info */}
                                    {product.nutritionalInfo && (
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-3">Información Nutricional</h3>
                                            <div className="bg-black rounded-lg p-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    {product.nutritionalInfo.calories && (
                                                        <div>
                                                            <span className="text-gray-400">Calorías:</span>
                                                            <span className="text-white ml-2">{product.nutritionalInfo.calories}</span>
                                                        </div>
                                                    )}
                                                    {product.nutritionalInfo.protein && (
                                                        <div>
                                                            <span className="text-gray-400">Proteína:</span>
                                                            <span className="text-white ml-2">{product.nutritionalInfo.protein}g</span>
                                                        </div>
                                                    )}
                                                    {product.nutritionalInfo.fat && (
                                                        <div>
                                                            <span className="text-gray-400">Grasa:</span>
                                                            <span className="text-white ml-2">{product.nutritionalInfo.fat}g</span>
                                                        </div>
                                                    )}
                                                    {product.nutritionalInfo.carbs && (
                                                        <div>
                                                            <span className="text-gray-400">Carbohidratos:</span>
                                                            <span className="text-white ml-2">{product.nutritionalInfo.carbs}g</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Preparation */}
                                    {product.preparation && (
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-3">Preparación</h3>
                                            <p className="text-gray-300 leading-relaxed">
                                                {product.preparation}
                                            </p>
                                        </div>
                                    )}

                                    {/* Product Cut Selector */}
                                    <div className="pt-6">
                                        <ProductCutSelector
                                            product={{
                                                _id: product._id,
                                                name: product.name,
                                                cuts: product.cuts,
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

                {relatedProducts && relatedProducts.length > 0 && (
                    <section className="py-16 relative z-10">
                        <div className="container mx-auto px-4">
                            <h2 className="text-3xl md:text-4xl font-black text-white mb-12 text-center uppercase">
                                Productos Relacionados
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {relatedProducts.map((relatedProduct: Product) => (
                                    <Link
                                        key={relatedProduct._id}
                                        href={`/menu/${relatedProduct.slug.current}`}
                                        className="backdrop-blur-2xl bg-black/50 rounded-2xl border border-white/20 overflow-hidden hover:border-amber-500 transition-all duration-300 flex flex-col group"
                                    >
                                        <div className="relative h-64">
                                            {relatedProduct.image ? (
                                                <Image
                                                    src={urlFor(relatedProduct.image).width(400).height(500).url()}
                                                    alt={relatedProduct.name}
                                                    fill
                                                    className="object-contain group-hover:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                                    <span className="text-gray-400 text-sm">Sin imagen</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-lg font-bold text-white mb-2 uppercase">
                                                {relatedProduct.name}
                                            </h3>
                                            {relatedProduct.price && (
                                                <p className="text-amber-500 font-bold">
                                                    L. {relatedProduct.price.toFixed(2)} / {relatedProduct.unit || 'porción'}
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
        </>
    )
}
