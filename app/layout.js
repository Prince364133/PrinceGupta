// app/layout.js
import { Inter, Source_Code_Pro } from 'next/font/google';
import './globals.css';
import './test-features/styles.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TransitionProvider from '@/components/layout/TransitionProvider';
import ScrollToTop from '@/components/ui/ScrollToTop';
import { generateMetaTags, generatePersonSchema } from '@/lib/utils/seo';
import { Toaster } from 'react-hot-toast';

// Dummy profile data for schema - ideally this comes from a central data file
const profileData = {
    name: 'Prince Kumar',
    title: 'Full-Stack Developer & Entrepreneur',
    bio: 'Full-stack developer and entrepreneur with expertise in building scalable web applications and launching successful startups.',
    location: 'India',
    email: 'contact@princekumar.dev',
    socialLinks: [
        'https://github.com/Prince364133',
        'https://instagram.com/prince_gupta3608'
    ]
};

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

const sourceCodePro = Source_Code_Pro({
    subsets: ['latin'],
    variable: '--font-source-code-pro',
    display: 'swap',
});

export const metadata = generateMetaTags({
    title: 'Prince Kumar - Developer & Entrepreneur',
    description: 'Full-stack developer and entrepreneur with expertise in building scalable web applications and launching successful startups.',
    keywords: ['Prince Kumar', 'Developer', 'Entrepreneur', 'Full Stack', 'Web Development', 'Startups'],
});

export default function RootLayout({ children }) {
    const personSchema = generatePersonSchema(profileData);

    return (
        <html lang="en" className={`${inter.variable} ${sourceCodePro.variable}`}>
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
                />
            </head>
            <body className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-grow">
                    <TransitionProvider>
                        {children}
                    </TransitionProvider>
                </main>
                <Footer />
                <Toaster position="top-right" />
                <ScrollToTop />
            </body>
        </html>
    );
}
