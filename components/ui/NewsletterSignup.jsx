// components/ui/NewsletterSignup.jsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FaPaperPlane } from 'react-icons/fa';
import { createDocument, getAllDocuments } from '@/lib/firebase/firestore';
import { COLLECTIONS } from '@/lib/schema/collections';
import confetti from 'canvas-confetti';

export default function NewsletterSignup({ source = 'footer' }) {
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const onSubmit = async (data) => {
        setSubmitting(true);
        setError('');

        try {
            // Check if email already exists
            const existing = await getAllDocuments(COLLECTIONS.NEWSLETTER, {
                where: { field: 'email', operator: '==', value: data.email.toLowerCase() }
            });

            if (existing.length > 0) {
                setError('This email is already subscribed!');
                setSubmitting(false);
                return;
            }

            // Create newsletter subscription
            await createDocument(COLLECTIONS.NEWSLETTER, {
                email: data.email.toLowerCase(),
                subscribedAt: new Date(),
                status: 'active',
                source,
                consent: true,
                ipAddress: '', // Would need server-side to get real IP
                userAgent: navigator.userAgent,
            });

            // Success!
            setSubmitted(true);
            reset();

            // Trigger confetti
            confetti({
                particleCount: 100,
                spread: 60,
                origin: { y: 0.8 },
                colors: ['#3B82F6', '#2DD4BF']
            });

            // Reset success message after 5 seconds
            setTimeout(() => setSubmitted(false), 5000);
        } catch (err) {
            console.error('Newsletter signup error:', err);
            setError('Failed to subscribe. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="newsletter-signup">
            {submitted ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-secondary/10 border border-secondary text-secondary rounded-lg text-center"
                >
                    <p className="font-semibold">🎉 Thanks for subscribing!</p>
                    <p className="text-sm mt-1">You'll hear from us soon.</p>
                </motion.div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <div>
                        <input
                            type="email"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address'
                                }
                            })}
                            placeholder="Enter your email"
                            className="w-full px-4 py-3 bg-hover border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                        )}
                        {error && (
                            <p className="mt-1 text-sm text-red-500">{error}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-600 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? (
                            <>
                                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                Subscribing...
                            </>
                        ) : (
                            <>
                                <FaPaperPlane className="w-4 h-4" />
                                Subscribe
                            </>
                        )}
                    </button>

                    <p className="text-xs text-text-muted">
                        By subscribing, you agree to receive updates. Unsubscribe anytime.
                    </p>
                </form>
            )}
        </div>
    );
}
