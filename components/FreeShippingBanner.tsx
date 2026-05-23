"use client";
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';

// Feature flags — set to "true" in .env.local to fully disable a popup
const FREE_DELIVERY_DISABLED = process.env.NEXT_PUBLIC_DISABLE_FREE_DELIVERY_POPUP === 'true';
const SPECIAL_COMBOS_DISABLED = process.env.NEXT_PUBLIC_DISABLE_SPECIAL_COMBOS_POPUP === 'true';
const OG_COMBO_DISABLED = process.env.NEXT_PUBLIC_DISABLE_OG_COMBO_POPUP === 'true';

type PopupName = 'freeDelivery' | 'specialCombos' | 'ogCombo';

function isWeekday(): boolean {
    const day = new Date().getDay(); // 0=Dom, 1=Lun … 5=Vie, 6=Sáb
    return day >= 1 && day <= 5;
}

function isOgComboPromoDay(): boolean {
    const now = new Date();
    // Solo el 23 de mayo de 2026
    return now.getFullYear() === 2026 && now.getMonth() === 4 && now.getDate() === 23;
}

function buildQueue(): PopupName[] {
    const queue: PopupName[] = [];
    if (isOgComboPromoDay() && !OG_COMBO_DISABLED) queue.push('ogCombo');
    if (isWeekday() && !FREE_DELIVERY_DISABLED) queue.push('freeDelivery');
    if (!SPECIAL_COMBOS_DISABLED) queue.push('specialCombos');
    return queue;
}

export default function FreeShippingBanner() {
    const [queue, setQueue] = useState<PopupName[]>([]);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (pathname !== '/') return;
        const timer = setTimeout(() => {
            setQueue(buildQueue());
        }, 1800);
        return () => clearTimeout(timer);
    }, [pathname]);

    const current = queue[0] ?? null;
    const advance = () => setQueue(q => q.slice(1));

    const handleSpecialCombosClick = () => {
        advance();
        router.push('/menu?category=special-combos');
    };

    const handleOgComboClick = () => {
        advance();
        router.push('/menu/the-og-combo');
    };

    return (
        <>
            {/* Free Delivery Popup — solo lunes a viernes */}
            <AnimatePresence>
                {current === 'freeDelivery' && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={advance}
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
                                    onClick={advance}
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
                                    onClick={advance}
                                />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Special Combos Popup — lunes a domingo */}
            <AnimatePresence>
                {current === 'specialCombos' && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={advance}
                            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-300"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.88, y: 24 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.88, y: 24 }}
                            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
                            className="fixed inset-0 flex items-center justify-center z-301 p-4 pointer-events-none"
                        >
                            <div
                                className="relative pointer-events-auto rounded-2xl overflow-hidden shadow-2xl cursor-pointer"
                                onClick={handleSpecialCombosClick}
                            >
                                <button
                                    onClick={(e) => { e.stopPropagation(); advance(); }}
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

            {/* OG Combo Promo — solo May 23, 2026 */}
            <AnimatePresence>
                {current === 'ogCombo' && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={advance}
                            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-300"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.88, y: 24 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.88, y: 24 }}
                            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
                            className="fixed inset-0 flex items-center justify-center z-301 p-6 pointer-events-none"
                        >
                            <div
                                className="relative max-w-sm w-full rounded-2xl overflow-hidden shadow-2xl pointer-events-auto cursor-pointer"
                                onClick={handleOgComboClick}
                            >
                                <button
                                    onClick={(e) => { e.stopPropagation(); advance(); }}
                                    className="absolute top-3 right-3 z-10 bg-white/80 hover:bg-white text-gray-700 rounded-full p-1 transition-colors shadow"
                                    aria-label="Cerrar"
                                >
                                    <X size={18} />
                                </button>
                                <Image
                                    src="/og-promo.jpeg"
                                    alt="The OG Combo — Promo especial"
                                    width={500}
                                    height={625}
                                    className="w-full h-auto"
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
