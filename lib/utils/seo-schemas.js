// lib/utils/seo.js - Additional SEO Schema Functions

/**
 * Generate ProfilePage schema
 * @param {Object} profile Profile data
 * @returns {Object} JSON-LD object
 */
export const generateProfilePageSchema = (profile) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://princekumar.web.app';

    return {
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        dateCreated: profile.createdAt?.toDate?.()?.toISOString() || '',
        dateModified: profile.updatedAt?.toDate?.()?.toISOString() || '',
        mainEntity: {
            '@type': 'Person',
            name: profile.name || 'Prince Kumar',
            alternateName: profile.alternateName || '',
            jobTitle: profile.title || 'Developer & Entrepreneur',
            description: profile.bio || '',
            url: siteUrl,
            image: profile.heroImage || '',
            email: profile.email || '',
            telephone: profile.phone || '',
            address: {
                '@type': 'PostalAddress',
                addressLocality: profile.location || 'India',
                addressCountry: 'IN',
            },
            sameAs: profile.socialLinks || [],
            knowsAbout: profile.skills?.map(s => s.name) || [],
            alumniOf: profile.education?.map(edu => ({
                '@type': 'EducationalOrganization',
                name: edu.institution,
            })) || [],
            worksFor: profile.experience?.map(exp => ({
                '@type': 'Organization',
                name: exp.company,
            })) || [],
        },
    };
};

/**
 * Generate ItemList schema for collections
 * @param {Array} items Array of items
 * @param {String} listType Type of list (projects, blogs, skills, etc.)
 * @returns {Object} JSON-LD object
 */
export const generateItemListSchema = (items = [], listType = 'projects') => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://princekumar.web.app';

    // Return empty schema if no items
    if (!items || items.length === 0) {
        return {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            itemListElement: [],
        };
    }

    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `${siteUrl}/${listType}/${item.id || item.slug}`,
            name: item.title || item.name,
        })),
    };
};

/**
 * Generate Review/Rating schema for testimonials
 * @param {Object} testimonial Testimonial data
 * @returns {Object} JSON-LD object
 */
export const generateReviewSchema = (testimonial) => {
    return {
        '@context': 'https://schema.org',
        '@type': 'Review',
        author: {
            '@type': 'Person',
            name: testimonial.name,
            jobTitle: testimonial.position,
            worksFor: {
                '@type': 'Organization',
                name: testimonial.company,
            },
        },
        reviewBody: testimonial.content,
        reviewRating: {
            '@type': 'Rating',
            ratingValue: testimonial.rating || 5,
            bestRating: 5,
        },
        itemReviewed: {
            '@type': 'Person',
            name: 'Prince Kumar',
        },
    };
};

/**
 * Generate CollectionPage schema
 * @param {String} name Collection name
 * @param {String} description Collection description
 * @returns {Object} JSON-LD object
 */
export const generateCollectionPageSchema = (name, description) => {
    return {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name,
        description,
    };
};

/**
 * Generate Breadcrumb schema
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
 * Generate ImageObject schema
 * @param {String} url Image URL
 * @param {String} caption Image caption
 * @param {Number} width Image width
 * @param {Number} height Image height
 * @returns {Object} JSON-LD object
 */
export const generateImageObjectSchema = (url, caption, width = 1200, height = 630) => {
    return {
        '@context': 'https://schema.org',
        '@type': 'ImageObject',
        url,
        caption,
        width,
        height,
    };
};
