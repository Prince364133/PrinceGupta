// app/media/page.js
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Loader from '@/components/ui/Loader';
import { getAllDocuments } from '@/lib/firebase/firestore';
import { COLLECTIONS } from '@/lib/schema/collections';
import { trackPageView } from '@/lib/firebase/analytics';

export default function MediaPage() {
    const [media, setMedia] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        trackPageView('media', 'Media Gallery');
        loadMedia();
    }, []);

    const loadMedia = async () => {
        try {
            const mediaDocs = await getAllDocuments(COLLECTIONS.MEDIA, {
                orderBy: { field: 'order', direction: 'asc' },
            });
            setMedia(mediaDocs);

            const uniqueCategories = ['All', ...new Set(mediaDocs.map(m => m.category).filter(Boolean))];
            setCategories(uniqueCategories);
        } catch (error) {
            console.error('Error loading media:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredMedia = selectedCategory === 'All'
        ? media
        : media.filter(m => m.category === selectedCategory);

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
                    <h1 className="section-title">Media Gallery</h1>
                    <p className="section-subtitle">
                        Photos, videos, and visual content from my journey
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

                {/* Media Grid */}
                {filteredMedia.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredMedia.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05, duration: 0.3 }}
                                onClick={() => setSelectedMedia(item)}
                                className="cursor-pointer group"
                            >
                                <div className="relative rounded-xl overflow-hidden bg-hover aspect-video">
                                    {item.type === 'video' ? (
                                        <video
                                            src={item.url}
                                            poster={item.thumbnail}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <img
                                            src={item.url}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    )}

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <div className="text-center p-4">
                                            <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                                            {item.description && (
                                                <p className="text-sm text-text-secondary line-clamp-2">{item.description}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-text-secondary py-20">
                        <p>No media available yet.</p>
                    </div>
                )}

                {/* Lightbox Modal */}
                {selectedMedia && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
                        onClick={() => setSelectedMedia(null)}
                    >
                        <div className="relative max-w-5xl w-full">
                            <button
                                onClick={() => setSelectedMedia(null)}
                                className="absolute -top-12 right-0 text-white hover:text-primary transition-colors text-4xl"
                            >
                                ×
                            </button>

                            {selectedMedia.type === 'video' ? (
                                <video
                                    src={selectedMedia.url}
                                    controls
                                    autoPlay
                                    className="w-full rounded-xl"
                                />
                            ) : (
                                <img
                                    src={selectedMedia.url}
                                    alt={selectedMedia.title}
                                    className="w-full rounded-xl"
                                />
                            )}

                            <div className="mt-4 text-center">
                                <h3 className="text-2xl font-bold mb-2">{selectedMedia.title}</h3>
                                {selectedMedia.description && (
                                    <p className="text-text-secondary">{selectedMedia.description}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
