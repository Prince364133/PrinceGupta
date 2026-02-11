// scripts/seedData.js
// Run this script to populate Firestore with sample data
// Usage: node scripts/seedData.js

const admin = require('firebase-admin');
const serviceAccount = require('../.env.local'); // You'll need to configure this

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const sampleData = {
    profile: {
        name: 'Prince Kumar',
        title: 'Full-Stack Developer & Entrepreneur',
        bio: 'Passionate developer with expertise in building scalable web applications and launching successful startups.',
        heroImage: '',
        resumeUrl: '',
        location: 'India',
        email: 'prince@example.com',
        phone: '+91 1234567890',
        yearsOfExperience: 3,
        projectsCompleted: 50,
        startupsLaunched: 5,
        technologiesMastered: 10,
    },

    projects: [
        {
            title: 'E-Commerce Platform',
            description: 'A full-featured e-commerce platform with payment integration',
            longDescription: 'Built a comprehensive e-commerce solution with user authentication, product management, shopping cart, and payment gateway integration.',
            techStack: ['Next.js', 'Node.js', 'MongoDB', 'Stripe'],
            category: 'Web',
            status: 'Live',
            liveUrl: 'https://example.com',
            githubUrl: 'https://github.com/example',
            images: [],
            features: ['User Authentication', 'Payment Integration', 'Admin Dashboard', 'Order Management'],
            challenges: 'Implementing secure payment processing and handling concurrent orders',
            learnings: 'Learned about payment gateway integration and database optimization',
            startDate: '2023-01',
            endDate: '2023-06',
            teamSize: 3,
            role: 'Full-Stack Developer',
            featured: true,
            order: 1,
        },
        {
            title: 'Social Media Dashboard',
            description: 'Analytics dashboard for social media management',
            longDescription: 'Created a comprehensive dashboard for managing multiple social media accounts with analytics and scheduling features.',
            techStack: ['React', 'Express', 'PostgreSQL', 'Redis'],
            category: 'Web',
            status: 'Live',
            liveUrl: 'https://example.com',
            githubUrl: '',
            images: [],
            features: ['Multi-platform Integration', 'Analytics', 'Post Scheduling', 'Team Collaboration'],
            challenges: 'Integrating with multiple social media APIs and handling rate limits',
            learnings: 'Gained experience with OAuth and API rate limiting strategies',
            startDate: '2023-07',
            endDate: '2023-12',
            teamSize: 2,
            role: 'Lead Developer',
            featured: true,
            order: 2,
        },
        {
            title: 'AI Content Generator',
            description: 'AI-powered content generation tool for marketers',
            longDescription: 'Developed an AI-powered tool that helps marketers generate high-quality content using GPT models.',
            techStack: ['Next.js', 'OpenAI API', 'Tailwind CSS', 'Firebase'],
            category: 'AI',
            status: 'Live',
            liveUrl: 'https://example.com',
            githubUrl: '',
            images: [],
            features: ['AI Content Generation', 'Template Library', 'Export Options', 'Usage Analytics'],
            challenges: 'Optimizing API costs and ensuring content quality',
            learnings: 'Learned about prompt engineering and AI model integration',
            startDate: '2024-01',
            endDate: '2024-03',
            teamSize: 1,
            role: 'Solo Developer',
            featured: true,
            order: 3,
        },
    ],

    startups: [
        {
            name: 'TechVenture',
            tagline: 'Building the future of work',
            description: 'A SaaS platform for remote team collaboration and productivity',
            longDescription: 'TechVenture is a comprehensive platform designed to help remote teams collaborate more effectively with integrated tools for project management, communication, and productivity tracking.',
            logo: '',
            images: [],
            founded: '2022',
            status: 'Active',
            website: 'https://techventure.example.com',
            teamSize: 5,
            role: 'Co-Founder & CTO',
            outcome: 'Currently serving 100+ companies with 5000+ active users',
            lessonsLearned: 'Building a scalable SaaS requires focus on user feedback and iterative development',
            techStack: ['Next.js', 'Node.js', 'PostgreSQL', 'Redis', 'AWS'],
            achievements: ['Reached 5000 users', 'Secured seed funding', 'Featured in TechCrunch'],
            featured: true,
            order: 1,
        },
        {
            name: 'EduLearn',
            tagline: 'Democratizing education',
            description: 'An online learning platform for skill development',
            longDescription: 'EduLearn provides affordable, high-quality courses for professionals looking to upskill in technology and business.',
            logo: '',
            images: [],
            founded: '2021',
            status: 'Acquired',
            website: '',
            teamSize: 8,
            role: 'Founder & CEO',
            outcome: 'Acquired by EdTech Corp in 2023',
            lessonsLearned: 'Content quality and instructor engagement are key to success in EdTech',
            techStack: ['React', 'Django', 'PostgreSQL', 'AWS'],
            achievements: ['10,000+ students', 'Acquired by major EdTech company', '4.8/5 average rating'],
            featured: true,
            order: 2,
        },
        {
            name: 'QuickShop',
            tagline: 'Fast grocery delivery',
            description: 'On-demand grocery delivery in 30 minutes',
            longDescription: 'QuickShop aimed to revolutionize grocery shopping with ultra-fast delivery, but faced challenges with unit economics.',
            logo: '',
            images: [],
            founded: '2020',
            status: 'Shutdown',
            website: '',
            teamSize: 12,
            role: 'Co-Founder & CTO',
            outcome: 'Shut down after 18 months due to unsustainable unit economics',
            lessonsLearned: 'Validate unit economics early and focus on sustainable growth over rapid expansion',
            techStack: ['React Native', 'Node.js', 'MongoDB', 'Google Maps API'],
            achievements: ['Served 5 cities', '50,000+ orders delivered', 'Raised $500K in funding'],
            featured: true,
            order: 3,
        },
    ],

    skills: [
        { name: 'React', category: 'Frontend', proficiency: 95, icon: '', yearsOfExperience: 3, order: 1 },
        { name: 'Next.js', category: 'Frontend', proficiency: 90, icon: '', yearsOfExperience: 2, order: 2 },
        { name: 'Node.js', category: 'Backend', proficiency: 90, icon: '', yearsOfExperience: 3, order: 3 },
        { name: 'Python', category: 'Backend', proficiency: 85, icon: '', yearsOfExperience: 2, order: 4 },
        { name: 'MongoDB', category: 'Database', proficiency: 85, icon: '', yearsOfExperience: 3, order: 5 },
        { name: 'PostgreSQL', category: 'Database', proficiency: 80, icon: '', yearsOfExperience: 2, order: 6 },
        { name: 'AWS', category: 'DevOps', proficiency: 75, icon: '', yearsOfExperience: 2, order: 7 },
        { name: 'Docker', category: 'DevOps', proficiency: 80, icon: '', yearsOfExperience: 2, order: 8 },
        { name: 'Tailwind CSS', category: 'Frontend', proficiency: 95, icon: '', yearsOfExperience: 2, order: 9 },
        { name: 'TypeScript', category: 'Frontend', proficiency: 85, icon: '', yearsOfExperience: 2, order: 10 },
    ],
};

async function seedDatabase() {
    try {
        console.log('Starting database seeding...');

        // Seed profile
        console.log('Seeding profile...');
        await db.collection('profile').add(sampleData.profile);

        // Seed projects
        console.log('Seeding projects...');
        for (const project of sampleData.projects) {
            await db.collection('projects').add(project);
        }

        // Seed startups
        console.log('Seeding startups...');
        for (const startup of sampleData.startups) {
            await db.collection('startups').add(startup);
        }

        // Seed skills
        console.log('Seeding skills...');
        for (const skill of sampleData.skills) {
            await db.collection('skills').add(skill);
        }

        console.log('Database seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
