// app/startups/page.js
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import Loader from '@/components/ui/Loader';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { getAllDocuments } from '@/lib/firebase/firestore';
import { COLLECTIONS } from '@/lib/schema/collections';
import { trackPageView } from '@/lib/firebase/analytics';

export default function StartupsPage() {
    const [startups, setStartups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        trackPageView('startups', 'Startups');
        loadStartups();
    }, []);

    const loadStartups = async () => {
        try {
            const startupDocs = await getAllDocuments(COLLECTIONS.STARTUPS, {
                orderBy: { field: 'order', direction: 'asc' },
            });
            setStartups(startupDocs);
        } catch (error) {
            console.error('Error loading startups:', error);
        } finally {
            setLoading(false);
        }
    };

    const statusColors = {
        Active: 'bg-green-500',
        Acquired: 'bg-blue-500',
        Shutdown: 'bg-red-500',
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader size="lg" />
            </div>
        );
    }

    return (
        <div className="pt-32 pb-20">
            <div className="container-custom">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h1 className="section-title">Startups & Ventures</h1>
                    <p className="section-subtitle">
                        My entrepreneurial journey - successes, failures, and lessons learned
                    </p>
                </motion.div>

                {/* Startups Grid */}
                {startups.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {startups.map((startup, index) => (
                            <motion.div
                                key={startup.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                            >
                                <Card className="h-full">
                                    {/* Header with Logo */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            {startup.logo && (
                                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-hover flex items-center justify-center">
                                                    <img src={startup.logo} alt={startup.name} className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="text-2xl font-bold">{startup.name}</h3>
                                                <p className="text-primary">{startup.tagline}</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 ${statusColors[startup.status] || 'bg-gray-500'} text-white text-sm font-semibold rounded-full`}>
                                            {startup.status}
                                        </span>
                                    </div>

                                    {/* Images */}
                                    {startup.images && startup.images.length > 0 && (
                                        <div className="grid grid-cols-2 gap-2 mb-4">
                                            {startup.images.slice(0, 2).map((image, i) => (
                                                <div key={i} className="rounded-lg overflow-hidden bg-hover h-32">
                                                    <img src={image} alt={`${startup.name} ${i + 1}`} className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Description */}
                                    <p className="text-text-secondary mb-4">{startup.description}</p>

                                    {/* Details Grid */}
                                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                        {startup.founded && (
                                            <div>
                                                <span className="text-text-muted">Founded:</span>
                                                <p className="font-semibold">{startup.founded}</p>
                                            </div>
                                        )}
                                        {startup.teamSize > 0 && (
                                            <div>
                                                <span className="text-text-muted">Team Size:</span>
                                                <p className="font-semibold">{startup.teamSize} people</p>
                                            </div>
                                        )}
                                        {startup.role && (
                                            <div>
                                                <span className="text-text-muted">My Role:</span>
                                                <p className="font-semibold">{startup.role}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Tech Stack */}
                                    {startup.techStack && startup.techStack.length > 0 && (
                                        <div className="mb-4">
                                            <p className="text-sm text-text-muted mb-2">Tech Stack:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {startup.techStack.map((tech, i) => (
                                                    <span key={i} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md font-mono">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Outcome & Learnings */}
                                    {startup.outcome && (
                                        <div className="mb-4 p-4 bg-hover rounded-lg">
                                            <p className="text-sm font-semibold mb-1">Outcome:</p>
                                            <p className="text-sm text-text-secondary">{startup.outcome}</p>
                                        </div>
                                    )}

                                    {startup.lessonsLearned && (
                                        <div className="p-4 bg-secondary/10 border border-secondary/30 rounded-lg">
                                            <p className="text-sm font-semibold text-secondary mb-1">Key Lessons:</p>
                                            <p className="text-sm text-text-secondary">{startup.lessonsLearned}</p>
                                        </div>
                                    )}

                                    {/* Website Link */}
                                    {startup.website && (
                                        <div className="mt-4">
                                            <a
                                                href={startup.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 text-primary hover:text-blue-400 transition-colors"
                                            >
                                                <FaExternalLinkAlt className="w-3 h-3" />
                                                Visit Website
                                            </a>
                                        </div>
                                    )}
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-text-secondary py-20">
                        <p>No startups available yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
