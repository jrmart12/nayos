import type { Metadata } from "next";
import { Inter, Oswald, Caveat } from "next/font/google";
import Image from "next/image";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import CartButton from "@/components/CartButton";
import CartModal from "@/components/CartModal";
import { client } from "@/lib/sanity";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
});

export const viewport = {
  themeColor: '#fff8f0',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://nayosburger.com'),
  title: {
    default: "Nayos | Las Mejores Smash'd Burgers de La Ceiba",
    template: "%s | Nayos Burgers"
  },
  description: "Las mejores Smash'd Burgers de La Ceiba, Honduras. Ingredientes frescos, sabor inigualable. ¡Pide a domicilio!",
  keywords: ["Nayos", "Hamburguesas", "Burgers", "La Ceiba", "Honduras", "Comida a Domicilio", "Restaurante"],
  authors: [{ name: "Nayos" }],
  alternates: {
    canonical: 'https://nayosburger.com',
  },
  openGraph: {
    title: "Nayos | Las Mejores Smash'd Burgers de La Ceiba",
    description: "Smash'd Burgers con ingredientes frescos. ¡Pide a domicilio!",
    siteName: "Nayos Burgers",
    images: [{
      url: "/web-app-manifest-512x512.png",
      width: 512,
      height: 512,
      alt: "Nayos Burgers - Las Mejores Smash'd Burgers de La Ceiba"
    }],
    locale: "es_HN",
    type: "website",
    url: 'https://nayosburger.com',
  },
  twitter: {
    card: "summary",
    title: "Nayos Burgers",
    description: "Las mejores Smash'd Burgers de La Ceiba.",
    images: ["/web-app-manifest-512x512.png"],
  },
  applicationName: 'Nayos',
  appleWebApp: {
    capable: true,
    title: 'Nayos',
    statusBarStyle: 'default',
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/web-app-manifest-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/web-app-manifest-512x512.png', sizes: '512x512', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/web-app-manifest-192x192.png',
    apple: [
      { url: '/web-app-manifest-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

async function getSiteSettings() {
  return await client.fetch('*[_type == "siteSettings"][0]');
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html lang="es">
      <body
        className={`${inter.variable} ${oswald.variable} ${caveat.variable} antialiased text-foreground min-h-screen bg-[#fff8f0]`}
      >
        <div className="fixed w-full h-[100dvh] top-0 left-0 z-[-1]">
          <Image
            src="/sand-beige.jpg"
            alt="Background"
            fill
            className="object-cover"
            quality={100}
            priority
          />
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Nayos Burgers",
              url: "https://nayosburger.com",
              logo: "https://nayosburger.com/web-app-manifest-512x512.png",
              image: "https://nayosburger.com/web-app-manifest-512x512.png",
              sameAs: [
                "https://www.facebook.com/nayosburgers",
                "https://www.instagram.com/nayosburgers"
              ]
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Restaurant",
              name: "Nayos Burgers",
              image: "https://nayosburger.com/web-app-manifest-512x512.png",
              logo: "https://nayosburger.com/web-app-manifest-512x512.png",
              "@id": "https://nayosburger.com",
              url: "https://nayosburger.com",
              telephone: "+50495082348",
              servesCuisine: "American, Burgers",
              priceRange: "$$",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Barrio La Isla",
                addressLocality: "La Ceiba",
                addressRegion: "Atlantida",
                postalCode: "31101",
                addressCountry: "HN",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 15.783471,
                longitude: -86.795244,
              },
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ],
                opens: "11:00",
                closes: "21:30",
              },
              menu: "https://nayosburger.com/menu",
              sameAs: [
                "https://www.facebook.com/nayosburgers",
                "https://www.instagram.com/nayosburgers"
              ]
            }),
          }}
        />

        <CartProvider>
          {children}
          <CartButton />
          <CartModal settings={settings} />
        </CartProvider>
      </body>
    </html>
  );
}
