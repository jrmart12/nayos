"use client";

import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { ChefHat, Heart, Clock, MapPin } from 'lucide-react'
import CheckeredPattern from './CheckeredPattern'

interface AboutProps {
    data?: {
        title?: string
        description?: string
        image?: {
            asset: {
                _ref: string
            }
        }
        features?: Array<{
            _id: string
            title: string
            description?: string
        }>
    }
}

export default function About({ data }: AboutProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

    const imageUrl = data?.image ? urlFor(data.image).width(800).auto('format').url() : null;

    // Default features if none provided
    const defaultFeatures = [
        { _id: '1', title: 'Ingredientes Frescos', description: 'Solo usamos los mejores ingredientes locales' },
        { _id: '2', title: 'Hecho con Amor', description: 'Cada hamburguesa preparada con pasión' },
        { _id: '3', title: 'Servicio Rápido', description: 'Tu orden lista en minutos' },
        { _id: '4', title: 'Local Acogedor', description: 'Un ambiente perfecto para disfrutar' },
    ];

    const features = data?.features && data.features.length > 0 ? data.features : defaultFeatures;
    const featureIcons = [ChefHat, Heart, Clock, MapPin];

    return (
        <section ref={sectionRef} id="about" className="relative py-20 bg-transparent overflow-hidden">
            {/* Bottom Right Checkered Pattern */}
            <div className="hidden md:block absolute bottom-0 right-0 w-64 md:w-96 opacity-80 z-0 rotate-180">
                <CheckeredPattern className="w-full h-auto" />
            </div>

            <motion.div
                style={{ opacity }}
                className="relative z-10 container mx-auto px-4"
            >
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <Image
                            src="/nayos_logo.jpg"
                            alt="Nayos"
                            width={150}
                            height={60}
                            className="mx-auto mb-4 object-contain"
                        />
                        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-foreground mb-6">
                            {data?.title || "Sobre Nosotros"}
                        </h2>
                        <p className="text-lg text-muted max-w-2xl mx-auto">
                            {data?.description || "Somos apasionados por las hamburguesas. Desde 2020, hemos servido las mejores Smash'd Burgers de La Ceiba con ingredientes frescos y mucho sabor."}
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {features.map((feature, index) => {
                            const IconComponent = featureIcons[index % featureIcons.length];
                            return (
                                <div
                                    key={feature._id}
                                    className="text-center p-6 rounded-2xl bg-background hover:bg-gray-50 transition-all duration-300 border border-border"
                                >
                                    <div className="mb-4 flex justify-center text-primary">
                                        <IconComponent size={48} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground mb-2">
                                        {feature.title}
                                    </h3>
                                    {feature.description && (
                                        <p className="text-sm text-muted">{feature.description}</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </motion.div>
        </section>
    )
}
