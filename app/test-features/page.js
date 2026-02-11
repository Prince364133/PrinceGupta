'use client';

import { useEffect } from 'react';

export default function TestFeaturesPage() {
    useEffect(() => {
        // Load GSAP for animations
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
        script.async = true;
        document.body.appendChild(script);

        const draggableScript = document.createElement('script');
        draggableScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/Draggable.min.js';
        draggableScript.async = true;
        document.body.appendChild(draggableScript);

        return () => {
            document.body.removeChild(script);
            document.body.removeChild(draggableScript);
        };
    }, []);

    return (
        <div className="test-features-page">
            <div className="container-custom py-32">
                <h1 className="text-5xl font-bold text-center mb-4">Interactive Features Test</h1>
                <p className="text-center text-text-secondary mb-16">
                    Testing advanced UI effects before implementation
                </p>

                {/* Section 1: Luminous Cards */}
                <section className="mb-32">
                    <h2 className="text-3xl font-bold mb-8">1. Luminous Glass Cards</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: "3+ Years Experience", desc: "Full-Stack Development", icon: "💼" },
                            { title: "50+ Projects", desc: "Delivered Successfully", icon: "🚀" },
                            { title: "10+ Technologies", desc: "Mastered & Deployed", icon: "⚡" }
                        ].map((item, i) => (
                            <div key={i} className="luminous-card">
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
                                        <span className="text-6xl">{item.icon}</span>
                                    </div>
                                    <div className="bottom">
                                        <h4>{item.title}</h4>
                                        <p>{item.desc}</p>
                                        <div className="toggle" onClick={(e) => e.currentTarget.classList.toggle('active')}>
                                            <div className="handle"></div>
                                            <span>Activate Lumen</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section 2: Journey Path */}
                <section className="mb-32">
                    <h2 className="text-3xl font-bold mb-8">2. Journey Timeline Animation</h2>
                    <div className="journey-container">
                        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path
                                className="oval"
                                d="M 15,15 H 85 Q 99,15 99,30 V 70 Q 100,85 85,85 H 15 Q 1,85 0,70 V 30 Q 1,15 15,15 Z"
                            />
                            <path
                                className="path-line"
                                d="M 15,15 H 85 Q 99,15 99,30 V 70 Q 100,85 85,85 H 15 Q 1,85 0,70 V 30 Q 1,15 15,15 Z"
                            />
                        </svg>

                        <div className="journey-circle journey-security" style={{ '--circle-x': '30%', '--circle-y': '15%', '--stop-index': 0 }}>
                            <div className="journey-label">Class 5</div>
                        </div>
                        <div className="journey-circle journey-heart" style={{ '--circle-x': '70%', '--circle-y': '15%', '--stop-index': 1 }}>
                            <div className="journey-label">Diploma</div>
                        </div>
                        <div className="journey-circle journey-battery" style={{ '--circle-x': '99%', '--circle-y': '50%', '--stop-index': 2 }}>
                            <div className="journey-label">First Startup</div>
                        </div>
                        <div className="journey-circle journey-parcel" style={{ '--circle-x': '70%', '--circle-y': '85%', '--stop-index': 3 }}>
                            <div className="journey-label">Developer</div>
                        </div>
                        <div className="journey-circle journey-notes" style={{ '--circle-x': '30%', '--circle-y': '85%', '--stop-index': 4 }}>
                            <div className="journey-label">Entrepreneur</div>
                        </div>
                        <div className="journey-circle journey-scooter" style={{ '--circle-x': '1%', '--circle-y': '50%', '--stop-index': 5 }}>
                            <div className="journey-label">Today</div>
                        </div>

                        <div className="journey-dot"></div>
                    </div>
                </section>

                {/* Section 3: Glass Thermostat */}
                <section className="mb-32">
                    <h2 className="text-3xl font-bold mb-8 text-center">3. Interactive Skill Meter</h2>
                    <div id="thermostat-app">
                        <div className="thermostat-ui">
                            <div className="thermostat glass-panel">
                                <div className="thermostat-inner">
                                    <div className="glass-noise"></div>
                                    <div className="scale-container" id="scaleContainer"></div>
                                    <div className="track" id="track">
                                        <div className="mercury" id="mercury"></div>
                                    </div>
                                    <div className="knob-zone">
                                        <div className="knob" id="knob"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="temp-readout">
                                <div className="temp-value" id="tempValue">70%</div>
                                <div className="temp-label">SKILL LEVEL</div>
                                <div className="status-text" id="statusText">Expert</div>
                            </div>
                        </div>
                    </div>
                    <div className="particles-container" id="uiParticles"></div>
                </section>

                {/* Section 4: 3D Glass Frame Info */}
                <section className="mb-32">
                    <h2 className="text-3xl font-bold mb-8 text-center">4. 3D Glass Photo Frame</h2>
                    <div className="glass-info-card">
                        <p className="text-center text-text-secondary mb-4">
                            This feature uses Three.js for 3D rendering with glass materials and HDRI lighting.
                            It will be implemented as a separate interactive component.
                        </p>
                        <div className="flex justify-center gap-4">
                            <div className="card p-4 text-center">
                                <div className="text-2xl mb-2">🎨</div>
                                <div className="text-sm">Glass Morphism</div>
                            </div>
                            <div className="card p-4 text-center">
                                <div className="text-2xl mb-2">🔄</div>
                                <div className="text-sm">3D Rotation</div>
                            </div>
                            <div className="card p-4 text-center">
                                <div className="text-2xl mb-2">💎</div>
                                <div className="text-sm">Refraction</div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="text-center">
                    <a href="/" className="btn-primary inline-block">
                        Back to Home
                    </a>
                </div>
            </div>
        </div>
    );
}
