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


import { useRouter } from 'next/navigation';

export default function CartModal({ settings }: { settings?: any }) {
    const { items, isOpen, setIsOpen, removeFromCart, updateQuantity, totalPrice, customer, setCustomer, deliveryMethod, setDeliveryMethod, deliveryPrice, setDeliveryPrice } = useCart();
    const [currentStep, setCurrentStep] = useState<'cart' | 'checkout'>('cart');
    const [isHydrated, setIsHydrated] = useState(false);
    const [formErrors, setFormErrors] = useState<{ name?: string, phone?: string, address?: string, paymentMethod?: string, transferImage?: string }>({});
    const [transferImage, setTransferImage] = useState<File | null>(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
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
        const errors: { name?: string, phone?: string, address?: string, paymentMethod?: string, transferImage?: string } = {};

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
            if (item.selectedOptions && Object.keys(item.selectedOptions).length > 0) {
                Object.entries(item.selectedOptions).forEach(([optionName, values]) => {
                    message += `  ${optionName}: ${values.join(', ')}\n`;
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
            if (customer.paymentMethod === 'cash') {
                message += `Efectivo\n`;
                if (customer.cashChange) {
                    message += `Cambio: ${customer.cashChange}\n`;
                }
            } else if (customer.paymentMethod === 'transfer') {
                message += `Transferencia Bancaria\n`;
                if (customer.selectedBank) {
                    message += `Banco: ${customer.selectedBank}\n\n`;

                    // Include bank account details
                    if (customer.selectedBank === 'BAC') {
                        message += `*Cuenta BAC:* 727269691\n`;
                        message += `Titular: JHOEL JONES VELASQUEZ\n`;
                        message += `ID: 0101199500756\n`;
                    } else if (customer.selectedBank === 'FICOHSA') {
                        message += `*Cuenta FICOHSA:* 200015920881\n`;
                        message += `Titular: JHOEL JONES VELASQUEZ\n`;
                        message += `ID: 0101199500756\n`;
                    } else if (customer.selectedBank === 'BANPAIS') {
                        message += `*Cuenta BANPAIS:* 216170056146\n`;
                        message += `Titular: JHOEL JONES VELASQUEZ\n`;
                        message += `ID: 0101199500756\n`;
                    } else if (customer.selectedBank === 'ATLANTIDA') {
                        message += `*Cuenta ATLÁNTIDA:* 2020653689\n`;
                        message += `Titular: JHOEL VELASQUEZ GOUGH\n`;
                        message += `ID: 0101199500756\n`;
                    }
                }
            } else if (customer.paymentMethod === 'bac_compra_click') {
                message += `Pago con Tarjeta\n`;
                message += `(Por favor generar link de pago)\n`;
            }
            message += '\n';
        }

        if (imageUrl) {
            message += `*Comprobante de Transferencia:*\n${imageUrl}\n\n`;
        }

        // Remove emojis from the entire message
        message = removeEmojis(message);

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');
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
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-secondary z-50 shadow-2xl flex flex-col border-l border-white/10"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-black/20">
                            <div className="flex items-center gap-4">
                                {currentStep === 'checkout' && (
                                    <button onClick={goBackToCart} className="text-gray-400 hover:text-white transition-colors">
                                        <ArrowLeft size={24} />
                                    </button>
                                )}
                                <h2 className="text-2xl font-black text-white uppercase tracking-wide">
                                    {currentStep === 'cart' ? 'Tu Carrito' : 'Información de Envío'}
                                </h2>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6">
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
                                                className="bg-black/40 rounded-xl p-4 flex gap-4 border border-white/5"
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
                                                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                                                            <ShoppingCart size={24} />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-white font-bold text-sm truncate uppercase tracking-wide">{item.name}</h3>
                                                    {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                                                        <div className="text-gray-400 text-xs mt-1">
                                                            {Object.entries(item.selectedOptions).map(([optionName, values]) => (
                                                                <div key={optionName}>{optionName}: {values.join(', ')}</div>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {item.specialInstructions && (
                                                        <div className="text-gray-400 text-xs mt-1">
                                                            Indicaciones: {item.specialInstructions}
                                                        </div>
                                                    )}
                                                    <p className="text-primary font-bold text-sm mt-1">
                                                        L. {item.price.toFixed(2)}
                                                    </p>

                                                    <div className="flex items-center gap-3 mt-3">
                                                        <div className="flex items-center bg-gray-800 rounded-full">
                                                            <button
                                                                onClick={() => updateQuantity(item.id || item._id || '', item.quantity - 1)}
                                                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                                                            >
                                                                <Minus size={14} />
                                                            </button>
                                                            <span className="text-white font-bold text-sm w-4 text-center">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                onClick={() => updateQuantity(item.id || item._id || '', item.quantity + 1)}
                                                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                                                            >
                                                                <Plus size={14} />
                                                            </button>
                                                        </div>
                                                        <button
                                                            onClick={() => removeFromCart(item.id || item._id || '')}
                                                            className="ml-auto text-gray-500 hover:text-red-500 transition-colors"
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
                                                ? 'bg-primary text-black border-primary'
                                                : 'bg-black/40 text-gray-400 border-white/10 hover:bg-white/5'
                                                }`}
                                        >
                                            <span className="font-bold uppercase">A Domicilio</span>
                                            <span className="text-xs opacity-75">Envío calculado</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setDeliveryMethod('pickup');
                                                setDeliveryPrice(0);
                                            }}
                                            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${deliveryMethod === 'pickup'
                                                ? 'bg-primary text-black border-primary'
                                                : 'bg-black/40 text-gray-400 border-white/10 hover:bg-white/5'
                                                }`}
                                        >
                                            <span className="font-bold uppercase">Pickup</span>
                                            <span className="text-xs opacity-75">Recoger en restaurante</span>
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre Completo</label>
                                            <input
                                                className={`w-full bg-black/40 border rounded-lg p-3 text-white focus:outline-none transition-colors ${formErrors.name ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-primary'
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
                                                className={`w-full bg-black/40 border rounded-lg p-3 text-white focus:outline-none transition-colors ${formErrors.phone ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-primary'
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
                                                            className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white/70 cursor-not-allowed"
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
                                                    <div className="mt-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                                        <p className="text-blue-400 text-sm flex justify-between">
                                                            <span>Costo de envío estimado:</span>
                                                            <span className="font-bold text-white">{formatPrice(deliveryPrice)}</span>
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Payment Method */}
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Método de Pago *</label>
                                            <div className="grid grid-cols-3 gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => onCustomerChange('paymentMethod', 'cash')}
                                                    className={`p-3 rounded-lg border flex flex-col items-center gap-1 transition-all text-sm ${customer?.paymentMethod === 'cash'
                                                        ? 'bg-primary text-black border-primary'
                                                        : 'bg-black/40 text-gray-400 border-white/10 hover:bg-white/5'
                                                        }`}
                                                >
                                                    <span className="font-bold text-xs">Efectivo</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => onCustomerChange('paymentMethod', 'transfer')}
                                                    className={`p-3 rounded-lg border flex flex-col items-center gap-1 transition-all text-sm ${customer?.paymentMethod === 'transfer'
                                                        ? 'bg-primary text-black border-primary'
                                                        : 'bg-black/40 text-gray-400 border-white/10 hover:bg-white/5'
                                                        }`}
                                                >
                                                    <span className="font-bold text-xs">Transferencia</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => onCustomerChange('paymentMethod', 'bac_compra_click')}
                                                    className={`p-3 rounded-lg border flex flex-col items-center gap-1 transition-all text-sm ${customer?.paymentMethod === 'bac_compra_click'
                                                        ? 'bg-primary text-black border-primary'
                                                        : 'bg-black/40 text-gray-400 border-white/10 hover:bg-white/5'
                                                        }`}
                                                >
                                                    <span className="font-bold text-xs">Tarjetas</span>
                                                </button>
                                            </div>
                                            {formErrors.paymentMethod && <p className="text-red-500 text-xs mt-2">{formErrors.paymentMethod}</p>}

                                            {/* Cash - Ask for change */}
                                            {customer?.paymentMethod === 'cash' && (
                                                <div className="mt-3">
                                                    <label className="block text-xs font-bold text-gray-400 mb-2">¿Necesita cambio? ¿De cuánto?</label>
                                                    <input
                                                        type="text"
                                                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary transition-colors"
                                                        placeholder="Ej: Sí, de L. 500"
                                                        value={customer?.cashChange || ''}
                                                        onChange={(e) => onCustomerChange('cashChange', e.target.value)}
                                                    />
                                                </div>
                                            )}

                                            {/* Transfer - Bank selection and info */}
                                            {customer?.paymentMethod === 'transfer' && (
                                                <div className="mt-3 space-y-3">
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-400 mb-2">Seleccione el banco</label>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {['BAC', 'FICOHSA', 'BANPAIS', 'ATLANTIDA'].map((bank) => (
                                                                <button
                                                                    key={bank}
                                                                    type="button"
                                                                    onClick={() => onCustomerChange('selectedBank', bank)}
                                                                    className={`p-2 rounded-lg border text-sm transition-all ${customer?.selectedBank === bank
                                                                        ? 'bg-blue-600 text-white border-blue-600'
                                                                        : 'bg-black/40 text-gray-400 border-white/10 hover:bg-white/5'
                                                                        }`}
                                                                >
                                                                    {bank}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Bank account info */}
                                                    {customer?.selectedBank && (
                                                        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm">
                                                            <p className="text-blue-400 font-bold mb-2">Datos de {customer.selectedBank}:</p>
                                                            {customer.selectedBank === 'BAC' && (
                                                                <>
                                                                    <div className="flex items-center justify-between mb-1">
                                                                        <p className="text-white flex-1">Cuenta: <span className="font-mono">727269691</span></p>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                navigator.clipboard.writeText('727269691');
                                                                                setCopiedAccount('BAC');
                                                                                setTimeout(() => setCopiedAccount(null), 2000);
                                                                            }}
                                                                            className={`text-xs px-2 py-1 rounded transition-colors ${copiedAccount === 'BAC' ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
                                                                        >
                                                                            {copiedAccount === 'BAC' ? '¡Copiado!' : 'Copiar'}
                                                                        </button>
                                                                    </div>
                                                                    <p className="text-white">Titular: JHOEL JONES VELASQUEZ</p>
                                                                    <p className="text-gray-400 text-xs">ID: 0101199500756</p>
                                                                </>
                                                            )}
                                                            {customer.selectedBank === 'FICOHSA' && (
                                                                <>
                                                                    <div className="flex items-center justify-between mb-1">
                                                                        <p className="text-white flex-1">Cuenta: <span className="font-mono">200015920881</span></p>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                navigator.clipboard.writeText('200015920881');
                                                                                setCopiedAccount('FICOHSA');
                                                                                setTimeout(() => setCopiedAccount(null), 2000);
                                                                            }}
                                                                            className={`text-xs px-2 py-1 rounded transition-colors ${copiedAccount === 'FICOHSA' ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
                                                                        >
                                                                            {copiedAccount === 'FICOHSA' ? '¡Copiado!' : 'Copiar'}
                                                                        </button>
                                                                    </div>
                                                                    <p className="text-white">Titular: JHOEL JONES VELASQUEZ</p>
                                                                    <p className="text-gray-400 text-xs">ID: 0101199500756</p>
                                                                </>
                                                            )}
                                                            {customer.selectedBank === 'BANPAIS' && (
                                                                <>
                                                                    <div className="flex items-center justify-between mb-1">
                                                                        <p className="text-white flex-1">Cuenta: <span className="font-mono">216170056146</span></p>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                navigator.clipboard.writeText('216170056146');
                                                                                setCopiedAccount('BANPAIS');
                                                                                setTimeout(() => setCopiedAccount(null), 2000);
                                                                            }}
                                                                            className={`text-xs px-2 py-1 rounded transition-colors ${copiedAccount === 'BANPAIS' ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
                                                                        >
                                                                            {copiedAccount === 'BANPAIS' ? '¡Copiado!' : 'Copiar'}
                                                                        </button>
                                                                    </div>
                                                                    <p className="text-white">Titular: JHOEL JONES VELASQUEZ</p>
                                                                    <p className="text-gray-400 text-xs">ID: 0101199500756</p>
                                                                </>
                                                            )}
                                                            {customer.selectedBank === 'ATLANTIDA' && (
                                                                <>
                                                                    <div className="flex items-center justify-between mb-1">
                                                                        <p className="text-white flex-1">Cuenta: <span className="font-mono">2020653689</span></p>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                navigator.clipboard.writeText('2020653689');
                                                                                setCopiedAccount('ATLANTIDA');
                                                                                setTimeout(() => setCopiedAccount(null), 2000);
                                                                            }}
                                                                            className={`text-xs px-2 py-1 rounded transition-colors ${copiedAccount === 'ATLANTIDA' ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
                                                                        >
                                                                            {copiedAccount === 'ATLANTIDA' ? '¡Copiado!' : 'Copiar'}
                                                                        </button>
                                                                    </div>
                                                                    <p className="text-white">Titular: JHOEL VELASQUEZ GOUGH</p>
                                                                    <p className="text-gray-400 text-xs">ID: 0101199500756</p>
                                                                </>
                                                            )}

                                                            <div className="mt-4 pt-4 border-t border-blue-500/20">
                                                                <label className="block text-xs font-bold text-white mb-2 uppercase">
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
                                                                            setFormErrors(prev => ({ ...prev, transferImage: undefined }));
                                                                            setUploadError(null);
                                                                            setUploadedImageUrl('');

                                                                            // Upload immediately
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
                                                                                console.log('Image uploaded successfully:', blob.url);
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
                                                                        ? 'bg-gray-500/20 border-gray-500 text-gray-400 cursor-wait'
                                                                        : uploadedImageUrl
                                                                            ? 'bg-green-500/20 border-green-500 text-green-400'
                                                                            : formErrors.transferImage
                                                                                ? 'bg-red-500/10 border-red-500 text-red-400'
                                                                                : 'bg-black/20 border-white/20 text-gray-400 hover:bg-white/5 hover:border-white/40'
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
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Tarjetas (BAC Compra Click) - Info message */}
                                            {customer?.paymentMethod === 'bac_compra_click' && (
                                                <div className="mt-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                                    <p className="text-blue-400 font-bold mb-2">Pago con Tarjeta</p>
                                                    <p className="text-white text-sm">
                                                        Al enviar tu pedido por WhatsApp, te generaremos un link de pago seguro para completar tu compra.
                                                    </p>
                                                    <p className="text-gray-400 text-xs mt-2">
                                                        Podrás pagar con cualquier tarjeta de crédito o débito.
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Notes at the end */}
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Notas (Opcional)</label>
                                            <textarea
                                                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary transition-colors min-h-[100px]"
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
                            <div className="p-6 border-t border-white/10 bg-black/20 space-y-4">
                                <div className="flex items-center justify-between text-sm text-gray-400">
                                    <span>Subtotal</span>
                                    <span>L. {totalPrice.toFixed(2)}</span>
                                </div>
                                {deliveryMethod === 'delivery' && (
                                    <div className="flex items-center justify-between text-sm text-gray-400">
                                        <span>Envío</span>
                                        <span>{deliveryPrice > 0 ? `L. ${deliveryPrice.toFixed(2)}` : 'Por calcular'}</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between text-xl font-black uppercase pt-2 border-t border-white/10">
                                    <span className="text-white">Total</span>
                                    <span className="text-primary">L. {(totalPrice + deliveryPrice).toFixed(2)}</span>
                                </div>

                                {currentStep === 'cart' ? (
                                    <button
                                        type="button"
                                        onClick={goToCheckout}
                                        className="w-full bg-primary text-black font-bold py-4 rounded-xl hover:bg-accent transition-colors uppercase tracking-wide"
                                    >
                                        Continuar con el Pedido
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        form="checkout-form"
                                        disabled={isUploading}
                                        className={`w-full font-bold py-4 rounded-xl transition-colors uppercase tracking-wide flex items-center justify-center gap-2 ${isUploading
                                            ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                                            : 'bg-green-600 text-white hover:bg-green-500'
                                            }`}
                                    >
                                        {isUploading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Enviando...
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
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
