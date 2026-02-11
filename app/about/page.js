// app/about/page.js
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import JourneyTimeline from '@/components/sections/JourneyTimeline';
import Loader from '@/components/ui/Loader';
import StructuredData from '@/components/seo/StructuredData';
import { getAllDocuments } from '@/lib/firebase/firestore';
import { COLLECTIONS } from '@/lib/schema/collections';
import { trackPageView } from '@/lib/firebase/analytics';
import { generateProfilePageSchema, generateBreadcrumbSchema } from '@/lib/utils/seo-schemas';

export default function AboutPage() {
    const [education, setEducation] = useState([]);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        trackPageView('about', 'About');
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const profileDocs = await getAllDocuments(COLLECTIONS.PROFILE);
            if (profileDocs.length > 0) {
                setProfile(profileDocs[0]);
            }

            const educationDocs = await getAllDocuments(COLLECTIONS.EDUCATION, {
                orderBy: { field: 'order', direction: 'asc' },
            });
            setEducation(educationDocs);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader size="lg" />
            </div>
        );
    }

    const breadcrumbs = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
    ];

    return (
        <div className="pt-32 pb-20">
            {/* Structured Data for SEO */}
            {profile && <StructuredData schema={generateProfilePageSchema(profile)} />}
            <StructuredData schema={generateBreadcrumbSchema(breadcrumbs)} />

            <div className="container-custom">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h1 className="section-title">My Journey</h1>
                    <p className="section-subtitle max-w-3xl mx-auto">
                        From curious student to developer and entrepreneur - here's my story of growth, learning, and building.
                    </p>
                </motion.div>

                {/* Bio Section */}
                {profile?.bio && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="max-w-4xl mx-auto mb-20"
                    >
                        <div className="glass rounded-2xl p-8 md:p-12">
                            <h2 className="text-3xl font-bold mb-6">About Me</h2>
                            <p className="text-lg text-text-secondary leading-relaxed">
                                {profile.bio}
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* Journey Timeline */}
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">My Journey</h2>
                    <JourneyTimeline
                        milestones={education.map((edu, idx) => ({
                            label: edu.degree || edu.title,
                            position: {
                                x: idx === 0 ? '30%' : idx === 1 ? '70%' : idx === 2 ? '99%' : idx === 3 ? '70%' : idx === 4 ? '30%' : '1%',
                                y: idx === 0 ? '15%' : idx === 1 ? '15%' : idx === 2 ? '50%' : idx === 3 ? '85%' : idx === 4 ? '85%' : '50%'
                            },
                            index: idx
                        }))}
                    />
                </div>
            </div>
        </div>
    );
}
