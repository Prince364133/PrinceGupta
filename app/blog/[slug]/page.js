// app/blog/[slug]/page.js
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import Loader from '@/components/ui/Loader';
import { getAllDocuments, updateDocument } from '@/lib/firebase/firestore';
import { COLLECTIONS } from '@/lib/schema/collections';
import { trackBlogView } from '@/lib/firebase/analytics';
import {
    formatDate,
    extractHeadings,
    getBlogCategories,
    generateBlogSEO,
    generateBlogStructuredData,
} from '@/lib/utils/blogUtils';
import { FaClock, FaTag, FaShareAlt, FaTwitter, FaFacebook, FaLinkedin } from 'react-icons/fa';



export default function BlogDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [blog, setBlog] = useState(null);
    const [relatedBlogs, setRelatedBlogs] = useState([]);
    const [tableOfContents, setTableOfContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeHeading, setActiveHeading] = useState('');

    const categories = getBlogCategories();

    useEffect(() => {
        if (params.slug) {
            loadBlog(params.slug);
        }
    }, [params.slug]);

    useEffect(() => {
        if (blog) {
            // Track page view
            trackBlogView(blog.id, blog.title);

            // Increment view count
            incrementViews();

            // Extract table of contents
            const headings = extractHeadings(blog.content);
            setTableOfContents(headings);

            // Set up SEO
            const seo = generateBlogSEO(blog, process.env.NEXT_PUBLIC_SITE_URL);
            updateMetaTags(seo);

            // Add structured data
            const structuredData = generateBlogStructuredData(
                blog,
                process.env.NEXT_PUBLIC_SITE_URL,
                { name: blog.author }
            );
            addStructuredData(structuredData);
        }
    }, [blog]);

    const loadBlog = async (slug) => {
        try {
            const docs = await getAllDocuments(COLLECTIONS.BLOGS);
            const foundBlog = docs.find((b) => b.slug === slug && b.status === 'published');

            if (!foundBlog) {
                router.push('/blog');
                return;
            }

            setBlog(foundBlog);

            // Load related blogs (same category)
            const related = docs
                .filter(
                    (b) =>
                        b.id !== foundBlog.id &&
                        b.status === 'published' &&
                        b.category === foundBlog.category
                )
                .slice(0, 3);
            setRelatedBlogs(related);
        } catch (error) {
            console.error('Error loading blog:', error);
            router.push('/blog');
        } finally {
            setLoading(false);
        }
    };

    const incrementViews = async () => {
        if (!blog) return;
        try {
            await updateDocument(COLLECTIONS.BLOGS, blog.id, {
                views: (blog.views || 0) + 1,
            });
        } catch (error) {
            console.error('Error incrementing views:', error);
        }
    };

    const updateMetaTags = (seo) => {
        document.title = seo.title;

        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', seo.description);
        }

        // OG tags
        let ogTitle = document.querySelector('meta[property="og:title"]');
        if (!ogTitle) {
            ogTitle = document.createElement('meta');
            ogTitle.setAttribute('property', 'og:title');
            document.head.appendChild(ogTitle);
        }
        ogTitle.setAttribute('content', seo.title);

        let ogDescription = document.querySelector('meta[property="og:description"]');
        if (!ogDescription) {
            ogDescription = document.createElement('meta');
            ogDescription.setAttribute('property', 'og:description');
            document.head.appendChild(ogDescription);
        }
        ogDescription.setAttribute('content', seo.description);

        if (seo.ogImage) {
            let ogImage = document.querySelector('meta[property="og:image"]');
            if (!ogImage) {
                ogImage = document.createElement('meta');
                ogImage.setAttribute('property', 'og:image');
                document.head.appendChild(ogImage);
            }
            ogImage.setAttribute('content', seo.ogImage);
        }
    };

    const addStructuredData = (data) => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(data);
        document.head.appendChild(script);
    };

    const shareOnSocial = (platform) => {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(blog.title);

        const urls = {
            twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
        };

        if (urls[platform]) {
            window.open(urls[platform], '_blank', 'width=600,height=400');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader size="lg" />
            </div>
        );
    }

    if (!blog) {
        return null;
    }

    return (
        <div className="min-h-screen py-20">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    {/* Breadcrumb */}
                    <div className="mb-6 text-sm">
                        <Link href="/blog" className="text-primary hover:underline">
                            Blog
                        </Link>
                        <span className="mx-2 text-text-secondary">/</span>
                        <span className="text-text-secondary">{blog.title}</span>
                    </div>

                    {/* Category and Meta */}
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                            {categories.find((c) => c.value === blog.category)?.label}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-text-secondary">
                            <FaClock /> {blog.readingTime} min read
                        </span>
                        <span className="text-sm text-text-secondary">
                            {formatDate(blog.publishedAt, 'long')}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-5xl font-bold mb-4">{blog.title}</h1>

                    {/* Author */}
                    <p className="text-lg text-text-secondary mb-6">By {blog.author}</p>

                    {/* Cover Image */}
                    {blog.coverImage && (
                        <img
                            src={blog.coverImage}
                            alt={blog.title}
                            className="w-full h-96 object-cover rounded-lg mb-8"
                        />
                    )}

                    {/* Share Buttons */}
                    <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border">
                        <span className="text-sm font-medium flex items-center gap-2">
                            <FaShareAlt /> Share:
                        </span>
                        <button
                            onClick={() => shareOnSocial('twitter')}
                            className="p-2 hover:bg-hover rounded-lg transition-colors"
                            title="Share on Twitter"
                        >
                            <FaTwitter className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => shareOnSocial('facebook')}
                            className="p-2 hover:bg-hover rounded-lg transition-colors"
                            title="Share on Facebook"
                        >
                            <FaFacebook className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => shareOnSocial('linkedin')}
                            className="p-2 hover:bg-hover rounded-lg transition-colors"
                            title="Share on LinkedIn"
                        >
                            <FaLinkedin className="w-5 h-5" />
                        </button>
                    </div>
                </motion.div>

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="prose prose-invert max-w-none mb-12"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                />

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-border">
                        <span className="text-sm font-medium flex items-center gap-2">
                            <FaTag /> Tags:
                        </span>
                        {blog.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-surface text-sm rounded-full hover:bg-hover transition-colors"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Related Posts */}
                {relatedBlogs.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-3xl font-bold mb-6">Related Posts</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedBlogs.map((relatedBlog) => (
                                <Link key={relatedBlog.id} href={`/blog/${relatedBlog.slug}`}>
                                    <Card className="h-full hover:shadow-xl transition-shadow cursor-pointer">
                                        {relatedBlog.coverImage && (
                                            <img
                                                src={relatedBlog.coverImage}
                                                alt={relatedBlog.title}
                                                className="w-full h-32 object-cover rounded-lg mb-3"
                                            />
                                        )}
                                        <h3 className="font-bold mb-2 line-clamp-2">
                                            {relatedBlog.title}
                                        </h3>
                                        <p className="text-sm text-text-secondary line-clamp-2">
                                            {relatedBlog.excerpt}
                                        </p>
                                        <p className="text-xs text-text-secondary mt-2">
                                            {formatDate(relatedBlog.publishedAt, 'short')}
                                        </p>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Back to Blog */}
                <div className="mt-12 text-center">
                    <Link
                        href="/blog"
                        className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        ← Back to Blog
                    </Link>
                </div>
            </div>
        </div>
    );
}
