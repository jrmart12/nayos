import { client, HERO_QUERY, ABOUT_QUERY, FEATURED_PRODUCTS_QUERY, BEST_SELLERS_QUERY, TESTIMONIALS_QUERY, SITE_SETTINGS_QUERY } from '@/lib/sanity'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Products from '@/components/Products'
import Testimonials from '@/components/Testimonials'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import DeliverySection from '@/components/DeliverySection'
import FadeInUp from '@/components/animations/FadeInUp'

export const revalidate = 60

// Placeholder products for when Sanity is empty
const placeholderProducts = [
  {
    _id: 'placeholder-1',
    name: 'La Brava 1.50',
    description: 'Nueva salsa brava, carne angus, queso mozarella, cebolla caramelizada, y bacon crujiente.',
    price: 245,
    category: 'hamburguesas',
    slug: { current: 'la-brava' },
  },
  {
    _id: 'placeholder-2',
    name: 'Bacon Cheese Burger',
    description: 'Carne Angus Certified, bacon crujiente, queso americano, sweet relish, salsa nayos.',
    price: 249,
    category: 'hamburguesas',
    slug: { current: 'bacon-cheese' },
  },
  {
    _id: 'placeholder-3',
    name: 'Pork Belly Burger',
    description: 'Carne Angus Certified, y crujiente panceta de cerdo, queso americano, pepinillos.',
    price: 279,
    category: 'hamburguesas',
    slug: { current: 'pork-belly' },
  },
  {
    _id: 'placeholder-4',
    name: 'Classic Chicken Sandwich',
    description: 'Jugosa pechuga de pollo, queso americano, sweet relish, y salsa nayos.',
    price: 164,
    category: 'pollo',
    slug: { current: 'classic-chicken' },
  },
];

const placeholderTestimonials = [
  {
    _id: 'test-1',
    name: 'María García',
    role: 'Cliente Frecuente',
    content: 'Las mejores hamburguesas de La Ceiba! La Brava es mi favorita.',
    rating: 5,
  },
  {
    _id: 'test-2',
    name: 'Carlos Mejía',
    role: 'Foodie Local',
    content: 'Increíble sabor y excelente servicio. Siempre vuelvo por más!',
    rating: 5,
  },
  {
    _id: 'test-3',
    name: 'Ana López',
    role: 'Cliente',
    content: 'El bacon cheese burger es una delicia. Muy recomendado!',
    rating: 5,
  },
];

export default async function Home() {
  const [hero, about, featuredProducts, bestSellers, testimonials, settings] = await Promise.all([
    client.fetch(HERO_QUERY).catch(() => null),
    client.fetch(ABOUT_QUERY).catch(() => null),
    client.fetch(FEATURED_PRODUCTS_QUERY).catch(() => []),
    client.fetch(BEST_SELLERS_QUERY).catch(() => []),
    client.fetch(TESTIMONIALS_QUERY).catch(() => []),
    client.fetch(SITE_SETTINGS_QUERY).catch(() => null),
  ])

  // Use placeholders if no data
  const displayProducts = (bestSellers && bestSellers.length > 0) ? bestSellers : placeholderProducts;
  const displayTestimonials = (testimonials && testimonials.length > 0) ? testimonials : placeholderTestimonials;

  return (
    <div className="relative min-h-screen bg-background">
      <div className="relative z-10">
        <Navbar settings={settings} />
        <main>
          {/* Hero - Always show */}
          <FadeInUp>
            <Hero data={hero} />
          </FadeInUp>

          {/* Best Sellers / Products */}
          <FadeInUp delay={0.1}>
            <Products
              title="Platillos Más Vendidos"
              description="Los favoritos de nuestros clientes"
              products={displayProducts}
            />
          </FadeInUp>

          {/* About Section - Always show */}
          <FadeInUp delay={0.1}>
            <About data={about} />
          </FadeInUp>

          {/* Delivery Section - Always show */}
          <FadeInUp delay={0.1}>
            <DeliverySection delivery={settings?.delivery} phone={settings?.phone} logo={settings?.logo} />
          </FadeInUp>
        </main>
        <Footer settings={settings} />
      </div>
    </div>
  )
}
