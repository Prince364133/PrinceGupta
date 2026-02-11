// components/sections/ProjectCard.jsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa';

export default function ProjectCard({ project, index = 0, onViewDetails }) {
    const statusColors = {
        Live: 'bg-green-500',
        Failed: 'bg-red-500',
        Archived: 'bg-yellow-500',
    };

    const CardContent = (
        <Card className="h-full group cursor-pointer">
            {/* Project Image */}
            {project.images?.[0] && (
                <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-hover">
                    <img
                        src={project.images[0]}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Status Badge */}
                    <div className={`absolute top-3 right-3 px-3 py-1 ${statusColors[project.status] || 'bg-gray-500'} text-white text-xs font-semibold rounded-full`}>
                        {project.status}
                    </div>
                </div>
            )}

            {/* Project Info */}
            <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                        {project.title}
                    </h3>
                </div>

                <p className="text-text-secondary mb-4 line-clamp-2">
                    {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack?.slice(0, 3).map((tech, i) => (
                        <span
                            key={i}
                            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md font-mono"
                        >
                            {tech}
                        </span>
                    ))}
                    {project.techStack?.length > 3 && (
                        <span className="px-2 py-1 bg-hover text-text-secondary text-xs rounded-md">
                            +{project.techStack.length - 3} more
                        </span>
                    )}
                </div>

                {/* Links */}
                <div className="flex gap-3">
                    {project.liveUrl && (
                        <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-2 text-sm text-primary hover:text-blue-400 transition-colors"
                        >
                            <FaExternalLinkAlt className="w-3 h-3" />
                            Live Demo
                        </a>
                    )}
                    {project.githubUrl && (
                        <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors"
                        >
                            <FaGithub className="w-4 h-4" />
                            Code
                        </a>
                    )}
                </div>
            </div>
        </Card>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
        >
            {onViewDetails ? (
                <div onClick={onViewDetails}>
                    {CardContent}
                </div>
            ) : (
                <Link href={`/projects/${project.id}`}>
                    {CardContent}
                </Link>
            )}
        </motion.div>
    );
}
