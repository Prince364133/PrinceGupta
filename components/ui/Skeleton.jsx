// components/ui/Skeleton.jsx
'use client';

export default function Skeleton({ className = '', variant = 'default' }) {
    const variants = {
        default: 'h-4 w-full',
        title: 'h-8 w-3/4',
        text: 'h-4 w-full',
        avatar: 'h-12 w-12 rounded-full',
        card: 'h-48 w-full rounded-lg',
        button: 'h-10 w-24 rounded-lg',
    };

    return (
        <div
            className={`animate-pulse bg-gradient-to-r from-hover via-accent to-hover bg-[length:200%_100%] rounded ${variants[variant]} ${className}`}
            style={{
                animation: 'shimmer 2s infinite linear'
            }}
        />
    );
}
