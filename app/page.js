// app/page.js
'use client';

import { useEffect, useState } from 'react';
import Hero from '@/components/sections/Hero';
import ProjectCard from '@/components/sections/ProjectCard';
import LuminousCard from '@/components/ui/LuminousCard';
import Button from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';
import Link from 'next/link';
import TestimonialsSlider from '@/components/ui/TestimonialsSlider';
import StructuredData from '@/components/seo/StructuredData';
import { getAllDocuments } from '@/lib/firebase/firestore';
import { COLLECTIONS } from '@/lib/schema/collections';
import { trackPageView } from '@/lib/firebase/analytics';
import { generatePersonSchema, generateWebSiteSchema } from '@/lib/utils/seo';
import { motion } from 'framer-motion';

export default function HomePage() {
    const [profile, setProfile] = useState(null);
    const [projects, setProjects] = useState([]);
    const [startups, setStartups] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        trackPageView('home', 'Home');
        loadData();
    }, []);

    const loadData = async () => {
        try {
            // Load profile
            const profileDocs = await getAllDocuments(COLLECTIONS.PROFILE);
            if (profileDocs.length > 0) {
                setProfile(profileDocs[0]);
            }

            // Load featured projects
            const projectDocs = await getAllDocuments(COLLECTIONS.PROJECTS, {
                where: { field: 'featured', operator: '==', value: true },
                orderBy: { field: 'order', direction: 'asc' },
                limit: 3,
            });
            setProjects(projectDocs);

            // Load featured startups
            const startupDocs = await getAllDocuments(COLLECTIONS.STARTUPS, {
                where: { field: 'featured', operator: '==', value: true },
                orderBy: { field: 'order', direction: 'asc' },
                limit: 3,
            });
            setStartups(startupDocs);

            // Load featured testimonials
            const testimonialDocs = await getAllDocuments(COLLECTIONS.TESTIMONIALS, {
                where: { field: 'featured', operator: '==', value: true },
                orderBy: { field: 'order', direction: 'asc' },
            });
            setTestimonials(testimonialDocs);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader size="lg" />
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen">
            {profile && <StructuredData schema={generatePersonSchema(profile)} />}
            <StructuredData schema={generateWebSiteSchema()} />

            {/* Grid Background Effect */}
            <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none opacity-20" />

            {/* Hero Section */}
            <Hero profile={profile} />

            {/* Stats Section */}
            <section className="py-20 relative z-10">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <LuminousCard
                            icon="💼"
                            number={profile?.yearsOfExperience || 3}
                            suffix="+"
                            description="Years of Experience"
                            defaultActive={false}
                        />
                        <LuminousCard
                            icon="🚀"
                            number={profile?.projectsCompleted || 50}
                            suffix="+"
                            description="Projects Delivered"
                            defaultActive={true}
                        />
                        <LuminousCard
                            icon="⚡"
                            number={profile?.technologiesMastered || 10}
                            suffix="+"
                            description="Tech Stack Mastered"
                            defaultActive={false}
                        />
                    </div>
                </div>
            </section>

            {/* Featured Projects */}
            {projects.length > 0 && (
                <section className="py-32 relative z-10">
                    <div className="container-custom">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                            <div>
                                <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">
                                    Selected Works
                                </h2>
                                <p className="text-lg text-text-secondary max-w-lg">
                                    A selection of projects that showcase my passion for building high-quality web experiences.
                                </p>
                            </div>
                            <Link href="/projects">
                                <Button variant="outline" className="group">
                                    View All Projects
                                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                                </Button>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                            {projects.map((project, index) => (
                                <ProjectCard key={project.id} project={project} index={index} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Featured Startups */}
            {startups.length > 0 && (
                <section className="py-32 relative z-10 bg-accent/20 border-y border-white/5">
                    <div className="container-custom">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold mb-4">Startups & Ventures</h2>
                            <p className="text-xl text-text-secondary">
                                Building companies, not just code.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {startups.map((startup, index) => (
                                <motion.div
                                    key={startup.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 hover:border-primary/50 transition-all duration-300"
                                >
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl">
                                            {startup.logo ? <img src={startup.logo} className="w-full h-full object-cover rounded-xl" /> : '🚀'}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold">{startup.name}</h3>
                                            <span className="text-xs font-mono text-primary px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                                                {startup.status || 'Active'}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-text-secondary mb-6 line-clamp-3">
                                        {startup.description}
                                    </p>
                                    <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                                        <span className="text-sm text-text-muted">{startup.role || 'Founder'}</span>
                                        <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                            →
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="py-32 relative z-10">
                <div className="container-custom">
                    <div className="relative rounded-3xl overflow-hidden p-12 md:p-24 text-center border border-white/10 bg-gradient-to-b from-white/5 to-black">
                        <div className="absolute inset-0 bg-primary/10 blur-[100px] pointer-events-none" />

                        <h2 className="relative text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                            Ready to start your project?
                        </h2>
                        <p className="relative text-xl text-text-secondary mb-10 max-w-2xl mx-auto">
                            Let's collaborate to build something impactful. I'm currently available for select freelance opportunities.
                        </p>
                        <Link href="/contact" className="relative z-10">
                            <Button variant="primary" size="lg" className="px-12 py-6 text-lg shadow-2xl shadow-primary/25 hover:shadow-primary/40">
                                Get in Touch
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
