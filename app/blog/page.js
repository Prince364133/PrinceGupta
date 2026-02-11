// app/blog/page.js
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Loader from '@/components/ui/Loader';
import StructuredData from '@/components/seo/StructuredData';
import { getAllDocuments } from '@/lib/firebase/firestore';
import { COLLECTIONS } from '@/lib/schema/collections';
import { trackPageView } from '@/lib/firebase/analytics';
import { formatDate, getBlogCategories } from '@/lib/utils/blogUtils';
import { FaSearch, FaClock, FaTag } from 'react-icons/fa';
import { generateItemListSchema, generateBreadcrumbSchema, generateCollectionPageSchema } from '@/lib/utils/seo-schemas';

export default function BlogPage() {
    const [blogs, setBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [featuredBlogs, setFeaturedBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = getBlogCategories();

    useEffect(() => {
        trackPageView('blog', 'Blog');
        loadBlogs();
    }, []);

    useEffect(() => {
        filterBlogs();
    }, [searchQuery, selectedCategory, blogs]);

    const loadBlogs = async () => {
        try {
            const docs = await getAllDocuments(COLLECTIONS.BLOGS);

            // Filter only published blogs
            const published = docs.filter((blog) => blog.status === 'published');

            // Sort by published date
            published.sort((a, b) => {
                const dateA = a.publishedAt?.toDate?.() || new Date(0);
                const dateB = b.publishedAt?.toDate?.() || new Date(0);
                return dateB - dateA;
            });

            setBlogs(published);
            setFeaturedBlogs(published.filter((blog) => blog.featured).slice(0, 3));
        } catch (error) {
            console.error('Error loading blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterBlogs = () => {
        let filtered = [...blogs];

        if (searchQuery) {
            filtered = filtered.filter(
                (blog) =>
                    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    blog.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    blog.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        if (selectedCategory !== 'all') {
            filtered = filtered.filter((blog) => blog.category === selectedCategory);
        }

        setFilteredBlogs(filtered);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader size="lg" />
            </div>
        );
    }

    const breadcrumbs = [
        { name: 'Home', path: '/' },
        { name: 'Blog', path: '/blog' },
    ];

    return (
        <div className="min-h-screen py-20">
            {/* Structured Data for SEO */}
            <StructuredData schema={generateCollectionPageSchema('Blog', 'Insights, tutorials, and thoughts on web development, entrepreneurship, and technology')} />
            <StructuredData schema={generateItemListSchema(blogs, 'blog')} />
            <StructuredData schema={generateBreadcrumbSchema(breadcrumbs)} />
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4">Blog</h1>
                    <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                        Insights, tutorials, and thoughts on web development, entrepreneurship, and technology
                    </p>
                </div>

                {/* Featured Blogs */}
                {featuredBlogs.length > 0 && !searchQuery && selectedCategory === 'all' && (
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold mb-6">Featured Posts</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {featuredBlogs.map((blog, index) => (
                                <motion.div
                                    key={blog.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link href={`/blog/${blog.slug}`}>
                                        <Card className="h-full hover:shadow-xl transition-shadow cursor-pointer">
                                            {blog.coverImage && (
                                                <img
                                                    src={blog.coverImage}
                                                    alt={blog.title}
                                                    className="w-full h-48 object-cover rounded-lg mb-4"
                                                />
                                            )}
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                                                    {categories.find((c) => c.value === blog.category)?.label}
                                                </span>
                                                <span className="flex items-center gap-1 text-xs text-text-secondary">
                                                    <FaClock /> {blog.readingTime} min
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold mb-2">{blog.title}</h3>
                                            <p className="text-text-secondary text-sm mb-3">{blog.excerpt}</p>
                                            <p className="text-xs text-text-secondary">
                                                {formatDate(blog.publishedAt, 'short')}
                                            </p>
                                        </Card>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Search and Filter */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search blogs..."
                                className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`px-4 py-2 rounded-lg transition-colors ${selectedCategory === 'all'
                                ? 'bg-primary text-white'
                                : 'bg-surface hover:bg-hover'
                                }`}
                        >
                            All
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category.value}
                                onClick={() => setSelectedCategory(category.value)}
                                className={`px-4 py-2 rounded-lg transition-colors ${selectedCategory === category.value
                                    ? 'bg-primary text-white'
                                    : 'bg-surface hover:bg-hover'
                                    }`}
                            >
                                {category.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBlogs.length === 0 ? (
                        <div className="col-span-full">
                            <Card>
                                <p className="text-center text-text-secondary py-12">
                                    {searchQuery || selectedCategory !== 'all'
                                        ? 'No blogs found matching your criteria.'
                                        : 'No blog posts yet. Check back soon!'}
                                </p>
                            </Card>
                        </div>
                    ) : (
                        filteredBlogs.map((blog, index) => (
                            <motion.div
                                key={blog.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link href={`/blog/${blog.slug}`}>
                                    <Card className="h-full hover:shadow-xl transition-shadow cursor-pointer">
                                        {blog.coverImage && (
                                            <img
                                                src={blog.coverImage}
                                                alt={blog.title}
                                                className="w-full h-48 object-cover rounded-lg mb-4"
                                            />
                                        )}
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                                                {categories.find((c) => c.value === blog.category)?.label}
                                            </span>
                                            <span className="flex items-center gap-1 text-xs text-text-secondary">
                                                <FaClock /> {blog.readingTime} min
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold mb-2 line-clamp-2">{blog.title}</h3>
                                        <p className="text-text-secondary text-sm mb-3 line-clamp-3">
                                            {blog.excerpt}
                                        </p>
                                        {blog.tags && blog.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {blog.tags.slice(0, 3).map((tag, i) => (
                                                    <span
                                                        key={i}
                                                        className="flex items-center gap-1 px-2 py-1 bg-surface text-xs rounded-full"
                                                    >
                                                        <FaTag className="w-2 h-2" /> {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <p className="text-xs text-text-secondary">
                                            {formatDate(blog.publishedAt, 'short')}
                                        </p>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
