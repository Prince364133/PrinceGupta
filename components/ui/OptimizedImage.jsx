// components/ui/OptimizedImage.jsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function OptimizedImage({
    src,
    alt,
    className = '',
    aspectRatio = '16/9',
    sizes = '100vw',
    priority = false,
    onLoad,
    fallbackSrc = '/images/placeholder.jpg'
}) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(priority);
    const [error, setError] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
        if (priority) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '50px' }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, [priority]);

    const handleLoad = () => {
        setIsLoaded(true);
        onLoad?.();
    };

    const handleError = () => {
        setError(true);
        setIsLoaded(true);
    };

    return (
        <div
            ref={imgRef}
            className={`relative overflow-hidden bg-hover ${className}`}
            style={{ aspectRatio }}
        >
            {/* Blur Placeholder */}
            {!isLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-hover to-accent animate-pulse" />
            )}

            {/* Actual Image */}
            {isInView && (
                <motion.img
                    src={error ? fallbackSrc : src}
                    alt={alt}
                    className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                    onLoad={handleLoad}
                    onError={handleError}
                    loading={priority ? 'eager' : 'lazy'}
                    sizes={sizes}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: isLoaded ? 1 : 1.1 }}
                    transition={{ duration: 0.6 }}
                />
            )}
        </div>
    );
}
