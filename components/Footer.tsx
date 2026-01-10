import Link from "next/link";
import { Facebook, Instagram } from "lucide-react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

interface FooterProps {
    settings?: any;
}

export default function Footer({ settings }: FooterProps) {
    const phone = settings?.phone || "(504) 9999-9999";
    const address = settings?.address || "La Ceiba, Atlántida, Honduras";
    const facebook = settings?.socialMedia?.facebook;
    const instagram = settings?.socialMedia?.instagram;
    const logo = settings?.logo;

    return (
        <footer className="bg-[#FFF8F0] border-t border-border py-16">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="mb-6 flex items-center">
                            <Image
                                src="/nayos_logo.png"
                                alt="Nayos Logo"
                                width={160}
                                height={160}
                                className="object-contain mr-3"
                            />
                        </div>
                        <p className="text-muted max-w-md mb-6">
                            Las mejores Smash'd Burgers de La Ceiba. Ingredientes frescos, sabor inigualable, experiencia única.
                        </p>
                        <div className="flex space-x-4">
                            {facebook && (
                                <a href={facebook} target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors">
                                    <Facebook size={24} />
                                </a>
                            )}
                            {instagram && (
                                <a href={instagram} target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors">
                                    <Instagram size={24} />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-foreground font-bold uppercase mb-6 tracking-wide">Enlaces Rápidos</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/" className="text-muted hover:text-primary transition-colors">
                                    Inicio
                                </Link>
                            </li>
                            <li>
                                <Link href="/menu" className="text-muted hover:text-primary transition-colors">
                                    Menú
                                </Link>
                            </li>
                            <li>
                                <Link href="#about" className="text-muted hover:text-primary transition-colors">
                                    Sobre Nosotros
                                </Link>
                            </li>
                            <li>
                                <Link href="#contact" className="text-muted hover:text-primary transition-colors">
                                    Contacto
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-foreground font-bold uppercase mb-6 tracking-wide">Contacto</h4>
                        <ul className="space-y-3 text-muted">
                            <li className="flex items-start">
                                <svg className="w-5 h-5 mr-2 mt-1 shrink-0 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>{address}</span>
                            </li>
                            <li className="pt-2">
                                <a href={`tel:${phone.replace(/\D/g, '')}`} className="hover:text-primary transition-colors flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    {phone}
                                </a>
                            </li>
                        </ul>

                        {/* Hours */}
                        <div className="mt-6 p-4 bg-background rounded-lg border border-border">
                            <h5 className="text-foreground font-semibold mb-2 text-sm uppercase">Horarios</h5>
                            <div className="text-muted text-sm space-y-1">
                                <p>Lun - Sáb: 11:00AM - 9:30PM</p>
                                <p>Domingo: 11:00AM - 8:00PM</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border mt-12 pt-8 text-center text-muted text-sm">
                    <p>&copy; {new Date().getFullYear()} Nayos Burgers. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
