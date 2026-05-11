"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function FreeShippingBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const shown = sessionStorage.getItem('freeShippingPopupShown');
        if (!shown) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 1800);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        sessionStorage.setItem('freeShippingPopupShown', 'true');
    };

    const day = new Date().getDay(); // 0=Dom, 1=Lun … 5=Vie, 6=Sáb
    const isWeekday = day >= 1 && day <= 5;

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
                        <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden pointer-events-auto">
                            {/* Top accent bar */}
                            <div className="h-1.5 bg-primary" />

                            <div className="p-6 relative">
                                {/* Close button */}
                                <button
                                    onClick={handleClose}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
                                    aria-label="Cerrar"
                                >
                                    <X size={20} />
                                </button>

                                <div className="text-center space-y-4">
                                    {/* Icon */}
                                    <div className="text-5xl">🛵</div>

                                    {/* Title */}
                                    <h2 className="text-2xl font-black uppercase tracking-wide text-foreground font-heading">
                                        ¡Envío Gratis!
                                    </h2>

                                    {/* Validity badge */}
                                    <div className="inline-block bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
                                        <p className="text-primary text-xs font-bold uppercase tracking-wider">
                                            Promoción válida por el resto de mayo
                                        </p>
                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        En compras mayores de{' '}
                                        <span className="font-black text-primary">L. 300</span>,
                                        tu envío es{' '}
                                        <span className="font-black text-primary">completamente gratis</span>{' '}
                                        de{' '}
                                        <span className="font-bold text-foreground">lunes a viernes</span>.
                                    </p>

                                    {/* Weekday indicator */}
                                    {isWeekday ? (
                                        <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                                            <p className="text-green-700 text-xs font-bold uppercase tracking-wide">
                                                ✓ ¡Hoy aplica el envío gratis!
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                                            <p className="text-gray-500 text-xs font-semibold">
                                                Hoy es fin de semana — la promo aplica de lunes a viernes
                                            </p>
                                        </div>
                                    )}

                                    {/* CTA */}
                                    <button
                                        onClick={handleClose}
                                        className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-accent transition-all shadow-md hover:shadow-lg uppercase tracking-wide text-sm"
                                    >
                                        ¡Entendido!
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
