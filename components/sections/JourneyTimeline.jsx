// components/sections/JourneyTimeline.jsx
'use client';

export default function JourneyTimeline({ milestones = [] }) {
    // Default milestones if none provided
    const defaultMilestones = [
        { label: 'Class 5', position: { x: '30%', y: '15%' }, index: 0 },
        { label: 'Diploma', position: { x: '70%', y: '15%' }, index: 1 },
        { label: 'First Project', position: { x: '99%', y: '50%' }, index: 2 },
        { label: 'Developer', position: { x: '70%', y: '85%' }, index: 3 },
        { label: 'Entrepreneur', position: { x: '30%', y: '85%' }, index: 4 },
        { label: 'Today', position: { x: '1%', y: '50%' }, index: 5 },
    ];

    const items = milestones.length > 0 ? milestones : defaultMilestones;

    return (
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

            {items.map((milestone, idx) => (
                <div
                    key={idx}
                    className="journey-circle"
                    style={{
                        '--circle-x': milestone.position.x,
                        '--circle-y': milestone.position.y,
                        '--stop-index': milestone.index ?? idx,
                    }}
                >
                    <div className="journey-label">{milestone.label}</div>
                </div>
            ))}

            <div className="journey-dot"></div>
        </div>
    );
}
