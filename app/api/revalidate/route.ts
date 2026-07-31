import { revalidatePath } from 'next/cache'
import { parseBody } from 'next-sanity/webhook'
import { NextRequest, NextResponse } from 'next/server'

/**
 * On-demand revalidation endpoint for Sanity.
 *
 * Pages are statically generated and no longer time-revalidate (we removed
 * `export const revalidate = 60`), which is what was burning ISR Write Units.
 * Instead, a Sanity webhook hits this route whenever content changes, and we
 * regenerate only the affected pages — so writes happen on edits, not on a
 * timer.
 *
 * Setup (one time):
 *  1. Add SANITY_REVALIDATE_SECRET to env (Vercel + .env.local).
 *  2. In Sanity (manage.sanity.io > API > Webhooks) create a webhook:
 *       URL:     https://nayosburger.com/api/revalidate
 *       Trigger: Create / Update / Delete
 *       Filter:  _type in ["product","hero","about","feature","testimonial","siteSettings"]
 *       Secret:  same value as SANITY_REVALIDATE_SECRET
 *       Projection (optional): {_type, "slug": slug.current}
 */

type WebhookPayload = {
    _type?: string
    slug?: string | { current?: string }
}

export async function POST(req: NextRequest) {
    try {
        const { isValidSignature, body } = await parseBody<WebhookPayload>(
            req,
            process.env.SANITY_REVALIDATE_SECRET
        )

        if (!isValidSignature) {
            return new NextResponse('Invalid signature', { status: 401 })
        }
        if (!body?._type) {
            return new NextResponse('Bad Request: missing _type', { status: 400 })
        }

        const revalidated: string[] = []
        const revalidate = (path: string, type?: 'page' | 'layout') => {
            revalidatePath(path, type)
            revalidated.push(type ? `${path} (${type})` : path)
        }

        switch (body._type) {
            case 'product':
                revalidate('/') // featured + best sellers on the homepage
                revalidate('/menu') // menu listing
                revalidate('/menu/[slug]', 'page') // every menu detail page
                revalidate('/products/[slug]', 'page') // every product detail page
                break
            case 'siteSettings':
                revalidate('/', 'layout') // settings are read in the root layout
                break
            default:
                // hero, about, feature, testimonial all render on home
                revalidate('/')
        }

        return NextResponse.json({
            revalidated,
            type: body._type,
            now: Date.now(),
        })
    } catch (err) {
        console.error('Revalidate webhook error:', err)
        const message = err instanceof Error ? err.message : 'Unknown error'
        return new NextResponse(message, { status: 500 })
    }
}
