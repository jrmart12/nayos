import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'

interface BlogPost {
    _id: string
    title: string
    slug: { current: string }
    excerpt?: string
    mainImage?: {
        asset: {
            _ref: string
        }
    }
    publishedAt: string
}

interface BlogProps {
    posts: BlogPost[]
}

export default function Blog({ posts }: BlogProps) {
    if (!posts || posts.length === 0) return null

    return (
        <section className="py-20 bg-black/80 backdrop-blur-sm">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Nuestro Blog
                    </h2>
                    <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                        Consejos, recetas y noticias de House Kitchen
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {posts.map((post) => (
                        <article
                            key={post._id}
                            className="bg-black border border-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl hover:border-red-600 transition-all duration-300"
                        >
                            {post.mainImage && (
                                <div className="relative h-64">
                                    <Image
                                        src={urlFor(post.mainImage).width(600).height(400).url()}
                                        alt={post.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}

                            <div className="p-6">
                                <time className="text-sm text-gray-400 mb-2 block">
                                    {new Date(post.publishedAt).toLocaleDateString('es-HN', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </time>

                                <h3 className="text-xl font-bold text-white mb-3 hover:text-red-500 transition-colors">
                                    <Link href={`/blog/${post.slug.current}`}>
                                        {post.title}
                                    </Link>
                                </h3>

                                {post.excerpt && (
                                    <p className="text-gray-400 mb-4 line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                )}

                                <Link
                                    href={`/blog/${post.slug.current}`}
                                    className="text-red-500 font-semibold hover:text-red-400 inline-flex items-center"
                                >
                                    Leer Más
                                    <svg
                                        className="w-4 h-4 ml-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}
