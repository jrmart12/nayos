"use client";
import { useState, useEffect } from 'react';
import { Navigation, Loader2 } from 'lucide-react';

interface LocationPickerProps {
    onLocationSelect: (address: string, coords: { lat: number; lng: number }) => void;
    initialAddress?: string;
}

export default function LocationPicker({ onLocationSelect, initialAddress }: LocationPickerProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [manualAddress, setManualAddress] = useState(initialAddress || '');

    // Detect mobile on mount
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleUseMyLocation = () => {
        if (!navigator.geolocation) {
            alert('Tu navegador no soporta geolocalización');
            return;
        }

        setIsLoading(true);

        const handleSuccess = (position: GeolocationPosition) => {
            const coords = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };

            // Create Google Maps link
            const mapsLink = `https://maps.google.com/?q=${coords.lat},${coords.lng}`;
            const address = `${mapsLink}`;

            onLocationSelect(address, coords);
            setIsLoading(false);
        };

        const handleError = (error: GeolocationPositionError) => {
            console.error('Error getting location:', error);
            
            // If high accuracy failed, try without it (fallback for desktop)
            if (error.code === error.TIMEOUT) {
                navigator.geolocation.getCurrentPosition(
                    handleSuccess,
                    (fallbackError) => {
                        console.error('Fallback location error:', fallbackError);
                        setIsLoading(false);
                        alert('No pudimos obtener tu ubicación. Por favor, intenta de nuevo o ingresa manualmente.');
                    },
                    {
                        enableHighAccuracy: false,
                        timeout: 15000,
                        maximumAge: 60000,
                    }
                );
            } else {
                setIsLoading(false);
                alert('No pudimos obtener tu ubicación. Por favor, intenta de nuevo o ingresa manualmente.');
            }
        };

        navigator.geolocation.getCurrentPosition(
            handleSuccess,
            handleError,
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    };

    const handleManualAddressSubmit = () => {
        if (manualAddress.trim()) {
            // For desktop manual entry, use fixed delivery cost (120 LPS)
            // Pass dummy coords to indicate manual address was used
            onLocationSelect(manualAddress.trim(), { lat: 0, lng: 0 });
        }
    };

    // Mobile: Show geolocation button
    if (isMobile) {
        return (
            <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 disabled:cursor-wait text-white font-bold py-3 px-4 rounded-lg transition-colors text-sm"
            >
                {isLoading ? (
                    <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Obteniendo ubicación...</span>
                    </>
                ) : (
                    <>
                        <Navigation size={18} />
                        <span>Usar Mi Ubicación</span>
                    </>
                )}
            </button>
        );
    }

    // Desktop: Show text input for manual address
    return (
        <div className="space-y-2">
            <input
                type="text"
                value={manualAddress}
                onChange={(e) => setManualAddress(e.target.value)}
                placeholder="Ingrese su dirección completa"
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary transition-colors"
            />
            <button
                type="button"
                onClick={handleManualAddressSubmit}
                disabled={!manualAddress.trim()}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors text-sm"
            >
                <Navigation size={18} />
                <span>Confirmar Dirección</span>
            </button>
            <p className="text-gray-400 text-xs text-center">Envío a domicilio: L. 120</p>
        </div>
    );
}
