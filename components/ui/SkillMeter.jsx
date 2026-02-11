// components/ui/SkillMeter.jsx
'use client';

import { motion } from 'framer-motion';

export default function SkillMeter({ skillName, level = 70, color = '#3B82F6' }) {
    const trackHeight = 428; // 520px - 46px top - 46px bottom
    const knobY = trackHeight * (1 - level / 100);

    return (
        <div className="skill-meter-wrapper">
            <div className="thermostat glass-panel">
                <div className="thermostat-inner">
                    <div className="glass-noise"></div>
                    <div className="track">
                        <motion.div
                            initial={{ height: 0 }}
                            whileInView={{ height: `${level}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="mercury"
                            style={{
                                background: color,
                                boxShadow: `0 0 45px ${color}, 0 0 90px ${color}`
                            }}
                        ></motion.div>
                    </div>
                    <div className="knob-zone">
                        <motion.div
                            initial={{ top: `${trackHeight + 46}px` }}
                            whileInView={{ top: `${knobY + 46}px` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="knob"
                        ></motion.div>
                    </div>
                </div>
            </div>
            <div className="temp-readout">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="temp-value"
                    style={{ color }}
                >{level}%</motion.div>
                <div className="temp-label">{skillName}</div>
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                    className="status-text"
                    style={{ color }}
                >{getStatusText(level)}</motion.div>
            </div>
        </div>
    );
}

const getStatusText = (lvl) => {
    if (lvl < 30) return 'Beginner';
    if (lvl < 50) return 'Intermediate';
    if (lvl < 70) return 'Advanced';
    if (lvl < 90) return 'Expert';
    return 'Master';
};
