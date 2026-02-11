import { getAllDocuments } from '@/lib/firebase/firestore';
import { COLLECTIONS } from '@/lib/schema/collections';

export default async function sitemap() {
    const baseUrl = 'https://princekumar.web.app';

    try {
        // Fetch dynamic content from Firestore
        const [blogs, projects, startups] = await Promise.all([
            getAllDocuments(COLLECTIONS.BLOGS).catch(() => []),
            getAllDocuments(COLLECTIONS.PROJECTS).catch(() => []),
            getAllDocuments(COLLECTIONS.STARTUPS).catch(() => []),
        ]);

        // Root routes with high priority
        const routes = [
            {
                url: `${baseUrl}`,
                lastModified: new Date().toISOString(),
                changeFrequency: 'daily',
                priority: 1.0,
            },
            {
                url: `${baseUrl}/about`,
                lastModified: new Date().toISOString(),
                changeFrequency: 'monthly',
                priority: 0.9,
            },
            {
                url: `${baseUrl}/skills`,
                lastModified: new Date().toISOString(),
                changeFrequency: 'monthly',
                priority: 0.8,
            },
            {
                url: `${baseUrl}/projects`,
                lastModified: new Date().toISOString(),
                changeFrequency: 'weekly',
                priority: 0.9,
            },
            {
                url: `${baseUrl}/startups`,
                lastModified: new Date().toISOString(),
                changeFrequency: 'monthly',
                priority: 0.8,
            },
            {
                url: `${baseUrl}/blog`,
                lastModified: new Date().toISOString(),
                changeFrequency: 'daily',
                priority: 0.9,
            },
            {
                url: `${baseUrl}/resume`,
                lastModified: new Date().toISOString(),
                changeFrequency: 'monthly',
                priority: 0.7,
            },
            {
                url: `${baseUrl}/media`,
                lastModified: new Date().toISOString(),
                changeFrequency: 'weekly',
                priority: 0.6,
            },
            {
                url: `${baseUrl}/contact`,
                lastModified: new Date().toISOString(),
                changeFrequency: 'yearly',
                priority: 0.7,
            },
        ];

        // Add blog posts
        const blogRoutes = blogs.map((blog) => ({
            url: `${baseUrl}/blog/${blog.slug || blog.id}`,
            lastModified: blog.updatedAt?.toDate?.()?.toISOString() || blog.publishedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            changeFrequency: 'monthly',
            priority: 0.7,
        }));

        // Add projects
        const projectRoutes = projects.map((project) => ({
            url: `${baseUrl}/projects/${project.id}`,
            lastModified: project.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            changeFrequency: 'monthly',
            priority: 0.8,
        }));

        // Add startups (if they have detail pages)
        const startupRoutes = startups
            .filter(startup => startup.hasDetailPage)
            .map((startup) => ({
                url: `${baseUrl}/startups/${startup.id}`,
                lastModified: startup.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
                changeFrequency: 'monthly',
                priority: 0.7,
            }));

        return [...routes, ...blogRoutes, ...projectRoutes, ...startupRoutes];
    } catch (error) {
        console.error('Error generating sitemap:', error);

        // Fallback to static routes if Firestore fails
        return [
            {
                url: `${baseUrl}`,
                lastModified: new Date().toISOString(),
                changeFrequency: 'daily',
                priority: 1.0,
            },
            {
                url: `${baseUrl}/about`,
                lastModified: new Date().toISOString(),
                changeFrequency: 'monthly',
                priority: 0.9,
            },
            {
                url: `${baseUrl}/skills`,
                lastModified: new Date().toISOString(),
                changeFrequency: 'monthly',
                priority: 0.8,
            },
            {
                url: `${baseUrl}/projects`,
                lastModified: new Date().toISOString(),
                changeFrequency: 'weekly',
                priority: 0.9,
            },
            {
                url: `${baseUrl}/blog`,
                lastModified: new Date().toISOString(),
                changeFrequency: 'daily',
                priority: 0.9,
            },
            {
                url: `${baseUrl}/contact`,
                lastModified: new Date().toISOString(),
                changeFrequency: 'yearly',
                priority: 0.7,
            },
        ];
    }
}
