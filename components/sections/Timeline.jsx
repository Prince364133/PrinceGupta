// components/sections/Timeline.jsx
'use client';

import { motion } from 'framer-motion';

export default function Timeline({ items }) {
    return (
        <div className="relative">
            {/* Timeline Line */}
            <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="absolute left-0 md:left-1/2 top-0 w-0.5 bg-gradient-to-b from-primary to-secondary transform md:-translate-x-1/2 origin-top"
            />

            {items.map((item, index) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2, duration: 0.5 }}
                    className={`relative mb-12 md:mb-16 ${index % 2 === 0 ? 'md:pr-1/2 md:text-right' : 'md:pl-1/2 md:ml-auto'
                        }`}
                >
                    {/* Timeline Dot */}
                    <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-primary rounded-full transform md:-translate-x-1/2 border-4 border-background" />

                    {/* Content Card */}
                    <div className={`ml-8 md:ml-0 ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'}`}>
                        <div className="card">
                            {item.image && (
                                <div className="w-full h-48 mb-4 rounded-lg overflow-hidden bg-hover">
                                    <img
                                        src={item.image}
                                        alt={item.institution || item.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-mono rounded-full">
                                    {item.startYear} - {item.endYear || 'Present'}
                                </span>
                            </div>

                            <h3 className="text-2xl font-bold mb-2">
                                {item.institution || item.title}
                            </h3>

                            {item.degree && (
                                <p className="text-lg text-primary mb-2">
                                    {item.degree} {item.field && `in ${item.field}`}
                                </p>
                            )}

                            <p className="text-text-secondary mb-4">
                                {item.description}
                            </p>

                            {item.achievements && item.achievements.length > 0 && (
                                <div>
                                    <h4 className="font-semibold mb-2">Key Achievements:</h4>
                                    <ul className="list-disc list-inside space-y-1 text-text-secondary">
                                        {item.achievements.map((achievement, i) => (
                                            <li key={i}>{achievement}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
