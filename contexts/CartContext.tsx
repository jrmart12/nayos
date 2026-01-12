"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface CartItem {
    id?: string;
    _id?: string;
    name: string;
    price: number;
    quantity: number;
    image?: any; // Changed to any to support Sanity images
    description?: string;
    slug?: { current: string } | string;
    unit?: string;
    cutWeight?: string;
    selectedOptions?: Record<string, string[]>;
    specialInstructions?: string;
}

export interface CustomerInfo {
    name?: string;
    phone?: string;
    address?: string;
    notes?: string;
    deliveryCoords?: { lat: number; lng: number };
    paymentMethod?: 'transfer' | 'bac_compra_click';
    cashChange?: never; // Removed
    selectedBank?: 'BAC'; // Restrict to BAC only based on request
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity'>) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    customer?: CustomerInfo | null;
    setCustomer?: (c: CustomerInfo | null) => void;
    deliveryMethod: 'delivery' | 'pickup';
    setDeliveryMethod: (method: 'delivery' | 'pickup') => void;
    deliveryPrice: number;
    setDeliveryPrice: (price: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [isHydrated, setIsHydrated] = useState(false);

    // Load cart from localStorage on initial mount
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    // Customer info (name, phone, address, etc.) persisted to localStorage
    const [customer, setCustomer] = useState<CustomerInfo | null>(null);
    const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
    const [deliveryPrice, setDeliveryPrice] = useState(0);

    // Hydrate from localStorage after component mounts
    useEffect(() => {
        const savedCart = localStorage.getItem('house-kitchen-cart');
        if (savedCart) {
            try {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error('Error loading cart:', e);
            }
        }

        const savedCustomer = localStorage.getItem('house-kitchen-customer');
        if (savedCustomer) {
            try {
                const parsed = JSON.parse(savedCustomer);
                // Only restore name and phone, not address or payment info
                setCustomer({
                    name: parsed.name,
                    phone: parsed.phone,
                });
            } catch (e) {
                console.error('Error loading customer info:', e);
            }
        }

        setIsHydrated(true);
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (isHydrated) {
            if (items.length > 0) {
                localStorage.setItem('house-kitchen-cart', JSON.stringify(items));
            } else {
                localStorage.removeItem('house-kitchen-cart');
            }
        }
    }, [items, isHydrated]);

    // Save customer info to localStorage (only name and phone)
    useEffect(() => {
        if (isHydrated) {
            if (customer && (customer.name || customer.phone)) {
                // Only save name and phone, not address or payment info
                const toSave = {
                    name: customer.name,
                    phone: customer.phone,
                };
                localStorage.setItem('house-kitchen-customer', JSON.stringify(toSave));
            } else {
                localStorage.removeItem('house-kitchen-customer');
            }
        }
    }, [customer, isHydrated]);

    const addToCart = (item: Omit<CartItem, 'quantity'>) => {
        setItems(currentItems => {
            const baseId = item.id || item._id;

            // Create a unique identifier that includes selected options and special instructions
            // This way, the same product with different sauces will be treated as different items
            const optionsKey = item.selectedOptions
                ? JSON.stringify(Object.entries(item.selectedOptions).sort())
                : '';
            const instructionsKey = item.specialInstructions || '';
            const uniqueId = `${baseId}-${optionsKey}-${instructionsKey}`;

            // Find existing item with the SAME options and instructions
            const existingItem = currentItems.find(i => i.id === uniqueId);

            if (existingItem) {
                // Same product with same options - just increase quantity
                return currentItems.map(i =>
                    i.id === uniqueId
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }
            // New product or same product with different options - add as new item
            return [...currentItems, { ...item, id: uniqueId, quantity: 1 }];
        });
        setIsOpen(true); // Open cart when adding item
    };

    const removeFromCart = (id: string) => {
        setItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(id);
            return;
        }
        setItems(currentItems =>
            currentItems.map(item =>
                item.id === id ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    // Parse price string "$12.00" to number if needed, but assuming number for now based on interface
    // If products use strings like "$12.00", we need to handle that.
    // In Products.tsx, price is "$12.00". We should probably store price as number in products or parse it.
    // Let's handle it in addToCart or assume input is number.
    // For now, let's assume the price passed to addToCart is a number.

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalItems,
                totalPrice,
                isOpen,
                setIsOpen,
                customer,
                setCustomer,
                deliveryMethod,
                setDeliveryMethod,
                deliveryPrice,
                setDeliveryPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
