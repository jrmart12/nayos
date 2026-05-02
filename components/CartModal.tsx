"use client";
import { useCart, CustomerInfo } from '@/contexts/CartContext';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { X, ShoppingCart, Trash2, Plus, Minus, Send, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { urlFor } from '@/sanity/lib/image';
import LocationPicker from './LocationPicker';
import { calculateDeliveryPrice, formatPrice } from '@/lib/deliveryUtils';
import { upload } from '@vercel/blob/client';
import { compressImage } from '@/lib/imageUtils';
import { saveOrder } from '@/lib/saveOrder';

const SPANISH_MONTHS: Record<string, number> = {
    enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
    julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11,
};

function extractDateFromText(text: string): Date | null {
    const spanishMatch = text.match(/(\d{1,2})\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)\s+(\d{4})/i);
    if (spanishMatch) {
        return new Date(parseInt(spanishMatch[3]), SPANISH_MONTHS[spanishMatch[2].toLowerCase()], parseInt(spanishMatch[1]));
    }
    const numMatch = text.match(/(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})/);
    if (numMatch) return new Date(parseInt(numMatch[3]), parseInt(numMatch[2]) - 1, parseInt(numMatch[1]));
    return null;
}

function extractAmountFromText(text: string): number | null {
    const match = text.match(/L\.?\s*((?:\d{1,3}(?:,\d{3})*|\d+)(?:\.\d{1,2})?)/i);
    if (!match) return null;
    const parsed = parseFloat(match[1].replace(/,/g, ''));
    return isNaN(parsed) ? null : parsed;
}

async function runOCR(file: File, expectedAmount: number) {
    const { createWorker } = await import('tesseract.js');
    const worker = await createWorker('spa');
    const { data: { text } } = await worker.recognize(file);
    await worker.terminate();

    const detectedDate = extractDateFromText(text);
    const detectedAmount = extractAmountFromText(text);
    const today = new Date();
    const isToday = detectedDate
        ? detectedDate.getDate() === today.getDate() &&
          detectedDate.getMonth() === today.getMonth() &&
          detectedDate.getFullYear() === today.getFullYear()
        : null;
    const amountMatches = detectedAmount !== null
        ? Math.abs(detectedAmount - expectedAmount) < 1
        : null;
    return {
        isToday,
        amountMatches,
        detectedDate: detectedDate ? detectedDate.toLocaleDateString('es-HN', { day: '2-digit', month: 'long', year: 'numeric' }) : null,
        detectedAmount,
    };
}

import { useRouter } from 'next/navigation';

export default function CartModal({ settings }: { settings?: any }) {
    const { items, isOpen, setIsOpen, removeFromCart, updateQuantity, totalPrice, customer, setCustomer, deliveryMethod, setDeliveryMethod, deliveryPrice, setDeliveryPrice } = useCart();
    const [currentStep, setCurrentStep] = useState<'cart' | 'checkout'>('cart');
    const [isHydrated, setIsHydrated] = useState(false);
    const [formErrors, setFormErrors] = useState<{ name?: string, phone?: string, address?: string, paymentMethod?: string, transferImage?: string, bono?: string, bonoEmail?: string, bonoIdentity?: string }>({});
    const [transferImage, setTransferImage] = useState<File | null>(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
    const [transferVerification, setTransferVerification] = useState<{
        isToday: boolean | null;
        amountMatches: boolean | null;
        detectedDate: string | null;
        detectedAmount: number | null;
    } | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [hasBono, setHasBono] = useState<boolean | null>(null);
    const [bonoEmailFile, setBonoEmailFile] = useState<File | null>(null);
    const [bonoIdentityFile, setBonoIdentityFile] = useState<File | null>(null);
    const [uploadedBonoEmailUrl, setUploadedBonoEmailUrl] = useState('');
    const [uploadedBonoIdentityUrl, setUploadedBonoIdentityUrl] = useState('');
    const [isUploadingBonoEmail, setIsUploadingBonoEmail] = useState(false);
    const [isUploadingBonoIdentity, setIsUploadingBonoIdentity] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const bonoEmailInputRef = useRef<HTMLInputElement>(null);
    const bonoIdentityInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const prevIsOpenRef = useRef(isOpen);

    useEffect(() => {
        if (isOpen) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setCurrentStep('cart');
        }
    }, [isOpen]);

    useEffect(() => {
        const wasOpen = prevIsOpenRef.current;
        prevIsOpenRef.current = isOpen;

        if (isOpen) {
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
        } else if (wasOpen && !isOpen) {
            // Only run cleanup when modal actually closes (was open, now closed)
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);

            // Clear delivery address when modal closes
            // This forces the user to use the location button again
            if (setCustomer && customer) {
                const { address, deliveryCoords, ...rest } = customer;
                setCustomer(rest);
            }
            // Reset delivery method and price when modal closes
            setDeliveryMethod('delivery');
            setDeliveryPrice(0);
        }

        return () => {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
        };
    }, [isOpen, setCustomer, setDeliveryPrice, setDeliveryMethod]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsHydrated(true);
    }, []);

    if (!isHydrated) return null;

    const goToCheckout = () => {
        if (items.length === 0) return;
        setCurrentStep('checkout');
    };

    const goBackToCart = () => {
        setCurrentStep('cart');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Format phone number for WhatsApp
        let phoneNumber = settings?.phone ? settings.phone.replace(/\D/g, '') : '50499999999';
        if (phoneNumber.length === 8) phoneNumber = '504' + phoneNumber;
        else if (phoneNumber.length === 11 && phoneNumber.startsWith('504')) phoneNumber = phoneNumber;
        else if (phoneNumber.length === 12 && phoneNumber.startsWith('+504')) phoneNumber = phoneNumber.replace('+', '');
        else if (phoneNumber.length < 8) phoneNumber = '50499999999';

        setFormErrors({});
        setFormErrors({});
        const errors: { name?: string, phone?: string, address?: string, paymentMethod?: string, transferImage?: string, bono?: string, bonoEmail?: string, bonoIdentity?: string } = {};

        if (!customer?.name?.trim()) errors.name = 'El nombre completo es requerido';
        if (!customer?.phone?.trim()) errors.phone = 'El teléfono es requerido';
        // Only require address if delivery method is 'delivery'
        if (deliveryMethod === 'delivery' && !customer?.address?.trim()) {
            errors.address = 'La dirección es requerida';
        }
        // Require payment method selection
        if (!customer?.paymentMethod) {
            errors.paymentMethod = 'Por favor seleccione un método de pago';
        }

        if (customer?.paymentMethod === 'transfer' && !uploadedImageUrl) {
            errors.transferImage = 'Por favor suba el comprobante de transferencia';
        }
        if (customer?.paymentMethod === 'transfer' && transferVerification?.isToday === false) {
            errors.transferImage = 'El comprobante no es de hoy. Por favor sube la transferencia correcta.';
        }
        if (customer?.paymentMethod === 'transfer' && transferVerification?.amountMatches === false) {
            errors.transferImage = `El monto del comprobante (L. ${transferVerification.detectedAmount?.toFixed(2)}) no coincide con el total de la orden (L. ${(totalPrice + deliveryPrice).toFixed(2)}). Por favor verifica.`;
        }
        if (hasBono === true && !uploadedBonoEmailUrl) {
            errors.bonoEmail = 'Por favor sube el screenshot del correo del bono';
        }
        if (hasBono === true && !uploadedBonoIdentityUrl) {
            errors.bonoIdentity = 'Por favor sube tu documento de identidad';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        // Use the already uploaded image URL
        const imageUrl = uploadedImageUrl;

        // Helper function to remove emojis from text
        const removeEmojis = (text: string) => {
            return text.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{FE00}-\u{FE0F}]|[\u{1F000}-\u{1F02F}]|[\u{1F0A0}-\u{1F0FF}]|[\u{1F100}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F910}-\u{1F96B}]|[\u{1F980}-\u{1F9E0}]/gu, '');
        };

        let message = '¡Hola! Me gustaría hacer un pedido:\n\n';
        if (customer) {
            if (customer.name) message += `Nombre: ${customer.name}\n`;
            if (customer.phone) message += `Teléfono: ${customer.phone}\n`;
            if (customer.address) message += `Dirección: ${customer.address}\n`;
            if (customer.notes) message += `Instrucciones: ${customer.notes}\n`;
            message += '\n';
        }

        items.forEach(item => {
            message += `• ${item.name}\n`;

            if (item.cutWeight) {
                message += `  Porción: ${item.cutWeight}\n`;
            }

            if (item.selectedOptions && Object.keys(item.selectedOptions).length > 0) {
                Object.entries(item.selectedOptions).forEach(([optionName, choices]) => {
                    const choicesArray = choices as Array<{ label: string; quantity: number }>;
                    const formattedChoices = choicesArray.map(c => 
                        c.quantity > 1 ? `${c.label} x${c.quantity}` : c.label
                    ).join(', ');
                    message += `  ${optionName}: ${formattedChoices}\n`;
                });
            }

            if (item.specialInstructions) {
                message += `  Indicaciones: ${item.specialInstructions}\n`;
            }
            message += `  Cantidad: ${item.quantity}\n`;
            message += `  Precio unitario: L. ${item.price.toFixed(2)}\n`;
            message += `  Subtotal: L. ${(item.price * item.quantity).toFixed(2)}\n\n`;
        });

        message += `*Subtotal: L. ${totalPrice.toFixed(2)}*\n`;
        message += `*Envío: L. ${deliveryPrice.toFixed(2)}*\n`;
        message += `*Total a Pagar: L. ${(totalPrice + deliveryPrice).toFixed(2)}*\n\n`;
        message += `Método de Entrega: ${deliveryMethod === 'delivery' ? 'A Domicilio' : 'Pickup (Recoger en restaurante)'}\n\n`;

        // Payment method information
        if (customer?.paymentMethod) {
            message += `*MÉTODO DE PAGO:*\n`;
            if (customer.paymentMethod === 'transfer') {
                message += `Transferencia Bancaria\n`;
                // Always BAC
                message += `Banco: BAC\n\n`;
                message += `*Cuenta BAC:* 750490481\n`;
                message += `Titular: Samara Brunch and Cake S DE RL\n`;
            } else if (customer.paymentMethod === 'bac_compra_click') {
                message += `Pago con Tarjeta\n`;
                message += `(Por favor generar link de pago)\n`;
            }
            message += '\n';
        }

        if (imageUrl) {
            message += `*Comprobante de Transferencia:*\n${imageUrl}\n\n`;
        }

        if (hasBono) {
            message += `*BONO DE REGALO:*\n`;
            if (uploadedBonoEmailUrl) message += `Screenshot del bono: ${uploadedBonoEmailUrl}\n`;
            if (uploadedBonoIdentityUrl) message += `Documento de identidad: ${uploadedBonoIdentityUrl}\n`;
            message += '\n';
        }

        // Remove emojis from the entire message
        message = removeEmojis(message);

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

        // Open WhatsApp immediately so the user is not blocked
        window.open(whatsappUrl, '_blank');

        // Reset submitting state after a short delay for visual feedback
        setIsSubmitting(true);
        setTimeout(() => setIsSubmitting(false), 1500);

        // Save order in the background (fire and forget)
        saveOrder({
            customerName: customer?.name || '',
            customerPhone: customer?.phone || '',
            customerAddress: customer?.address,
            deliveryMethod: deliveryMethod,
            paymentMethod: customer?.paymentMethod || '',
            subtotal: totalPrice,
            deliveryPrice: deliveryPrice,
            total: totalPrice + deliveryPrice,
            items: items,
            notes: customer?.notes,
            transferImageUrl: imageUrl || undefined,
        }).catch(err => {
            console.error('Failed to save order:', err);
        });
    };

    const onCustomerChange = (key: string, value: string) => {
        if (!setCustomer) return;
        setCustomer({
            ...(customer || {}),
            [key]: value,
        });

        if (formErrors[key as keyof typeof formErrors]) {
            setFormErrors(prev => ({
                ...prev,
                [key]: undefined
            }));
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-white z-[100] shadow-2xl overflow-y-auto border-l border-gray-100"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                            <div className="flex items-center gap-4">
                                {currentStep === 'checkout' && (
                                    <button onClick={goBackToCart} className="text-gray-500 hover:text-black transition-colors">
                                        <ArrowLeft size={24} />
                                    </button>
                                )}
                                <h2 className="text-2xl font-black text-foreground uppercase tracking-wide">
                                    {currentStep === 'cart' ? 'Tu Carrito' : 'Información de Envío'}
                                </h2>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-black transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {currentStep === 'cart' ? (
                                items.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                                        <ShoppingCart size={64} className="opacity-20" />
                                        <p className="text-lg font-medium">Tu carrito está vacío</p>
                                        <button
                                            onClick={() => {
                                                setIsOpen(false);
                                                router.push('/menu');
                                            }}
                                            className="text-primary hover:underline"
                                        >
                                            Ver Menú
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {items.map(item => (
                                            <motion.div
                                                layout
                                                key={item.id}
                                                className="bg-white rounded-xl p-4 flex gap-4 border border-gray-100 shadow-sm"
                                            >
                                                <div className="relative w-20 h-20 shrink-0 bg-gray-800 rounded-lg overflow-hidden">
                                                    {item.image && typeof item.image === 'object' && item.image.asset ? (
                                                        <Image
                                                            src={urlFor(item.image).width(100).height(100).url()}
                                                            alt={item.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : item.image && typeof item.image === 'string' ? (
                                                        <Image
                                                            src={item.image}
                                                            alt={item.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                                                            <ShoppingCart size={24} />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-foreground font-bold text-sm truncate uppercase tracking-wide">{item.name}</h3>

                                                    {item.cutWeight && (
                                                        <div className="text-gray-600 text-xs mt-1 font-semibold">
                                                            {item.cutWeight}
                                                        </div>
                                                    )}

                                                    {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                                                        <div className="mt-2 space-y-1">
                                                            {Object.entries(item.selectedOptions).map(([optionName, choices]) => {
                                                                const choicesArray = choices as Array<{ label: string; quantity: number }>;
                                                                const formattedChoices = choicesArray.map(c => 
                                                                    c.quantity > 1 ? `${c.label} x${c.quantity}` : c.label
                                                                ).join(', ');
                                                                return (
                                                                    <div key={optionName} className="text-xs">
                                                                        <span className="font-bold text-gray-700">{optionName}:</span>
                                                                        <span className="text-gray-600 ml-1">{formattedChoices}</span>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}

                                                    {item.specialInstructions && (
                                                        <div className="text-gray-500 text-xs mt-2 italic">
                                                            📝 {item.specialInstructions}
                                                        </div>
                                                    )}
                                                    <p className="text-primary font-bold text-sm mt-2">
                                                        L. {item.price.toFixed(2)}
                                                    </p>

                                                    <div className="flex items-center gap-3 mt-3">
                                                        <div className="flex items-center bg-gray-100 rounded-full border border-gray-200">
                                                            <button
                                                                onClick={() => updateQuantity(item.id || item._id || '', item.quantity - 1)}
                                                                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                                                            >
                                                                <Minus size={14} />
                                                            </button>
                                                            <span className="text-foreground font-bold text-sm w-4 text-center">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                onClick={() => updateQuantity(item.id || item._id || '', item.quantity + 1)}
                                                                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                                                            >
                                                                <Plus size={14} />
                                                            </button>
                                                        </div>
                                                        <button
                                                            onClick={() => removeFromCart(item.id || item._id || '')}
                                                            className="ml-auto text-gray-400 hover:text-red-500 transition-colors"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )
                            ) : (
                                <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                                    {/* Delivery Method Selection */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setDeliveryMethod('delivery');
                                                // Recalculate price if we have stored coordinates
                                                if (customer?.deliveryCoords) {
                                                    const price = calculateDeliveryPrice(
                                                        customer.deliveryCoords.lat,
                                                        customer.deliveryCoords.lng
                                                    );
                                                    setDeliveryPrice(price);
                                                }
                                            }}
                                            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${deliveryMethod === 'delivery'
                                                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                                                : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                                                }`}
                                        >
                                            <span className="font-bold uppercase">A Domicilio</span>
                                            <span className="text-xs opacity-90">Envío calculado</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setDeliveryMethod('pickup');
                                                setDeliveryPrice(0);
                                            }}
                                            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${deliveryMethod === 'pickup'
                                                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                                                : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                                                }`}
                                        >
                                            <span className="font-bold uppercase">Pickup</span>
                                            <span className="text-xs opacity-90">Recoger en restaurante</span>
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre Completo</label>
                                            <input
                                                className={`w-full bg-white border rounded-lg p-3 text-foreground focus:outline-none transition-colors ${formErrors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                                                    }`}
                                                placeholder="Nombre completo *"
                                                value={customer?.name || ''}
                                                onChange={(e) => onCustomerChange('name', e.target.value)}
                                            />
                                            {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Teléfono</label>
                                            <input
                                                className={`w-full bg-white border rounded-lg p-3 text-foreground focus:outline-none transition-colors ${formErrors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                                                    }`}
                                                placeholder="Teléfono *"
                                                value={customer?.phone || ''}
                                                onChange={(e) => onCustomerChange('phone', e.target.value)}
                                            />
                                            {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                                        </div>

                                        {deliveryMethod === 'delivery' && (
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Dirección de Entrega</label>
                                                {/* Show address if already set (from location picker) */}
                                                {customer?.address && (
                                                    <div className="relative mb-3">
                                                        <input
                                                            readOnly
                                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-500 cursor-not-allowed"
                                                            value={customer.address}
                                                        />
                                                    </div>
                                                )}
                                                {formErrors.address && <p className="text-red-500 text-xs mt-1 mb-2">{formErrors.address}</p>}

                                                {/* Location Picker - handles both mobile (button) and desktop (input + button) */}
                                                <LocationPicker
                                                    initialAddress={customer?.address}
                                                    onLocationSelect={(address, coords) => {
                                                        // Store both address and coordinates
                                                        onCustomerChange('address', address);
                                                        if (setCustomer) {
                                                            setCustomer({
                                                                ...(customer || {}),
                                                                address,
                                                                deliveryCoords: coords,
                                                            });
                                                        }
                                                        // Calculate delivery price - if coords are 0,0 (manual entry), use fixed price
                                                        if (coords.lat === 0 && coords.lng === 0) {
                                                            setDeliveryPrice(120); // Fixed price for manual address entry
                                                        } else {
                                                            const price = calculateDeliveryPrice(coords.lat, coords.lng);
                                                            setDeliveryPrice(price);
                                                        }
                                                    }}
                                                />
                                                {deliveryPrice > 0 && (
                                                    <div className="mt-2 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                                                        <p className="text-blue-600 text-sm flex justify-between">
                                                            <span>Costo de envío estimado:</span>
                                                            <span className="font-bold text-foreground">{formatPrice(deliveryPrice)}</span>
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Payment Method */}
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Método de Pago *</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        onCustomerChange('paymentMethod', 'transfer');
                                                    }}
                                                    className={`p-3 rounded-lg border flex flex-col items-center gap-1 transition-all text-sm ${customer?.paymentMethod === 'transfer'
                                                        ? 'bg-primary text-white border-primary shadow-md'
                                                        : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <span className="font-bold text-xs">Transferencia</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => onCustomerChange('paymentMethod', 'bac_compra_click')}
                                                    className={`p-3 rounded-lg border flex flex-col items-center gap-1 transition-all text-sm ${customer?.paymentMethod === 'bac_compra_click'
                                                        ? 'bg-primary text-white border-primary shadow-md'
                                                        : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <span className="font-bold text-xs">Tarjetas</span>
                                                </button>

                                            </div>
                                            {formErrors.paymentMethod && <p className="text-red-500 text-xs mt-2">{formErrors.paymentMethod}</p>}

                                            {/* Transfer - Bank info */}
                                            {customer?.paymentMethod === 'transfer' && (
                                                <div className="mt-3 space-y-3">
                                                    {/* Bank account info */}
                                                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                                                        <p className="text-gray-900 font-bold mb-2">Datos de BAC:</p>

                                                        <div className="flex items-center justify-between mb-1">
                                                            <p className="text-gray-700 flex-1">Cuenta: <span className="font-mono font-bold">750490481</span></p>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    navigator.clipboard.writeText('750490481');
                                                                    setCopiedAccount('BAC');
                                                                    setTimeout(() => setCopiedAccount(null), 2000);
                                                                }}
                                                                className={`text-xs px-2 py-1 rounded transition-colors ${copiedAccount === 'BAC' ? 'bg-green-600 text-white' : 'bg-primary hover:bg-primary/80 text-white'}`}
                                                            >
                                                                {copiedAccount === 'BAC' ? '¡Copiado!' : 'Copiar'}
                                                            </button>
                                                        </div>
                                                        <p className="text-gray-700">Titular: Samara Brunch and Cake S DE RL</p>

                                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                                            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">
                                                                Comprobante de Transferencia *
                                                            </label>
                                                            <input
                                                                ref={fileInputRef}
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={async (e) => {
                                                                    if (e.target.files && e.target.files[0]) {
                                                                        const file = e.target.files[0];
                                                                        setTransferImage(file);
                                                                        setTransferVerification(null);
                                                                        setFormErrors(prev => ({ ...prev, transferImage: undefined }));
                                                                        setUploadError(null);
                                                                        setUploadedImageUrl('');

                                                                        // Start OCR immediately on the file (client-side, no API needed)
                                                                        setIsVerifying(true);
                                                                        runOCR(file, totalPrice + deliveryPrice)
                                                                            .then(result => setTransferVerification(result))
                                                                            .catch(() => {})
                                                                            .finally(() => setIsVerifying(false));

                                                                        // Upload in parallel
                                                                        setIsUploading(true);
                                                                        try {
                                                                            const compressedImage = await compressImage(file);
                                                                            // Generate unique filename to prevent conflicts
                                                                            const timestamp = Date.now();
                                                                            const uniqueName = `${timestamp}-${compressedImage.name}`;
                                                                            const blob = await upload(uniqueName, compressedImage, {
                                                                                access: 'public',
                                                                                handleUploadUrl: '/api/upload',
                                                                            });
                                                                            setUploadedImageUrl(blob.url);
                                                                        } catch (error) {
                                                                            console.error('Error uploading image:', error);
                                                                            setUploadError(`Error: ${(error as Error).message}`);
                                                                            setTransferImage(null);
                                                                        }
                                                                        setIsUploading(false);
                                                                    }
                                                                }}
                                                                className="hidden"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => fileInputRef.current?.click()}
                                                                disabled={isUploading}
                                                                className={`w-full p-3 rounded-lg border border-dashed flex items-center justify-center gap-2 transition-all ${isUploading
                                                                    ? 'bg-gray-100 border-gray-300 text-gray-500 cursor-wait'
                                                                    : uploadedImageUrl
                                                                        ? 'bg-green-50 border-green-500 text-green-600'
                                                                        : formErrors.transferImage
                                                                            ? 'bg-red-50 border-red-500 text-red-500'
                                                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hover:border-primary'
                                                                    }`}
                                                            >
                                                                {isUploading ? (
                                                                    <>
                                                                        <div className="w-4 h-4 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin" />
                                                                        <span>Subiendo...</span>
                                                                    </>
                                                                ) : uploadedImageUrl ? (
                                                                    <>
                                                                        <span className="truncate max-w-[200px]">{transferImage?.name || 'Comprobante'}</span>
                                                                        <span className="text-xs bg-green-500/20 px-2 py-0.5 rounded text-green-400">✓ Subido - Cambiar</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Plus size={16} />
                                                                        <span>Subir Comprobante</span>
                                                                    </>
                                                                )}
                                                            </button>
                                                            {formErrors.transferImage && (
                                                                <p className="text-red-500 text-xs mt-1">{formErrors.transferImage}</p>
                                                            )}
                                                            {uploadError && (
                                                                <p className="text-red-500 text-xs mt-1 font-bold">{uploadError}</p>
                                                            )}
                                                            {isVerifying && (
                                                                <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                                                                    <div className="w-3 h-3 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin" />
                                                                    Verificando comprobante...
                                                                </div>
                                                            )}
                                                            {transferVerification && (
                                                                <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-1.5">
                                                                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">Verificación automática</p>
                                                                    <div className="flex items-center gap-2 text-xs">
                                                                        {transferVerification.isToday === true ? (
                                                                            <span className="text-green-600 font-semibold">✓ Fecha: hoy</span>
                                                                        ) : transferVerification.isToday === false ? (
                                                                            <span className="text-red-600 font-semibold">✗ Fecha detectada: {transferVerification.detectedDate} — no es de hoy</span>
                                                                        ) : (
                                                                            <span className="text-gray-400">— Fecha no detectada en la imagen</span>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex items-center gap-2 text-xs">
                                                                        {transferVerification.amountMatches === true ? (
                                                                            <span className="text-green-600 font-semibold">✓ Monto: L. {transferVerification.detectedAmount?.toFixed(2)} correcto</span>
                                                                        ) : transferVerification.amountMatches === false ? (
                                                                            <span className="text-red-600 font-semibold">✗ Monto detectado: L. {transferVerification.detectedAmount?.toFixed(2)} — se esperaba L. {(totalPrice + deliveryPrice).toFixed(2)}</span>
                                                                        ) : (
                                                                            <span className="text-gray-400">— Monto no detectado en la imagen</span>
                                                                        )}
                                                                    </div>
                                                                    {(transferVerification.isToday === false || transferVerification.amountMatches === false) && (
                                                                        <p className="text-red-500 text-xs mt-1 font-medium">⚠️ Por favor verifica que el comprobante sea correcto antes de continuar.</p>
                                                                    )}
                                                                </div>
                                                            )}

                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Tarjetas (BAC Compra Click) - Info message */}
                                            {customer?.paymentMethod === 'bac_compra_click' && (
                                                <div className="mt-3 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                                                    <p className="text-blue-600 font-bold mb-2">Pago con Tarjeta</p>
                                                    <p className="text-gray-700 text-sm">
                                                        Al enviar tu pedido por WhatsApp, te generaremos un link de pago seguro para completar tu compra.
                                                    </p>
                                                    <p className="text-gray-500 text-xs mt-2">
                                                        Podrás pagar con cualquier tarjeta de crédito o débito.
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Bono de regalo */}
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-3">¿Tienes un bono de regalo para redimir?</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => { setHasBono(true); setFormErrors(prev => ({ ...prev, bono: undefined })); }}
                                                    className={`p-3 rounded-lg border flex flex-col items-center gap-1 transition-all text-sm ${
                                                        hasBono === true
                                                            ? 'bg-primary text-white border-primary shadow-md'
                                                            : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <span className="font-bold text-xs">Sí, tengo un bono</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => { setHasBono(false); setFormErrors(prev => ({ ...prev, bono: undefined, bonoEmail: undefined, bonoIdentity: undefined })); }}
                                                    className={`p-3 rounded-lg border flex flex-col items-center gap-1 transition-all text-sm ${
                                                        hasBono === false
                                                            ? 'bg-primary text-white border-primary shadow-md'
                                                            : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <span className="font-bold text-xs">No, continuar</span>
                                                </button>
                                            </div>
                                            {formErrors.bono && <p className="text-red-500 text-xs mt-2">{formErrors.bono}</p>}

                                            {hasBono === true && (
                                                <div className="mt-4 space-y-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                                                    <p className="text-sm text-amber-800 font-semibold">Para canjear tu bono necesitamos verificar:</p>

                                                    {/* Screenshot del correo del bono */}
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Screenshot del correo del bono *</label>
                                                        <input
                                                            ref={bonoEmailInputRef}
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={async (e) => {
                                                                if (e.target.files && e.target.files[0]) {
                                                                    const file = e.target.files[0];
                                                                    setBonoEmailFile(file);
                                                                    setFormErrors(prev => ({ ...prev, bonoEmail: undefined }));
                                                                    setIsUploadingBonoEmail(true);
                                                                    try {
                                                                        const compressedImage = await compressImage(file);
                                                                        const timestamp = Date.now();
                                                                        const uniqueName = `bono-email-${timestamp}-${compressedImage.name}`;
                                                                        const blob = await upload(uniqueName, compressedImage, {
                                                                            access: 'public',
                                                                            handleUploadUrl: '/api/upload',
                                                                        });
                                                                        setUploadedBonoEmailUrl(blob.url);
                                                                    } catch (error) {
                                                                        console.error('Error uploading bono email:', error);
                                                                        setBonoEmailFile(null);
                                                                    }
                                                                    setIsUploadingBonoEmail(false);
                                                                }
                                                            }}
                                                            className="hidden"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => bonoEmailInputRef.current?.click()}
                                                            disabled={isUploadingBonoEmail}
                                                            className={`w-full p-3 rounded-lg border border-dashed flex items-center justify-center gap-2 transition-all text-sm ${
                                                                isUploadingBonoEmail
                                                                    ? 'bg-gray-100 border-gray-300 text-gray-500 cursor-wait'
                                                                    : uploadedBonoEmailUrl
                                                                        ? 'bg-green-50 border-green-500 text-green-600'
                                                                        : formErrors.bonoEmail
                                                                            ? 'bg-red-50 border-red-500 text-red-500'
                                                                            : 'bg-white border-amber-300 text-amber-700 hover:bg-amber-50'
                                                            }`}
                                                        >
                                                            {isUploadingBonoEmail ? (
                                                                <><div className="w-4 h-4 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin" /><span>Subiendo...</span></>
                                                            ) : uploadedBonoEmailUrl ? (
                                                                <><span className="truncate max-w-[200px]">{bonoEmailFile?.name || 'Correo del bono'}</span><span className="text-xs bg-green-500/20 px-2 py-0.5 rounded text-green-600">✓ Subido - Cambiar</span></>
                                                            ) : (
                                                                <><Plus size={16} /><span>Subir screenshot del correo</span></>
                                                            )}
                                                        </button>
                                                        {formErrors.bonoEmail && <p className="text-red-500 text-xs mt-1">{formErrors.bonoEmail}</p>}
                                                    </div>

                                                    {/* Documento de identidad */}
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Documento de Identidad *</label>
                                                        <input
                                                            ref={bonoIdentityInputRef}
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={async (e) => {
                                                                if (e.target.files && e.target.files[0]) {
                                                                    const file = e.target.files[0];
                                                                    setBonoIdentityFile(file);
                                                                    setFormErrors(prev => ({ ...prev, bonoIdentity: undefined }));
                                                                    setIsUploadingBonoIdentity(true);
                                                                    try {
                                                                        const compressedImage = await compressImage(file);
                                                                        const timestamp = Date.now();
                                                                        const uniqueName = `bono-id-${timestamp}-${compressedImage.name}`;
                                                                        const blob = await upload(uniqueName, compressedImage, {
                                                                            access: 'public',
                                                                            handleUploadUrl: '/api/upload',
                                                                        });
                                                                        setUploadedBonoIdentityUrl(blob.url);
                                                                    } catch (error) {
                                                                        console.error('Error uploading identity doc:', error);
                                                                        setBonoIdentityFile(null);
                                                                    }
                                                                    setIsUploadingBonoIdentity(false);
                                                                }
                                                            }}
                                                            className="hidden"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => bonoIdentityInputRef.current?.click()}
                                                            disabled={isUploadingBonoIdentity}
                                                            className={`w-full p-3 rounded-lg border border-dashed flex items-center justify-center gap-2 transition-all text-sm ${
                                                                isUploadingBonoIdentity
                                                                    ? 'bg-gray-100 border-gray-300 text-gray-500 cursor-wait'
                                                                    : uploadedBonoIdentityUrl
                                                                        ? 'bg-green-50 border-green-500 text-green-600'
                                                                        : formErrors.bonoIdentity
                                                                            ? 'bg-red-50 border-red-500 text-red-500'
                                                                            : 'bg-white border-amber-300 text-amber-700 hover:bg-amber-50'
                                                            }`}
                                                        >
                                                            {isUploadingBonoIdentity ? (
                                                                <><div className="w-4 h-4 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin" /><span>Subiendo...</span></>
                                                            ) : uploadedBonoIdentityUrl ? (
                                                                <><span className="truncate max-w-[200px]">{bonoIdentityFile?.name || 'Documento de identidad'}</span><span className="text-xs bg-green-500/20 px-2 py-0.5 rounded text-green-600">✓ Subido - Cambiar</span></>
                                                            ) : (
                                                                <><Plus size={16} /><span>Subir documento de identidad</span></>
                                                            )}
                                                        </button>
                                                        {formErrors.bonoIdentity && <p className="text-red-500 text-xs mt-1">{formErrors.bonoIdentity}</p>}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Notes at the end */}
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Notas (Opcional)</label>
                                            <textarea
                                                className="w-full bg-white border border-gray-200 rounded-lg p-3 text-foreground focus:outline-none focus:border-primary transition-colors min-h-[100px]"
                                                placeholder="Cualquier indicación especial para tu pedido"
                                                value={customer?.notes || ''}
                                                onChange={(e) => onCustomerChange('notes', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-gray-100 bg-gray-50">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <span>Subtotal</span>
                                        <span className="font-mono text-gray-900">L. {totalPrice.toFixed(2)}</span>
                                    </div>
                                    {deliveryMethod === 'delivery' && (
                                        <div className="flex items-center justify-between text-sm text-gray-500">
                                            <span>Envío</span>
                                            <span className="font-mono text-gray-900">{deliveryPrice > 0 ? `L. ${deliveryPrice.toFixed(2)}` : 'Por calcular'}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between text-xl font-black uppercase pt-4 border-t border-dashed border-gray-300">
                                        <span className="text-foreground">Total</span>
                                        <span className="text-primary">L. {(totalPrice + deliveryPrice).toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="mt-6">

                                    {currentStep === 'cart' ? (
                                        <button
                                            type="button"
                                            onClick={goToCheckout}
                                            className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-accent transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] uppercase tracking-wide border border-transparent"
                                        >
                                            Continuar con el Pedido
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            form="checkout-form"
                                            disabled={isUploading || isSubmitting || isUploadingBonoEmail || isUploadingBonoIdentity || isVerifying || transferVerification?.isToday === false || transferVerification?.amountMatches === false}
                                            className={`w-full font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] uppercase tracking-wide flex items-center justify-center gap-2 border border-transparent ${isUploading || isSubmitting || transferVerification?.isToday === false || transferVerification?.amountMatches === false
                                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                                                : 'bg-green-600 text-white hover:bg-green-700'
                                                }`}
                                        >
                                            {isUploading ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                                                    Subiendo comprobante...
                                                </>
                                            ) : isSubmitting ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                                                    Abriendo WhatsApp...
                                                </>
                                            ) : (
                                                <>
                                                    <Send size={20} />
                                                    Enviar Pedido por WhatsApp
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )
            }
        </AnimatePresence >
    );
}

