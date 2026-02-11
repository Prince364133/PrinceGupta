// components/sections/SkillCard.jsx
'use client';

import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';

export default function SkillCard({ skill, index = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
        >
            <Card className="text-center">
                {skill.icon && (
                    <div className="text-5xl mb-4">{skill.icon}</div>
                )}

                <h3 className="text-xl font-bold mb-2">{skill.name}</h3>

                {skill.yearsOfExperience > 0 && (
                    <p className="text-sm text-text-secondary mb-4">
                        {skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? 'year' : 'years'} experience
                    </p>
                )}

                {/* Proficiency Bar */}
                <div className="w-full bg-hover rounded-full h-2 mb-2">
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.proficiency}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 + 0.3, duration: 0.8, ease: 'easeOut' }}
                        className="bg-gradient-to-r from-primary to-secondary h-full rounded-full"
                    />
                </div>

                <p className="text-sm text-text-muted">{skill.proficiency}% Proficiency</p>
            </Card>
        </motion.div>
    );
}
