"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";

interface NavbarProps {
    settings?: {
        navigation?: {
            menuItems?: Array<{ label: string; link: string }>;
        };
        logo?: any;
        socialMedia?: {
            facebook?: string;
            instagram?: string;
        };
    };
}

export default function Navbar({ settings }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { setIsOpen: setCartOpen, totalItems, isOpen: isCartOpen } = useCart();
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const defaultNavLinks = [
        { label: "Inicio", link: "/" },
        { label: "Menú", link: "/menu" },
        { label: "Nosotros", link: "#about" },
        { label: "Contacto", link: "#contact" },
    ];

    const navLinks = settings?.navigation?.menuItems || defaultNavLinks;
    const leftLinks = navLinks.slice(0, 2);
    const rightLinks = navLinks.slice(2);

    const resolveLink = (link: string) => {
        if (link.startsWith('#')) {
            if (pathname === '/') return link;
            return `/${link}`;
        }
        return link;
    };

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: string) => {
        if (link.startsWith('#') && pathname === '/') {
            e.preventDefault();
            const element = document.querySelector(link);
            if (element) {
                const yOffset = -100;
                const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
            setIsOpen(false);
        }
    };

    return (
        <>
            {/* Top Burgundy Bar */}
            <div className="top-0 left-0 right-0 z-50 bg-[#9B292C] h-3"></div>

            {/* Main Navbar */}
            <nav className=" top-3 left-0 right-0 z-50 bg-[#FFF8F0] shadow-lg">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        {/* Left - Stacked Navigation Buttons (Desktop) */}
                        <div className="hidden md:flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={resolveLink(link.link)}
                                    onClick={(e) => handleNavClick(e, link.link)}
                                    className="border-2 border-[#9B292C] bg-[#FFF8F0] text-[#9B292C] px-6 py-2 rounded-full font-bold uppercase text-xs hover:bg-[#9B292C] hover:text-white transition-all text-center min-w-[140px]"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Center - Logo */}
                        <Link href="/" className="flex-shrink-0">
                            <Image
                                src="/logo.svg"
                                alt="Nayos"
                                width={400}
                                height={40}
                                className="h-40 w-auto"
                                priority
                            />
                        </Link>

                        {/* Right - Order Button & Cart (Desktop) */}
                        <div className="hidden md:flex items-center gap-4">
                            <button
                                onClick={() => setCartOpen(true)}
                                className="relative text-[#9B292C] hover:text-[#7A2123] transition-colors"
                            >
                                <ShoppingCart size={24} />
                                {totalItems > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-[#9B292C] text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        {totalItems}
                                    </span>
                                )}
                            </button>
                            <a
                                href="/menu"
                                className="bg-[#9B292C] text-white px-8 py-4 rounded-full font-black uppercase text-sm hover:bg-[#7A2123] transition-all shadow-lg hover:shadow-xl hover:scale-105"
                            >
                                ¡Ordena Ahora!
                            </a>
                        </div>

                        {/* Mobile - Cart & Menu */}
                        <div className="md:hidden flex items-center gap-4">
                            <button
                                onClick={() => setCartOpen(true)}
                                className="text-[#9B292C] hover:text-[#7A2123] transition-colors relative"
                            >
                                <ShoppingCart size={24} />
                                {totalItems > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-[#9B292C] text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        {totalItems}
                                    </span>
                                )}
                            </button>
                            <button
                                className="text-[#9B292C]"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                {isOpen ? <X size={28} /> : <Menu size={28} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-[#FFF8F0] overflow-hidden border-t-2 border-[#9B292C]"
                        >
                            <div className="flex flex-col items-center py-8 space-y-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.label}
                                        href={resolveLink(link.link)}
                                        onClick={(e) => handleNavClick(e, link.link)}
                                        className="border-2 border-[#9B292C] bg-[#FFF8F0] text-[#9B292C] px-8 py-2 rounded-full font-bold uppercase text-sm hover:bg-[#9B292C] hover:text-white transition-all w-48 text-center"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <a
                                    href="/menu"
                                    className="bg-[#9B292C] text-white px-8 py-3 rounded-full font-black uppercase text-sm hover:bg-[#7A2123] transition-all shadow-lg w-48 text-center"
                                >
                                    ¡Ordena Ahora!
                                </a>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </>
    );
}
