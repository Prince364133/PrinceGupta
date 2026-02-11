// components/layout/Navbar.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IoMenu, IoClose } from 'react-icons/io5';
import { trackButtonClick } from '@/lib/firebase/analytics';

const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Skills', path: '/skills' },
    { name: 'Projects', path: '/projects' },
    { name: 'Startups', path: '/startups' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const handleNavClick = (linkName) => {
        trackButtonClick(`nav_${linkName.toLowerCase()}`, 'navbar');
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
            ? 'glass shadow-lg lg:bg-background/70 backdrop-blur-xl border-b border-white/5'
            : 'bg-transparent'
            }`}>
            <div className="container-custom">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="text-2xl font-bold text-gradient hover:scale-105 transition-transform"
                        onClick={() => handleNavClick('logo')}
                    >
                        Prince Kumar
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                href={link.path}
                                onClick={() => handleNavClick(link.name)}
                                className={`text-sm font-medium transition-colors relative group ${pathname === link.path
                                    ? 'text-primary'
                                    : 'text-text-secondary hover:text-white'
                                    }`}
                            >
                                {link.name}
                                <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                                    }`} />
                            </Link>
                        ))}

                        <Link
                            href="/contact"
                            className="btn-primary py-2 px-5 text-sm"
                            onClick={() => handleNavClick('cta_header')}
                        >
                            Get in Touch
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 text-text-primary hover:bg-hover rounded-lg transition-colors z-50 relative"
                    >
                        {isOpen ? <IoClose className="w-6 h-6" /> : <IoMenu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Navigation Overlay */}
                <div className={`fixed inset-0 bg-background/95 backdrop-blur-3xl z-40 transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}>
                    <div className="flex flex-col items-center justify-center h-full gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                href={link.path}
                                onClick={() => handleNavClick(link.name)}
                                className={`text-2xl font-semibold transition-colors ${pathname === link.path
                                    ? 'text-primary'
                                    : 'text-text-secondary hover:text-primary'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
}
