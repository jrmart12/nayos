"use client";
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartButton() {
    const { totalItems, setIsOpen } = useCart();
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsHydrated(true);
    }, []);

    // Don't render until hydrated to prevent hydration mismatch
    if (!isHydrated || totalItems === 0) return null;

    return (
        <AnimatePresence>
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-primary text-white rounded-full p-4 shadow-lg z-50 flex items-center justify-center"
                aria-label="Open cart"
            >
                <ShoppingCart size={24} />
                <span className="absolute -top-2 -right-2 bg-white text-primary text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-sm">
                    {totalItems}
                </span>
            </motion.button>
        </AnimatePresence>
    );
}
