import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

interface Testimonial {
    _id: string
    name: string
    role?: string
    content: string
    image?: {
        asset: {
            _ref: string
        }
    }
    rating: number
}

interface TestimonialsProps {
    testimonials: Testimonial[]
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
    if (!testimonials || testimonials.length === 0) return null

    return (
        <section className="py-20 bg-foreground relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-32 h-32 checkered-pattern opacity-20" />
            <div className="absolute bottom-0 right-0 w-32 h-32 checkered-pattern opacity-20" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <Image
                        src="/nayos_logo.jpg"
                        alt="Nayos"
                        width={120}
                        height={48}
                        className="mx-auto mb-4 object-contain brightness-0 invert"
                    />
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Lo Que Dicen Nuestros Clientes
                    </h2>
                    <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                        No solo confíes en nuestra palabra - escucha a nuestros clientes satisfechos
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial._id}
                            className="bg-white/5 p-8 rounded-2xl hover:bg-white/10 transition-all duration-300 border border-white/10 backdrop-blur-sm"
                        >
                            <div className="flex items-center mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-600'
                                            }`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>

                            <p className="text-gray-300 mb-6 italic text-lg">&quot;{testimonial.content}&quot;</p>

                            <div className="flex items-center">
                                {testimonial.image ? (
                                    <div className="relative w-12 h-12 mr-4 rounded-full overflow-hidden">
                                        <Image
                                            src={urlFor(testimonial.image).width(48).height(48).url()}
                                            alt={testimonial.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 mr-4 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
                                        {testimonial.name.charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <p className="font-bold text-white">{testimonial.name}</p>
                                    {testimonial.role && (
                                        <p className="text-sm text-gray-400">{testimonial.role}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
