// components/ui/Card.jsx
'use client';

export default function Card({
    children,
    className = '',
    hover = true,
    glass = false,
    ...props
}) {
    const baseStyles = 'rounded-xl p-6 transition-all duration-300';
    const hoverStyles = hover ? 'hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1' : '';
    const glassStyles = glass ? 'glass' : 'bg-accent border border-border';

    return (
        <div
            className={`${baseStyles} ${glassStyles} ${hoverStyles} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
