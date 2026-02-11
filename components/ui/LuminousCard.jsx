// components/ui/LuminousCard.jsx
'use client';

import { useState } from 'react';
import Counter from '@/components/sections/Counter';

export default function LuminousCard({ icon, title, number, suffix, description, defaultActive = false }) {
    const [isActive, setIsActive] = useState(defaultActive);

    return (
        <div className={`luminous-card ${isActive ? 'active' : ''}`}>
            <div className="light-layer">
                <div className="slit"></div>
                <div className="lumen">
                    <div className="min"></div>
                    <div className="mid"></div>
                    <div className="hi"></div>
                </div>
                <div className="darken">
                    <div className="sl"></div>
                    <div className="ll"></div>
                    <div className="slt"></div>
                    <div className="srt"></div>
                </div>
            </div>
            <div className="content">
                <div className="icon">
                    {typeof icon === 'string' ? (
                        <span className="text-6xl">{icon}</span>
                    ) : (
                        icon
                    )}
                </div>
                <div className="bottom">
                    <h4>
                        {number !== undefined ? (
                            <Counter end={number} suffix={suffix} duration={2000} />
                        ) : (
                            title
                        )}
                    </h4>
                    <p>{description}</p>
                    <div
                        className={`toggle ${isActive ? 'active' : ''}`}
                        onClick={() => setIsActive(!isActive)}
                    >
                        <div className="handle"></div>
                        <span>Activate Lumen</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
