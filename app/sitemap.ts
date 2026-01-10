import { MetadataRoute } from 'next'
import { client } from '@/lib/sanity'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Get all products
    const products = await client.fetch(`*[_type == "product"]{ slug, _updatedAt }`)

    const productUrls = products.map((product: any) => ({
        url: `https://nayosburgers.com/menu/${product.slug.current}`,
        lastModified: new Date(product._updatedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }))

    return [
        {
            url: 'https://nayosburgers.com',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: 'https://nayosburgers.com/menu',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        ...productUrls,
    ]
}
