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
    const { setIsOpen: setCartOpen, totalItems } = useCart();
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
            <nav
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                    scrolled
                        ? "bg-white shadow-md py-2"
                        : "bg-white/95 backdrop-blur-sm py-4"
                )}
            >
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center h-12">
                        {/* Left Navigation - Desktop */}
                        <div className="hidden md:flex items-center space-x-8 flex-1">
                            {leftLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={resolveLink(link.link)}
                                    onClick={(e) => handleNavClick(e, link.link)}
                                    className="text-foreground hover:text-primary transition-colors font-semibold uppercase tracking-wide text-sm"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Center Spacer for Logo */}
                        <div className="hidden md:block w-32" />

                        {/* Right Navigation - Desktop */}
                        <div className="hidden md:flex items-center justify-end space-x-8 flex-1">
                            {rightLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={resolveLink(link.link)}
                                    onClick={(e) => handleNavClick(e, link.link)}
                                    className="text-foreground hover:text-primary transition-colors font-semibold uppercase tracking-wide text-sm"
                                >
                                    {link.label}
                                </Link>
                            ))}

                            <button
                                onClick={() => setCartOpen(true)}
                                className="relative text-foreground hover:text-primary transition-colors"
                            >
                                <ShoppingCart size={22} />
                                {totalItems > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        {totalItems}
                                    </span>
                                )}
                            </button>

                            <a
                                href="/menu"
                                className="bg-primary text-white px-6 py-2.5 rounded-full font-bold uppercase text-sm hover:bg-accent transition-all shadow-lg hover:shadow-xl hover:scale-105"
                            >
                                ¡Pide Ahora!
                            </a>
                        </div>

                        {/* Mobile - Cart & Menu */}
                        <div className="md:hidden flex items-center gap-4 ml-auto">
                            <button
                                onClick={() => setCartOpen(true)}
                                className="text-foreground hover:text-primary transition-colors relative"
                            >
                                <ShoppingCart size={24} />
                                {totalItems > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        {totalItems}
                                    </span>
                                )}
                            </button>
                            <button
                                className="text-foreground"
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
                            className="md:hidden bg-white overflow-hidden border-t border-gray-100"
                        >
                            <div className="flex flex-col items-center py-8 space-y-6">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.label}
                                        href={resolveLink(link.link)}
                                        onClick={(e) => handleNavClick(e, link.link)}
                                        className="text-xl font-semibold uppercase text-foreground hover:text-primary transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <a
                                    href="/menu"
                                    className="bg-primary text-white px-8 py-3 rounded-full font-bold uppercase text-sm hover:bg-accent transition-all shadow-lg"
                                >
                                    ¡Pide Ahora!
                                </a>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Floating Center Logo - Fixed Position */}
            <Link
                href="/"
                className={cn(
                    "fixed left-1/2 -translate-x-1/2 z-[60] transition-all duration-300",
                    scrolled ? "top-1" : "top-6"
                )}
            >
                <div className={cn(
                    "bg-white rounded-full shadow-xl border-[3px] border-primary flex items-center justify-center transition-all duration-300",
                    scrolled ? "w-14 h-14" : "w-20 h-20"
                )}>
                    <Image
                        src="/nayos_logo.jpg"
                        alt="Nayos"
                        width={scrolled ? 48 : 72}
                        height={scrolled ? 48 : 72}
                        className="object-contain rounded-full"
                    />
                </div>
            </Link>
        </>
    );
}
