"use client";
import { useCart } from '@/contexts/CartContext';
import { track } from '@/lib/umami';
import Image from 'next/image';

export default function OgComboPromoSection() {
    const { addToCart } = useCart();

    const handleAddPromo = () => {
        addToCart({
            _id: 'promo-carnavalera-2og-combo',
            name: 'Promo Carnavalera - 2 OG Combos',
            price: 449,
            slug: 'the-og-combo',
            unit: 'promo',
        });
        track('add_to_cart', {
            product_id: 'promo-carnavalera-2og-combo',
            product_name: 'Promo Carnavalera - 2 OG Combos',
            price: 449,
        });
    };

    return (
        <div className="rounded-2xl overflow-hidden border-4 border-[#9B292C] shadow-2xl mb-8">

            <div className="bg-[#9B1C1F] p-6">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight" style={{ fontFamily: 'Impact, Haettenschweiler, sans-serif' }}>
                            Promo Carnavalera
                        </h2>
                        <p className="text-white/80 font-bold text-sm uppercase">
                            2 OG Combos · Válida sáb. 23 de mayo
                        </p>
                    </div>
                    <span className="text-4xl font-black text-white" style={{ fontFamily: 'Impact, Haettenschweiler, sans-serif' }}>
                        L449
                    </span>
                </div>
                <button
                    onClick={handleAddPromo}
                    className="w-full bg-white hover:bg-white text-[#9B1C1F] font-black py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] text-lg uppercase tracking-wide shadow-lg flex items-center justify-center gap-2"
                    style={{ fontFamily: 'Impact, Haettenschweiler, sans-serif' }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Agregar al Carrito — L449
                </button>
            </div>
        </div>
    );
}
