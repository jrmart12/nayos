"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';

export default function FreeShippingBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 1800);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-300"
                    />

                    {/* Popup */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.88, y: 24 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.88, y: 24 }}
                        transition={{ type: 'spring', damping: 22, stiffness: 280 }}
                        className="fixed inset-0 flex items-center justify-center z-301 p-6 pointer-events-none"
                    >
                        <div className="relative max-w-sm w-full rounded-2xl overflow-hidden shadow-2xl pointer-events-auto">
                            {/* Close button */}
                            <button
                                onClick={handleClose}
                                className="absolute top-3 right-3 z-10 bg-white/80 hover:bg-white text-gray-700 rounded-full p-1 transition-colors shadow"
                                aria-label="Cerrar"
                            >
                                <X size={18} />
                            </button>

                            <Image
                                src="/envio-gratis.png"
                                alt="Compras mayores de L300 - Tu envío es gratis de lunes a viernes"
                                width={500}
                                height={625}
                                className="w-full h-auto cursor-pointer"
                                priority
                                onClick={handleClose}
                            />
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
