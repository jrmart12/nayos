import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Nayos - Las Mejores Smash'd Burgers de La Ceiba",
        short_name: "Nayos",
        description: "Las mejores Smash'd Burgers de La Ceiba, Honduras. ¡Pide a domicilio!",
        start_url: '/',
        display: 'standalone',
        background_color: '#fff8f0',
        theme_color: '#9B292C',
        icons: [
            {
                src: '/web-app-manifest-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/web-app-manifest-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}
