// app/contact/page.js
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import InstagramFeed from '@/components/sections/InstagramFeed';
import StructuredData from '@/components/seo/StructuredData';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';
import { createDocument } from '@/lib/firebase/firestore';
import { COLLECTIONS } from '@/lib/schema/collections';
import { trackFormSubmission, trackPageView } from '@/lib/firebase/analytics';
import { generateBreadcrumbSchema } from '@/lib/utils/seo-schemas';
import confetti from 'canvas-confetti';

export default function ContactPage() {
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    useEffect(() => {
        trackPageView('contact', 'Contact');
    }, []);

    const onSubmit = async (data) => {
        setSubmitting(true);

        try {
            // Add metadata
            const formData = {
                ...data,
                ip: '', // Would need server-side to get real IP
                userAgent: navigator.userAgent,
                status: 'unread',
            };

            await createDocument(COLLECTIONS.FORMS, formData);
            trackFormSubmission('contact_form', 'contact');

            // Trigger confetti
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#3B82F6', '#2DD4BF', '#FBBF24']
            });

            setSubmitted(true);
            reset();

            setTimeout(() => setSubmitted(false), 5000);
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to send message. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const breadcrumbs = [
        { name: 'Home', path: '/' },
        { name: 'Contact', path: '/contact' },
    ];

    const contactSchema = {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        mainEntity: {
            '@type': 'Person',
            name: 'Prince Kumar',
            email: 'contact@princekumar.dev',
            telephone: '+1234567890',
            url: 'https://princekumar.web.app',
        },
    };

    return (
        <div className="pt-32 pb-20">
            {/* Structured Data for SEO */}
            <StructuredData schema={contactSchema} />
            <StructuredData schema={generateBreadcrumbSchema(breadcrumbs)} />
            <div className="container-custom">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h1 className="section-title">Get in Touch</h1>
                    <p className="section-subtitle">
                        Have a project in mind? Let's discuss how we can work together
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        <div className="card">
                            <h2 className="text-2xl font-bold mb-6">Send a Message</h2>

                            {submitted && (
                                <div className="mb-6 p-4 bg-secondary/10 border border-secondary text-secondary rounded-lg">
                                    ✓ Message sent successfully! I'll get back to you soon.
                                </div>
                            )}

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <Input
                                    label="Name"
                                    {...register('name', { required: 'Name is required' })}
                                    error={errors.name?.message}
                                    placeholder="Your name"
                                />

                                <Input
                                    label="Email"
                                    type="email"
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Invalid email address'
                                        }
                                    })}
                                    error={errors.email?.message}
                                    placeholder="your.email@example.com"
                                />

                                <Input
                                    label="Phone (Optional)"
                                    type="tel"
                                    {...register('phone')}
                                    placeholder="+1 (555) 000-0000"
                                />

                                <Input
                                    label="Company (Optional)"
                                    {...register('company')}
                                    placeholder="Your company"
                                />

                                <Input
                                    label="Subject"
                                    {...register('subject', { required: 'Subject is required' })}
                                    error={errors.subject?.message}
                                    placeholder="What's this about?"
                                />

                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        {...register('message', { required: 'Message is required' })}
                                        className={`textarea-field ${errors.message ? 'border-red-500' : ''}`}
                                        placeholder="Tell me about your project..."
                                        rows="5"
                                    />
                                    {errors.message && (
                                        <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-full"
                                    loading={submitting}
                                >
                                    Send Message
                                </Button>
                            </form>
                        </div>
                    </motion.div>

                    {/* Contact Info & Social */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="space-y-6"
                    >
                        {/* Contact Info */}
                        <div className="card">
                            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <FaEnvelope className="w-5 h-5 text-primary mt-1" />
                                    <div>
                                        <p className="font-semibold">Email</p>
                                        <a href="mailto:contact@princekumar.dev" className="text-text-secondary hover:text-primary transition-colors">
                                            contact@princekumar.dev
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <FaPhone className="w-5 h-5 text-primary mt-1" />
                                    <div>
                                        <p className="font-semibold">Phone</p>
                                        <a href="tel:+1234567890" className="text-text-secondary hover:text-primary transition-colors">
                                            +1 (234) 567-890
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <FaMapMarkerAlt className="w-5 h-5 text-primary mt-1" />
                                    <div>
                                        <p className="font-semibold">Location</p>
                                        <p className="text-text-secondary">Available for remote work worldwide</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="card">
                            <h2 className="text-2xl font-bold mb-6">Connect on Social</h2>

                            <div className="grid grid-cols-2 gap-4">
                                <a
                                    href="https://github.com/Prince364133"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-4 bg-hover hover:bg-primary hover:text-white rounded-lg transition-all duration-300 group"
                                >
                                    <FaGithub className="w-6 h-6" />
                                    <span className="font-medium">GitHub</span>
                                </a>

                                <a
                                    href="#"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-4 bg-hover hover:bg-primary hover:text-white rounded-lg transition-all duration-300 group"
                                >
                                    <FaLinkedin className="w-6 h-6" />
                                    <span className="font-medium">LinkedIn</span>
                                </a>

                                <a
                                    href="#"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-4 bg-hover hover:bg-primary hover:text-white rounded-lg transition-all duration-300 group"
                                >
                                    <FaTwitter className="w-6 h-6" />
                                    <span className="font-medium">Twitter</span>
                                </a>

                                <a
                                    href="https://instagram.com/prince_gupta3608"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-4 bg-hover hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white rounded-lg transition-all duration-300 group"
                                >
                                    <FaInstagram className="w-6 h-6" />
                                    <span className="font-medium">Instagram</span>
                                </a>
                            </div>
                        </div>

                        {/* Instagram Feed */}
                        <InstagramFeed />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
