// components/ui/TestimonialsSlider.jsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Card from './Card';

export default function TestimonialsSlider({ testimonials = [] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    useEffect(() => {
        if (testimonials.length <= 1) return;

        const timer = setInterval(() => {
            handleNext();
        }, 5000);

        return () => clearInterval(timer);
    }, [currentIndex, testimonials.length]);

    const handleNext = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const handlePrev = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    if (testimonials.length === 0) return null;

    const testimonial = testimonials[currentIndex];

    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 100 : -100,
            opacity: 0
        })
    };

    return (
        <div className="relative max-w-4xl mx-auto px-12">
            <div className="overflow-hidden relative min-h-[300px] flex items-center">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 300 },
                            opacity: { duration: 0.2 }
                        }}
                        className="w-full"
                    >
                        <Card className="text-center py-12 px-8 md:px-16 border-none bg-surface/50 backdrop-blur-sm">
                            <FaQuoteLeft className="text-4xl text-primary/20 mx-auto mb-6" />
                            <p className="text-xl md:text-2xl text-text-secondary italic mb-8 leading-relaxed">
                                "{testimonial.content}"
                            </p>
                            <div className="flex items-center justify-center gap-4">
                                {testimonial.image && (
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-16 h-16 rounded-full border-2 border-primary object-cover"
                                    />
                                )}
                                <div className="text-left">
                                    <h4 className="font-bold text-lg">{testimonial.name}</h4>
                                    <p className="text-sm text-text-muted">
                                        {testimonial.role}{testimonial.company && ` @ ${testimonial.company}`}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Controls */}
            {testimonials.length > 1 && (
                <>
                    <button
                        onClick={handlePrev}
                        className="absolute left-0 top-1/2 -translate-y-1/2 p-3 rounded-full bg-accent hover:bg-hover text-text-secondary transition-all"
                    >
                        <FaChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute right-0 top-1/2 -translate-y-1/2 p-3 rounded-full bg-accent hover:bg-hover text-text-secondary transition-all"
                    >
                        <FaChevronRight className="w-5 h-5" />
                    </button>

                    {/* Pagination Dots */}
                    <div className="flex justify-center gap-2 mt-8">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setDirection(index > currentIndex ? 1 : -1);
                                    setCurrentIndex(index);
                                }}
                                className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'w-8 bg-primary' : 'bg-primary/20 hover:bg-primary/40'
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
