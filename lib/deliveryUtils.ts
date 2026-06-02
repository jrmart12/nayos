
// Bridge coordinates for La Ceiba delivery zones
// These three bridges define the boundaries of the "inside" delivery zone

interface BridgeCoordinate {
    name: string;
    lat: number;
    lng: number;
}

const BRIDGES: BridgeCoordinate[] = [
    { name: 'Puente Danto', lat: 15.7594158, lng: -86.8149412 },      // Westernmost
    { name: 'Puente Saopin', lat: 15.7621218, lng: -86.783392 },      // Middle
    { name: 'Puente Reino de Suecia', lat: 15.7729232, lng: -86.7797647 }  // Easternmost
];

// Delivery prices
const PRICE_INSIDE = 50;  // 50 Lps inside the bridge zone (between the bridges along the coast)
const PRICE_OUTSIDE = 120; // 120 Lps outside the zone (beyond the bridges)

/**
 * Calculate delivery price based on location
 * Logic: The delivery zone is defined by the area BETWEEN the westernmost and easternmost bridges.
 * If the user's longitude is between Puente Danto (west) and Puente Reino de Suecia (east),
 * they are in the 50 Lps zone. Otherwise, they're in the 120 Lps zone.
 * 
 * @param lat - Latitude of delivery location
 * @param lng - Longitude of delivery location  
 * @returns Delivery price in Lempiras (50 inside, 120 outside)
 */
export const calculateDeliveryPrice = (lat: number, lng: number): number => {
    // Get the westernmost and easternmost bridge longitudes
    const westBridge = BRIDGES[0]; // Puente Danto (most negative lng)
    const eastBridge = BRIDGES[2]; // Puente Reino de Suecia (least negative lng)

    // Check if longitude is between the two outer bridges
    // In negative longitude, "between" means: westLng < userLng < eastLng
    // More negative = further west, Less negative = further east
    const isInsideZone = lng > westBridge.lng && lng < eastBridge.lng;

    return isInsideZone ? PRICE_INSIDE : PRICE_OUTSIDE;
};

/**
 * Returns true if today is Monday–Friday (free shipping eligible day)
 */
export const isFreeShippingDay = (): boolean => {
    const day = new Date().getDay(); // 0=Sun, 1=Mon…5=Fri, 6=Sat
    return day >= 1 && day <= 5;
};

/**
 * Apply the Mon–Fri / ≥300 lps promotion to a base delivery price:
 *   - Inside zone (50 lps) → FREE (0)
 *   - Outside zone (120 lps) → 50 lps
 */
export const getEffectiveDeliveryPrice = (basePrice: number, subtotal: number): number => {
    if (subtotal >= 300 && isFreeShippingDay()) {
        if (basePrice === PRICE_INSIDE) return 0;
        if (basePrice === PRICE_OUTSIDE) return PRICE_INSIDE;
    }
    return basePrice;
};

/**
 * Format price as Honduran Lempiras currency
 */
export const formatPrice = (amount: number): string => {
    return new Intl.NumberFormat('es-HN', {
        style: 'currency',
        currency: 'HNL',
    }).format(amount);
};
