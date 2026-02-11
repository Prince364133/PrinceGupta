// lib/utils/seo.js

/**
 * Generate meta tags for a page
 * @param {Object} config SEO configuration
 * @returns {Object} Meta tags object
 */
export const generateMetaTags = (config) => {
    const {
        title,
        description,
        keywords = [],
        ogImage,
        ogTitle,
        ogDescription,
        canonicalUrl,
        twitterCard = 'summary_large_image',
        articleTags = {},
        noIndex = false,
    } = config;

    const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Prince Kumar';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://princekumar.web.app';
    const defaultDescription = 'Full-stack developer and entrepreneur building innovative solutions and launching successful startups.';

    const metadata = {
        title: {
            default: siteName,
            template: `%s | ${siteName}`,
        },
        description: description || defaultDescription,
        keywords: keywords.length > 0 ? keywords.join(', ') : ['Prince Kumar', 'Developer', 'Entrepreneur', 'Full Stack', 'Startups', 'Web Development', 'Software Engineer', 'Tech Founder'],
        authors: [{ name: 'Prince Kumar' }],
        creator: 'Prince Kumar',
        publisher: 'Prince Kumar',
        metadataBase: new URL(siteUrl),
        alternates: {
            canonical: canonicalUrl || '/',
        },
        applicationName: 'Prince Kumar Portfolio',
        referrer: 'origin-when-cross-origin',
        formatDetection: {
            email: false,
            address: false,
            telephone: false,
        },
        openGraph: {
            type: articleTags.publishedTime ? 'article' : 'website',
            locale: 'en_US',
            url: canonicalUrl || '/',
            siteName,
            title: ogTitle || title || siteName,
            description: ogDescription || description || defaultDescription,
            images: ogImage ? [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: ogTitle || title || siteName,
                },
            ] : [
                {
                    url: '/og-image.png',
                    width: 1200,
                    height: 630,
                    alt: siteName,
                }
            ],
            ...(articleTags.publishedTime && {
                publishedTime: articleTags.publishedTime,
                modifiedTime: articleTags.modifiedTime,
                authors: ['Prince Kumar'],
                tags: articleTags.tags || [],
            }),
        },
        twitter: {
            card: twitterCard,
            site: '@PrinceGupta',
            creator: '@PrinceGupta',
            title: ogTitle || title || siteName,
            description: ogDescription || description || defaultDescription,
            images: ogImage ? [ogImage] : ['/og-image.png'],
        },
        robots: {
            index: !noIndex,
            follow: !noIndex,
            nocache: false,
            googleBot: {
                index: !noIndex,
                follow: !noIndex,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        verification: {
            google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || '',
            yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || '',
            yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION || '',
        },
        category: 'technology',
    };

    return metadata;
};

/**
 * Generate JSON-LD structured data for a person
 * @param {Object} profile Profile data
 * @returns {Object} JSON-LD object
 */
export const generatePersonSchema = (profile) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://princekumar.web.app';

    return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: profile.name || 'Prince Kumar',
        jobTitle: profile.title || 'Developer & Entrepreneur',
        description: profile.bio || '',
        url: siteUrl,
        image: profile.heroImage || '',
        email: profile.email || '',
        telephone: profile.phone || '',
        address: {
            '@type': 'PostalAddress',
            addressLocality: profile.location || '',
        },
        sameAs: profile.socialLinks || [],
    };
};

/**
 * Generate JSON-LD structured data for a project
 * @param {Object} project Project data
 * @returns {Object} JSON-LD object
 */
export const generateProjectSchema = (project) => {
    return {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: project.title,
        description: project.description,
        url: project.liveUrl || '',
        image: project.images?.[0] || '',
        author: {
            '@type': 'Person',
            name: 'Prince Kumar',
        },
        dateCreated: project.startDate || '',
        dateModified: project.endDate || '',
        keywords: project.techStack?.join(', ') || '',
    };
};

/**
 * Generate JSON-LD structured data for an organization (startup)
 * @param {Object} startup Startup data
 * @returns {Object} JSON-LD object
 */
export const generateOrganizationSchema = (startup) => {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: startup.name,
        description: startup.description,
        url: startup.website || '',
        logo: startup.logo || '',
        foundingDate: startup.founded || '',
        founder: {
            '@type': 'Person',
            name: 'Prince Kumar',
        },
    };
};

/**
 * Generate breadcrumb structured data
 * @param {Array} items Breadcrumb items
 * @returns {Object} JSON-LD object
 */
export const generateBreadcrumbSchema = (items) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://princekumar.web.app';

    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${siteUrl}${item.path}`,
        })),
    };
};

/**
 * Generate JSON-LD structured data for a blog post
 * @param {Object} post Blog post data
 * @returns {Object} JSON-LD object
 */
export const generateBlogPostSchema = (post) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://princekumar.web.app';

    return {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt || post.description,
        image: post.coverImage || '',
        datePublished: post.publishedAt?.toDate?.()?.toISOString() || '',
        dateModified: post.updatedAt?.toDate?.()?.toISOString() || '',
        author: {
            '@type': 'Person',
            name: 'Prince Kumar',
            url: siteUrl,
        },
        publisher: {
            '@type': 'Person',
            name: 'Prince Kumar',
            url: siteUrl,
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${siteUrl}/blog/${post.id}`,
        },
        keywords: post.tags?.join(', ') || '',
    };
};

/**
 * Generate WebSite schema with search action
 * @returns {Object} JSON-LD object
 */
export const generateWebSiteSchema = () => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://princekumar.web.app';
    const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Prince Kumar';

    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: siteName,
        url: siteUrl,
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${siteUrl}/search?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    };
};

/**
 * Generate FAQ schema
 * @param {Array} faqs Array of FAQ items with question and answer
 * @returns {Object} JSON-LD object
 */
export const generateFAQSchema = (faqs) => {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    };
};
