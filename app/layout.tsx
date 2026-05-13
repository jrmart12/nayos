import type { Metadata } from "next";
import { Inter, Oswald, Caveat } from "next/font/google";
import Image from "next/image";
import Script from "next/script";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import CartButton from "@/components/CartButton";
import CartModal from "@/components/CartModal";
import FreeShippingBanner from "@/components/FreeShippingBanner";
import { client } from "@/lib/sanity";
import PageviewTracker from "@/components/PageviewTracker";

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
    <html lang="es" style={{ height: '100%', backgroundColor: '#fff8f0' }}>
      <body
        className={`${inter.variable} ${oswald.variable} ${caveat.variable} antialiased text-foreground relative`}
        style={{ minHeight: '100vh' }}
      >
        <div 
          className="fixed inset-0 -z-10"
          style={{
            backgroundImage: 'url(/sand-beige.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundColor: '#fff8f0'
          }}
        />
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
          <PageviewTracker />
          {children}
          <CartButton />
          <CartModal settings={settings} />
          <FreeShippingBanner />
        </CartProvider>
        <script defer src="https://cloud.umami.is/script.js" data-website-id="abe99048-96b0-4386-bd61-7ddd398183bc" data-domains="nayosburger.com" />

        {/* Meta Pixel */}
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1281906720722786');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1281906720722786&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </body>
    </html>
  );
}
