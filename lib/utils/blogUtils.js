// lib/utils/blogUtils.js

/**
 * Generate a URL-friendly slug from a title
 * @param {string} title - The blog title
 * @returns {string} - URL-friendly slug
 */
export const generateSlug = (title) => {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Calculate estimated reading time based on content
 * @param {string} content - The blog content (HTML or plain text)
 * @returns {number} - Reading time in minutes
 */
export const calculateReadingTime = (content) => {
    if (!content) return 0;

    // Remove HTML tags
    const text = content.replace(/<[^>]*>/g, '');

    // Count words (average reading speed: 200 words per minute)
    const wordCount = text.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    return readingTime || 1; // Minimum 1 minute
};

/**
 * Extract headings from HTML content for table of contents
 * @param {string} content - The blog content (HTML)
 * @returns {Array} - Array of heading objects {level, text, id}
 */
export const extractHeadings = (content) => {
    if (!content) return [];

    const headings = [];
    const regex = /<h([1-6])[^>]*>(.*?)<\/h\1>/gi;
    let match;

    while ((match = regex.exec(content)) !== null) {
        const level = parseInt(match[1]);
        const text = match[2].replace(/<[^>]*>/g, ''); // Remove any nested tags
        const id = generateSlug(text);

        headings.push({ level, text, id });
    }

    return headings;
};

/**
 * Format a timestamp to a readable date string
 * @param {Date|Timestamp} timestamp - The timestamp to format
 * @param {string} format - Format type ('short', 'long', 'relative')
 * @returns {string} - Formatted date string
 */
export const formatDate = (timestamp, format = 'long') => {
    if (!timestamp) return '';

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);

    if (format === 'short') {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    }

    if (format === 'relative') {
        const now = new Date();
        const diffInMs = now - date;
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return 'Today';
        if (diffInDays === 1) return 'Yesterday';
        if (diffInDays < 7) return `${diffInDays} days ago`;
        if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
        if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
        return `${Math.floor(diffInDays / 365)} years ago`;
    }

    // Default: long format
    return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
};

/**
 * Truncate content to create an excerpt
 * @param {string} content - The full content (HTML or plain text)
 * @param {number} length - Maximum length in characters
 * @returns {string} - Truncated excerpt
 */
export const truncateExcerpt = (content, length = 160) => {
    if (!content) return '';

    // Remove HTML tags
    const text = content.replace(/<[^>]*>/g, '');

    if (text.length <= length) return text;

    // Truncate and add ellipsis
    return text.substring(0, length).trim() + '...';
};

/**
 * Get blog categories
 * @returns {Array} - Array of category objects
 */
export const getBlogCategories = () => {
    return [
        { value: 'web-development', label: 'Web Development' },
        { value: 'mobile-development', label: 'Mobile Development' },
        { value: 'devops', label: 'DevOps' },
        { value: 'design', label: 'Design' },
        { value: 'entrepreneurship', label: 'Entrepreneurship' },
        { value: 'tutorials', label: 'Tutorials' },
        { value: 'case-studies', label: 'Case Studies' },
        { value: 'news-updates', label: 'News & Updates' },
    ];
};

/**
 * Validate blog data
 * @param {Object} blogData - The blog data to validate
 * @returns {Object} - Validation result {valid, errors}
 */
export const validateBlogData = (blogData) => {
    const errors = {};

    if (!blogData.title || blogData.title.trim().length === 0) {
        errors.title = 'Title is required';
    }

    if (!blogData.slug || blogData.slug.trim().length === 0) {
        errors.slug = 'Slug is required';
    }

    if (!blogData.content || blogData.content.trim().length === 0) {
        errors.content = 'Content is required';
    }

    if (!blogData.category) {
        errors.category = 'Category is required';
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};

/**
 * Generate SEO metadata for a blog post
 * @param {Object} blog - The blog post object
 * @param {string} siteUrl - The site URL
 * @returns {Object} - SEO metadata object
 */
export const generateBlogSEO = (blog, siteUrl) => {
    return {
        title: blog.metaTitle || `${blog.title} | Blog`,
        description: blog.metaDescription || blog.excerpt || truncateExcerpt(blog.content, 160),
        ogImage: blog.ogImage || blog.coverImage,
        canonical: `${siteUrl}/blog/${blog.slug}`,
        keywords: blog.tags ? blog.tags.join(', ') : '',
    };
};

/**
 * Generate JSON-LD structured data for a blog post
 * @param {Object} blog - The blog post object
 * @param {string} siteUrl - The site URL
 * @param {Object} author - The author object
 * @returns {Object} - JSON-LD structured data
 */
export const generateBlogStructuredData = (blog, siteUrl, author) => {
    return {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: blog.title,
        image: blog.coverImage || `${siteUrl}/default-blog-image.jpg`,
        datePublished: blog.publishedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        dateModified: blog.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        author: {
            '@type': 'Person',
            name: author?.name || 'Prince Kumar',
            url: siteUrl,
        },
        publisher: {
            '@type': 'Organization',
            name: process.env.NEXT_PUBLIC_SITE_NAME || 'Prince Kumar',
            logo: {
                '@type': 'ImageObject',
                url: `${siteUrl}/logo.png`,
            },
        },
        description: blog.excerpt || truncateExcerpt(blog.content, 160),
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${siteUrl}/blog/${blog.slug}`,
        },
    };
};
