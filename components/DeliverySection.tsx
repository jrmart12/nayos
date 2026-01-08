'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'

interface DeliverySectionProps {
    delivery?: {
        enabled?: boolean
        title?: string
        subtitle?: string
        description?: string
        image?: SanityImageSource
        features?: string[]
        whatsappMessage?: string
    }
    phone?: string
    logo?: SanityImageSource
}

export default function DeliverySection({ delivery, phone, logo }: DeliverySectionProps) {
    const [mapLoaded, setMapLoaded] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setMapLoaded(true)
        }, 3000)
        return () => clearTimeout(timer)
    }, [])

    const handleWhatsAppClick = () => {
        if (!phone) return

        const cleanPhone = phone.replace(/\D/g, '')
        const message = encodeURIComponent(delivery?.whatsappMessage || '¡Hola! Me gustaría ordenar de Nayos.')
        const whatsappUrl = `https://wa.me/504${cleanPhone}?text=${message}`
        window.open(whatsappUrl, '_blank')
    }

    return (
        <section id="contact" className="py-20 bg-background relative overflow-hidden">
            {/* Decorative checkered corners */}
            <div className="checkered-corner-tl opacity-50" />
            <div className="checkered-corner-br opacity-50" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Text Content */}
                        <div className="order-2 lg:order-1">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                                {delivery?.title || 'Envíos a Domicilio'}
                            </h2>

                            <h3 className="text-xl md:text-2xl text-primary font-semibold mb-6">
                                {delivery?.subtitle || '¡Recibe tus burgers frescos directamente en tu puerta!'}
                            </h3>

                            <p className="text-lg text-muted mb-8 leading-relaxed">
                                {delivery?.description || 'Ofrecemos servicio de entrega a domicilio en La Ceiba y alrededores. Tus hamburguesas llegan calientes y en perfectas condiciones.'}
                            </p>

                            {/* Features */}
                            {delivery?.features && delivery.features.length > 0 && (
                                <div className="mb-8">
                                    <h4 className="text-lg font-semibold text-foreground mb-4">
                                        ¿Por qué elegir Nayos?
                                    </h4>
                                    <ul className="space-y-3">
                                        {delivery.features.map((feature, index) => (
                                            <li key={index} className="flex items-start">
                                                <svg
                                                    className="w-5 h-5 text-primary mt-1 mr-3 shrink-0"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                                <span className="text-muted">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* WhatsApp Button */}
                            <button
                                onClick={handleWhatsAppClick}
                                className="group relative inline-flex items-center px-8 py-4 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                                <svg
                                    className="w-6 h-6 mr-3"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                                </svg>
                                <span className="relative z-10">Ordenar por WhatsApp</span>
                            </button>

                            <p className="text-sm text-muted mt-4">
                                Respuesta inmediata • Pedidos urgentes disponibles
                            </p>
                        </div>

                        {/* Map and Contact */}
                        <div className="order-1 lg:order-2">
                            <div className="relative space-y-6">
                                {/* Google Maps */}
                                <div className="bg-white rounded-2xl p-4 border border-border shadow-lg relative min-h-[350px]">
                                    {!mapLoaded && (
                                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background rounded-xl">
                                            {logo ? (
                                                <div className="relative w-24 h-24 mb-4 animate-pulse">
                                                    <Image
                                                        src={urlFor(logo).width(200).url()}
                                                        alt="Loading..."
                                                        fill
                                                        className="object-contain"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="relative w-24 h-24 mb-4 animate-pulse">
                                                    <Image
                                                        src="/nayos_logo.jpg"
                                                        alt="Loading..."
                                                        fill
                                                        className="object-contain rounded-full"
                                                    />
                                                </div>
                                            )}
                                            <p className="text-muted text-sm font-light">Cargando mapa...</p>
                                        </div>
                                    )}
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3839.4968810916553!2d-86.7915457!3d15.7777329!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f69a9991bdc08ef%3A0x5d4a27d2e1b93a79!2sNayos!5e0!3m2!1sen!2shn!4v1767904834334!5m2!1sen!2shn"
                                        width="100%"
                                        height="350"
                                        style={{ border: 0 }}
                                        allowFullScreen={true}
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        className={`rounded-xl transition-opacity duration-700 ${mapLoaded ? 'opacity-100' : 'opacity-0'}`}
                                        onLoad={() => setMapLoaded(true)}
                                    ></iframe>
                                </div>

                                {/* WhatsApp Contact Card */}
                                <div className="bg-white rounded-2xl p-6 border border-border shadow-lg">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="text-foreground font-bold text-lg mb-2">¿Tienes preguntas?</h4>
                                            <p className="text-muted text-sm">Contáctanos por WhatsApp</p>
                                        </div>
                                        <button
                                            onClick={handleWhatsAppClick}
                                            className="bg-green-500 hover:bg-green-600 p-4 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg"
                                            aria-label="Contactar por WhatsApp"
                                        >
                                            <svg
                                                className="w-8 h-8 text-white"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
