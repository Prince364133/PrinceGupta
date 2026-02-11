export default function robots() {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/admin/*',
                    '/admin',
                    '/api/*',
                    '/_next/static/*/buildManifest.js',
                    '/_next/static/*/ssgManifest.js',
                ],
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: ['/admin/*', '/api/*'],
            },
            {
                userAgent: 'Bingbot',
                allow: '/',
                disallow: ['/admin/*', '/api/*'],
            },
        ],
        sitemap: 'https://princekumar.web.app/sitemap.xml',
        host: 'https://princekumar.web.app',
    };
}
