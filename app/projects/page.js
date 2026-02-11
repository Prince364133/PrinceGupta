// app/projects/page.js
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectCard from '@/components/sections/ProjectCard';
import Loader from '@/components/ui/Loader';
import StructuredData from '@/components/seo/StructuredData';
import { getAllDocuments } from '@/lib/firebase/firestore';
import { COLLECTIONS } from '@/lib/schema/collections';
import { trackPageView } from '@/lib/firebase/analytics';
import { IoSearch } from 'react-icons/io5';
import Modal from '@/components/ui/Modal';
import { generateItemListSchema, generateBreadcrumbSchema, generateCollectionPageSchema } from '@/lib/utils/seo-schemas';

export default function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [categories, setCategories] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProject, setSelectedProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        trackPageView('projects', 'Projects');
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const projectDocs = await getAllDocuments(COLLECTIONS.PROJECTS, {
                orderBy: { field: 'order', direction: 'asc' },
            });
            setProjects(projectDocs);

            // Extract unique categories and statuses
            const uniqueCategories = ['All', ...new Set(projectDocs.map(p => p.category).filter(Boolean))];
            const uniqueStatuses = ['All', ...new Set(projectDocs.map(p => p.status).filter(Boolean))];
            setCategories(uniqueCategories);
            setStatuses(uniqueStatuses);
        } catch (error) {
            console.error('Error loading projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProjects = projects.filter(project => {
        const categoryMatch = selectedCategory === 'All' || project.category === selectedCategory;
        const statusMatch = selectedStatus === 'All' || project.status === selectedStatus;
        const searchMatch = !searchTerm ||
            project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.technologies?.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));

        return categoryMatch && statusMatch && searchMatch;
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader size="lg" />
            </div>
        );
    }

    const breadcrumbs = [
        { name: 'Home', path: '/' },
        { name: 'Projects', path: '/projects' },
    ];

    return (
        <div className="pt-32 pb-20">
            {/* Structured Data for SEO */}
            <StructuredData schema={generateCollectionPageSchema('Projects', 'Explore my portfolio of web development projects, applications, and side projects')} />
            <StructuredData schema={generateItemListSchema(projects, 'projects')} />
            <StructuredData schema={generateBreadcrumbSchema(breadcrumbs)} />
            <div className="container-custom">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h1 className="section-title">Projects</h1>
                    <p className="section-subtitle">
                        Explore my work and side projects
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto mt-8 relative">
                        <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name, description, or technology..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-accent border border-border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        />
                    </div>
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="mb-12 space-y-4"
                >
                    {/* Category Filter */}
                    {categories.length > 1 && (
                        <div>
                            <h3 className="text-sm font-semibold text-text-secondary mb-3">Category</h3>
                            <div className="flex flex-wrap gap-3">
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${selectedCategory === category
                                            ? 'bg-primary text-white shadow-lg shadow-primary/50'
                                            : 'bg-accent text-text-secondary hover:bg-hover hover:text-primary'
                                            }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Status Filter */}
                    {statuses.length > 1 && (
                        <div>
                            <h3 className="text-sm font-semibold text-text-secondary mb-3">Status</h3>
                            <div className="flex flex-wrap gap-3">
                                {statuses.map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setSelectedStatus(status)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${selectedStatus === status
                                            ? 'bg-secondary text-white shadow-lg shadow-secondary/50'
                                            : 'bg-accent text-text-secondary hover:bg-hover hover:text-secondary'
                                            }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Projects Grid */}
                <div className="min-h-[400px]">
                    <AnimatePresence mode="popLayout">
                        {filteredProjects.length > 0 ? (
                            <motion.div
                                layout
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {filteredProjects.map((project, index) => (
                                    <motion.div
                                        key={project.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <ProjectCard
                                            project={project}
                                            index={index}
                                            onViewDetails={() => setSelectedProject(project)}
                                        />
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center text-text-secondary py-20"
                            >
                                <p className="text-xl">No projects match your search or filters.</p>
                                <button
                                    onClick={() => {
                                        setSelectedCategory('All');
                                        setSelectedStatus('All');
                                        setSearchTerm('');
                                    }}
                                    className="mt-4 text-primary hover:underline"
                                >
                                    Clear all filters
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Project Detail Modal */}
                <Modal
                    isOpen={!!selectedProject}
                    onClose={() => setSelectedProject(null)}
                    title={selectedProject?.title}
                    size="lg"
                >
                    {selectedProject && (
                        <div className="space-y-6">
                            {selectedProject.images && selectedProject.images.length > 0 && (
                                <div className="rounded-xl overflow-hidden bg-hover aspect-video">
                                    <img
                                        src={selectedProject.images[0]}
                                        alt={selectedProject.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            <div>
                                <h3 className="text-lg font-bold mb-2">About Project</h3>
                                <p className="text-text-secondary leading-relaxed">
                                    {selectedProject.description}
                                </p>
                            </div>

                            {selectedProject.features && selectedProject.features.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-bold mb-2">Key Features</h3>
                                    <ul className="list-disc list-inside text-text-secondary space-y-1">
                                        {selectedProject.features.map((feature, i) => (
                                            <li key={i}>{feature}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div>
                                <h3 className="text-lg font-bold mb-3">Technologies Used</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedProject.techStack?.map((tech, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-mono"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
                                {selectedProject.liveUrl && (
                                    <a
                                        href={selectedProject.liveUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-primary px-6 py-2 rounded-lg font-bold flex items-center gap-2"
                                    >
                                        View Live Demo
                                    </a>
                                )}
                                {selectedProject.githubUrl && (
                                    <a
                                        href={selectedProject.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-outline px-6 py-2 rounded-lg font-bold flex items-center gap-2"
                                    >
                                        View Source Code
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </div>
    );
}
