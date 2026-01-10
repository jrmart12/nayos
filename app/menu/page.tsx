import { client, PRODUCTS_QUERY, SITE_SETTINGS_QUERY } from '@/lib/sanity'
import { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MenuProducts from '@/components/MenuProducts'
import CheckeredPattern from '@/components/CheckeredPattern'

export const revalidate = 60

export const metadata: Metadata = {
    title: "Menú",
    description: "Explora nuestro delicioso menú de hamburguesas. ¡Pide a domicilio en La Ceiba!",
    alternates: {
        canonical: '/menu',
    },
    openGraph: {
        title: "Menú | Nayos Burgers",
        description: "Las mejores Smash'd Burgers de La Ceiba. ¡Pide a domicilio!",
        images: [{ url: "/nayos_logo.jpg", width: 800, height: 600, alt: "Nayos Menu" }],
    },
}

export default async function ProductsPage() {
    const [products, settings] = await Promise.all([
        client.fetch(PRODUCTS_QUERY),
        client.fetch(SITE_SETTINGS_QUERY),
    ])

    return (
        <div className="min-h-screen relative" style={{ backgroundImage: 'url(/sand-beige.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <Navbar settings={settings} />
            <main className="pt-28 pb-16 relative z-10">
                {/* Header */}
                <section className="py-8 sm:py-12">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-3xl mx-auto">
                            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-[#9B292C] mb-4 uppercase tracking-tight"
                                style={{ fontFamily: 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif' }}>
                                Nuestro Menú
                            </h1>
                            <p className="text-base sm:text-lg md:text-xl text-gray-800 font-bold">
                                Hamburguesas smashed preparadas con ingredientes frescos
                            </p>
                        </div>
                    </div>
                </section>

                {/* Products with Category Tabs */}
                {products && products.length > 0 ? (
                    <MenuProducts products={products} />
                ) : (
                    <section className="py-20">
                        <div className="container mx-auto px-4 text-center">
                            <div className="text-6xl mb-4">🍔</div>
                            <h2 className="text-2xl font-bold text-[#9B292C] mb-2">Menú en Construcción</h2>
                            <p className="text-gray-700">Pronto tendremos nuestro menú disponible.</p>
                        </div>
                    </section>
                )}
            </main>

            <Footer settings={settings} />
        </div>
    )
}
