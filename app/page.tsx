import { client, HERO_QUERY, ABOUT_QUERY, FEATURED_PRODUCTS_QUERY, BEST_SELLERS_QUERY, TESTIMONIALS_QUERY, SITE_SETTINGS_QUERY } from '@/lib/sanity'
import Image from "next/image";
import Hero from '@/components/Hero'
import FeaturedBurgers from '@/components/FeaturedBurgers'
import Philosophy from '@/components/Philosophy'
import VideoShowcase from '@/components/VideoShowcase'
import About from '@/components/About'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import DeliverySection from '@/components/DeliverySection'
import FadeInUp from '@/components/animations/FadeInUp'

export const revalidate = 60



const placeholderTestimonials = [
  {
    _id: 'test-1',
    name: 'María García',
    role: 'Cliente Frecuente',
    content: 'Las mejores Smash\'d Burgers de La Ceiba! La Brava es mi favorita.',
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
  const displayTestimonials = (testimonials && testimonials.length > 0) ? testimonials : placeholderTestimonials;

  return (
    <div className="min-h-screen relative">
      <Navbar settings={settings} />
      <main className="relative z-10">
        {/* Hero Section */}
        <FadeInUp>
          <Hero data={hero} />
        </FadeInUp>

        {/* Featured Burgers Showcase */}
        <FadeInUp delay={0.1}>
          <FeaturedBurgers products={bestSellers} />
        </FadeInUp>

        {/* Video Showcase */}
        <FadeInUp delay={0.1}>
          <VideoShowcase />
        </FadeInUp>

        {/* Philosophy Section */}
        <FadeInUp delay={0.1}>
          <Philosophy />
        </FadeInUp>

        {/* About Section (if you want to keep original about) */}
        {about && (
          <FadeInUp delay={0.1}>
            <About data={about} />
          </FadeInUp>
        )}
        {/* Delivery Section with WhatsApp */}
        <FadeInUp delay={0.1}>
          <DeliverySection delivery={settings?.delivery} phone={settings?.phone} logo={settings?.logo} />
        </FadeInUp>
      </main>
      <Footer settings={settings} />
    </div>
  )
}
