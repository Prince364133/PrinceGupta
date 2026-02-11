// app/skills/page.js
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SkillMeter from '@/components/ui/SkillMeter';
import SkillCard from '@/components/sections/SkillCard';
import Loader from '@/components/ui/Loader';
import { getAllDocuments } from '@/lib/firebase/firestore';
import { COLLECTIONS } from '@/lib/schema/collections';
import { trackPageView } from '@/lib/firebase/analytics';

export default function SkillsPage() {
    const [skills, setSkills] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        trackPageView('skills', 'Skills');
        loadSkills();
    }, []);

    const loadSkills = async () => {
        try {
            const skillDocs = await getAllDocuments(COLLECTIONS.SKILLS, {
                orderBy: { field: 'order', direction: 'asc' },
            });
            setSkills(skillDocs);

            // Extract unique categories
            const uniqueCategories = ['All', ...new Set(skillDocs.map(s => s.category).filter(Boolean))];
            setCategories(uniqueCategories);
        } catch (error) {
            console.error('Error loading skills:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredSkills = selectedCategory === 'All'
        ? skills
        : skills.filter(s => s.category === selectedCategory);

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
                    <h1 className="section-title">Skills & Expertise</h1>
                    <p className="section-subtitle">
                        Technologies and tools I work with
                    </p>
                </motion.div>

                {/* Category Filter */}
                {categories.length > 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="flex flex-wrap justify-center gap-3 mb-12"
                    >
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${selectedCategory === category
                                    ? 'bg-primary text-white shadow-lg shadow-primary/50'
                                    : 'bg-accent text-text-secondary hover:bg-hover hover:text-primary'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </motion.div>
                )}

                {/* Skill Meters - Top Skills */}
                {filteredSkills.length > 0 && (
                    <div className="mb-16">
                        <h2 className="text-2xl font-bold text-center mb-8">Proficiency Levels</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 justify-items-center">
                            {filteredSkills.slice(0, 5).map((skill) => (
                                <SkillMeter
                                    key={skill.id}
                                    skillName={skill.name}
                                    level={skill.proficiency || 70}
                                    color={skill.color || '#3B82F6'}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Skills Grid */}
                {filteredSkills.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredSkills.map((skill, index) => (
                            <SkillCard key={skill.id} skill={skill} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-text-secondary py-20">
                        <p>No skills available yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
