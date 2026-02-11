// app/projects/[id]/page.js
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaExternalLinkAlt, FaGithub, FaArrowLeft } from 'react-icons/fa';
import Loader from '@/components/ui/Loader';
import Button from '@/components/ui/Button';
import { getDocument } from '@/lib/firebase/firestore';
import { COLLECTIONS } from '@/lib/schema/collections';
import { trackProjectView } from '@/lib/firebase/analytics';



export default function ProjectDetailPage() {
    const params = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            loadProject();
        }
    }, [params.id]);

    const loadProject = async () => {
        try {
            const projectDoc = await getDocument(COLLECTIONS.PROJECTS, params.id);
            setProject(projectDoc);

            if (projectDoc) {
                trackProjectView(projectDoc.id, projectDoc.title);
            }
        } catch (error) {
            console.error('Error loading project:', error);
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

    if (!project) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
                    <Link href="/projects">
                        <Button variant="primary">Back to Projects</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const statusColors = {
        Live: 'bg-green-500',
        Failed: 'bg-red-500',
        Archived: 'bg-yellow-500',
    };

    return (
        <div className="pt-32 pb-20">
            <div className="container-custom max-w-5xl">
                {/* Back Button */}
                <Link href="/projects" className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors mb-8">
                    <FaArrowLeft />
                    Back to Projects
                </Link>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <div className="flex items-start justify-between mb-4">
                        <h1 className="text-4xl md:text-5xl font-bold">{project.title}</h1>
                        <span className={`px-4 py-2 ${statusColors[project.status] || 'bg-gray-500'} text-white text-sm font-semibold rounded-full`}>
                            {project.status}
                        </span>
                    </div>

                    <p className="text-xl text-text-secondary mb-6">{project.description}</p>

                    <div className="flex flex-wrap gap-4">
                        {project.liveUrl && (
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                                <Button variant="primary">
                                    <FaExternalLinkAlt />
                                    Live Demo
                                </Button>
                            </a>
                        )}
                        {project.githubUrl && (
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline">
                                    <FaGithub />
                                    View Code
                                </Button>
                            </a>
                        )}
                    </div>
                </motion.div>

                {/* Images */}
                {project.images && project.images.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="mb-12"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {project.images.map((image, index) => (
                                <div key={index} className="rounded-xl overflow-hidden bg-hover">
                                    <img src={image} alt={`${project.title} screenshot ${index + 1}`} className="w-full h-auto" />
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {/* Tech Stack */}
                    {project.techStack && project.techStack.length > 0 && (
                        <div className="card">
                            <h3 className="text-xl font-bold mb-4">Tech Stack</h3>
                            <div className="flex flex-wrap gap-2">
                                {project.techStack.map((tech, i) => (
                                    <span key={i} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-md font-mono">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Project Info */}
                    <div className="card">
                        <h3 className="text-xl font-bold mb-4">Project Info</h3>
                        <div className="space-y-2 text-text-secondary">
                            {project.category && <p><strong>Category:</strong> {project.category}</p>}
                            {project.role && <p><strong>Role:</strong> {project.role}</p>}
                            {project.teamSize > 0 && <p><strong>Team Size:</strong> {project.teamSize}</p>}
                            {project.startDate && (
                                <p><strong>Timeline:</strong> {project.startDate} - {project.endDate || 'Present'}</p>
                            )}
                        </div>
                    </div>

                    {/* Features */}
                    {project.features && project.features.length > 0 && (
                        <div className="card">
                            <h3 className="text-xl font-bold mb-4">Key Features</h3>
                            <ul className="list-disc list-inside space-y-1 text-text-secondary">
                                {project.features.map((feature, i) => (
                                    <li key={i}>{feature}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Long Description */}
                {project.longDescription && (
                    <div className="card mb-8">
                        <h3 className="text-2xl font-bold mb-4">About This Project</h3>
                        <p className="text-text-secondary whitespace-pre-wrap">{project.longDescription}</p>
                    </div>
                )}

                {/* Challenges & Learnings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {project.challenges && (
                        <div className="card">
                            <h3 className="text-2xl font-bold mb-4">Challenges</h3>
                            <p className="text-text-secondary whitespace-pre-wrap">{project.challenges}</p>
                        </div>
                    )}

                    {project.learnings && (
                        <div className="card">
                            <h3 className="text-2xl font-bold mb-4">Key Learnings</h3>
                            <p className="text-text-secondary whitespace-pre-wrap">{project.learnings}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
