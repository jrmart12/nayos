import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://housekitchenhn.com',
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 1,
        },
        {
            url: 'https://housekitchenhn.com/menu',
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.8,
        },
        // Add other pages here if they exist, e.g., /menu, /about
    ]
}
