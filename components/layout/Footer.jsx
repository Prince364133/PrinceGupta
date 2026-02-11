// components/layout/Footer.jsx
'use client';

import Link from 'next/link';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaEnvelope, FaArrowUp } from 'react-icons/fa';
import { trackButtonClick } from '@/lib/firebase/analytics';
import NewsletterSignup from '@/components/ui/NewsletterSignup';

const socialLinks = [
    { name: 'GitHub', icon: FaGithub, url: 'https://github.com/Prince364133' },
    { name: 'Instagram', icon: FaInstagram, url: 'https://instagram.com/prince_gupta3608' },
    { name: 'Email', icon: FaEnvelope, url: 'mailto:contact@princekumar.dev' },
];

const quickLinks = [
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Skills', path: '/skills' },
    { name: 'Experience', path: '/experience' },
];

const resourceLinks = [
    { name: 'Blog', path: '/blog' },
    { name: 'Resume', path: '/resume' },
    { name: 'Startups', path: '/startups' },
    { name: 'Contact', path: '/contact' },
];

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const handleSocialClick = (platform) => {
        trackButtonClick(`social_${platform.toLowerCase()}`, 'footer');
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-[#050505] border-t border-white/5 mt-20">
            <div className="container-custom py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand & Description */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-white tracking-tight">Prince Kumar</h3>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                            Full-stack developer and entrepreneur building innovative solutions and launching successful startups.
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-4">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.name}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => handleSocialClick(social.name)}
                                        className="p-3 bg-white/5 hover:bg-primary hover:text-white text-gray-400 rounded-full transition-all duration-300 hover:scale-110"
                                        aria-label={social.name}
                                    >
                                        <Icon className="w-4 h-4" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Quick Links</h4>
                        <div className="flex flex-col gap-3">
                            {quickLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    href={link.path}
                                    className="text-gray-400 hover:text-primary transition-colors text-sm hover:translate-x-1 inline-block duration-200"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Resources</h4>
                        <div className="flex flex-col gap-3">
                            {resourceLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    href={link.path}
                                    className="text-gray-400 hover:text-primary transition-colors text-sm hover:translate-x-1 inline-block duration-200"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Stay Updated</h4>
                        <p className="text-gray-400 text-sm mb-4">
                            Subscribe to get latest updates on projects and tech.
                        </p>
                        <NewsletterSignup source="footer" />
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-center md:text-left">
                            <p className="text-gray-500 text-sm">
                                © {currentYear} Prince Kumar. All rights reserved.
                            </p>
                        </div>

                        <div className="flex items-center gap-6">
                            <button
                                onClick={scrollToTop}
                                className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors group"
                                aria-label="Back to top"
                            >
                                <span className="hidden sm:inline">Back to Top</span>
                                <FaArrowUp className="w-3 h-3 group-hover:-translate-y-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
