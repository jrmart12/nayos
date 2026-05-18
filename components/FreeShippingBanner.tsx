"use client";
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';

function isWeekday(): boolean {
    const day = new Date().getDay(); // 0=Dom, 1=Lun … 5=Vie, 6=Sáb
    return day >= 1 && day <= 5;
}

export default function FreeShippingBanner() {
    const [showFreeDelivery, setShowFreeDelivery] = useState(false);
    const [showPromo, setShowPromo] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (pathname !== '/') return;
        if (!isWeekday()) return;
        const timer = setTimeout(() => {
            setShowFreeDelivery(true);
        }, 1800);
        return () => clearTimeout(timer);
    }, [pathname]);

    const handleCloseFreeDelivery = () => {
        setShowFreeDelivery(false);
        setShowPromo(true);
    };

    const handleClosePromo = () => {
        setShowPromo(false);
    };

    const handlePromoClick = () => {
        setShowPromo(false);
        router.push('/menu?category=special-combos');
    };

    return (
        <>
            {/* Free Delivery Popup — lunes a viernes */}
            <AnimatePresence>
                {showFreeDelivery && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleCloseFreeDelivery}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-300"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.88, y: 24 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.88, y: 24 }}
                            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
                            className="fixed inset-0 flex items-center justify-center z-301 p-6 pointer-events-none"
                        >
                            <div className="relative max-w-sm w-full rounded-2xl overflow-hidden shadow-2xl pointer-events-auto">
                                <button
                                    onClick={handleCloseFreeDelivery}
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
                                    onClick={handleCloseFreeDelivery}
                                />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Promo Image Popup — aparece después del free delivery */}
            <AnimatePresence>
                {showPromo && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleClosePromo}
                            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-300"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.88, y: 24 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.88, y: 24 }}
                            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
                            className="fixed inset-0 flex items-center justify-center z-301 p-4 pointer-events-none"
                        >
                            <div className="relative pointer-events-auto rounded-2xl overflow-hidden shadow-2xl cursor-pointer"
                                onClick={handlePromoClick}
                            >
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleClosePromo(); }}
                                    className="absolute top-3 right-3 z-10 bg-white/80 hover:bg-white text-gray-700 rounded-full p-1 transition-colors shadow"
                                    aria-label="Cerrar"
                                >
                                    <X size={18} />
                                </button>

                                {/* Mobile — full frame */}
                                <Image
                                    src="/NAYOS FULL FRAME DESIGN.png"
                                    alt="Special Combos"
                                    width={430}
                                    height={932}
                                    className="block md:hidden w-full max-h-[80vh] object-contain"
                                    priority
                                />

                                {/* Tablet */}
                                <Image
                                    src="/NAYOS 45 design.png"
                                    alt="Special Combos"
                                    width={768}
                                    height={1024}
                                    className="hidden md:block lg:hidden w-full max-h-[80vh] object-contain"
                                    priority
                                />

                                {/* Desktop — horizontal */}
                                <Image
                                    src="/NAYOS HORIZONTAL DESIGN.png"
                                    alt="Special Combos"
                                    width={1200}
                                    height={630}
                                    className="hidden lg:block w-full max-h-[80vh] object-contain"
                                    priority
                                />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
