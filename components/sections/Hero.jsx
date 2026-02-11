// components/sections/Hero.jsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import TypeWriter from '@/components/ui/TypeWriter';
import { trackButtonClick } from '@/lib/firebase/analytics';

export default function Hero({ profile }) {
    const handleCTAClick = (cta) => {
        trackButtonClick(`hero_${cta}`, 'homepage');
    };

    // Hero image logic: User profile image -> Local fallback -> Default placeholder
    const heroImage = profile?.heroImage || '/images/profile.png';

    return (
        <section className="min-h-screen flex items-center justify-center pt-20 px-4">
            <div className="container-custom">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="inline-block mb-4 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full text-primary font-mono text-sm"
                        >
                            👋 Welcome to my portfolio
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="text-5xl md:text-7xl font-bold mb-6"
                        >
                            Hi, I'm{' '}
                            <span className="text-gradient">
                                {profile?.name || 'Prince Kumar'}
                            </span>
                        </motion.h1>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="text-2xl md:text-3xl text-text-secondary mb-6 font-mono min-h-[1.5em]"
                        >
                            <TypeWriter
                                words={profile?.roles || ['Developer', 'Entrepreneur', 'Content Creator']}
                                typingSpeed={100}
                                deletingSpeed={50}
                                pauseTime={2000}
                            />
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                            className="text-lg text-text-secondary mb-8 max-w-2xl"
                        >
                            {profile?.bio || 'Building innovative solutions and launching successful startups. Passionate about creating impactful products that solve real-world problems.'}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                            className="flex flex-wrap gap-4"
                        >
                            <Link href="/projects">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    onClick={() => handleCTAClick('view_projects')}
                                >
                                    View Projects
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={() => handleCTAClick('contact')}
                                >
                                    Get in Touch
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Image/Visual */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="relative"
                    >
                        <div className="relative w-full aspect-square max-w-lg mx-auto flex items-center justify-center">
                            {/* Modern Aurora Background Glows */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/20 rounded-full blur-[120px] animate-pulse-slow mix-blend-screen overflow-visible" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-secondary/20 rounded-full blur-[80px] animate-pulse-slow mix-blend-screen overflow-visible" style={{ animationDelay: '1.5s' }} />

                            {/* Floating Character Container */}
                            <motion.div
                                className="relative z-10 w-full h-full flex items-center justify-center p-4 md:p-8"
                                animate={{
                                    y: [0, -20, 0],
                                }}
                                transition={{
                                    duration: 6,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                {heroImage ? (
                                    <div className="relative group">
                                        {/* Subtle glow behind head */}
                                        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary/30 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                        <img
                                            src={heroImage}
                                            alt={profile?.name || 'Prince Kumar'}
                                            className="w-full h-full object-contain filter drop-shadow-[0_20px_50px_rgba(59,130,246,0.3)] select-none"
                                        />
                                    </div>
                                ) : (
                                    <div className="text-9xl font-bold text-gradient filter drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                                        PK
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
