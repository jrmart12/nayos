import { MetadataRoute } from 'next'
import { client } from '@/lib/sanity'

const BASE_URL = 'https://nayosburgers.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Get all products that have a slug
    const products = await client.fetch(`*[_type == "product" && defined(slug.current)]{ 
        "slug": slug.current, 
        _updatedAt 
    }`)

    const productUrls = products.map((product: any) => ({
        url: `${BASE_URL}/menu/${product.slug}`,
        lastModified: new Date(product._updatedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    return [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${BASE_URL}/menu`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        ...productUrls,
    ]
}
