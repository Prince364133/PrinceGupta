// lib/schema/collections.js

/**
 * Firestore collection names
 */
export const COLLECTIONS = {
    ADMIN: 'admin',
    PROFILE: 'profile',
    EDUCATION: 'education',
    SKILLS: 'skills',
    PROJECTS: 'projects',
    STARTUPS: 'startups',
    FAILURES: 'failures',
    EXPERIENCE: 'experience',
    TEAMS: 'teams',
    MEDIA: 'media',
    SOCIAL_LINKS: 'social_links',
    FORMS: 'forms',
    SEO_SETTINGS: 'seo_settings',
    ANALYTICS_EVENTS: 'analytics_events',
    BLOGS: 'blogs',
    RESUME: 'resume',
    TESTIMONIALS: 'testimonials',
    FEATURES: 'features',
    NEWSLETTER: 'newsletter',
};

/**
 * Document structure templates
 */
export const SCHEMAS = {
    profile: {
        name: '',
        title: '',
        bio: '',
        heroImage: '',
        resumeUrl: '',
        location: '',
        email: '',
        phone: '',
        yearsOfExperience: 0,
        projectsCompleted: 0,
        startupsLaunched: 0,
    },

    blog: {
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        coverImage: '',
        category: '',
        tags: [],
        author: '',
        status: 'draft', // 'draft' | 'published'
        featured: false,
        readingTime: 0,
        metaTitle: '',
        metaDescription: '',
        ogImage: '',
        publishedAt: null,
        views: 0,
        createdAt: null,
        updatedAt: null,
    },

    education: {
        institution: '',
        degree: '',
        field: '',
        startYear: '',
        endYear: '',
        description: '',
        achievements: [],
        image: '',
        order: 0,
    },

    skill: {
        name: '',
        category: '', // Frontend, Backend, DevOps, Tools, etc.
        proficiency: 0, // 0-100
        icon: '',
        yearsOfExperience: 0,
        order: 0,
    },

    project: {
        title: '',
        description: '',
        longDescription: '',
        techStack: [],
        category: '', // Web, Mobile, AI, etc.
        status: '', // Live, Failed, Archived
        liveUrl: '',
        githubUrl: '',
        images: [],
        features: [],
        challenges: '',
        learnings: '',
        startDate: '',
        endDate: '',
        teamSize: 0,
        role: '',
        featured: false,
        order: 0,
    },

    startup: {
        name: '',
        tagline: '',
        description: '',
        longDescription: '',
        logo: '',
        images: [],
        founded: '',
        status: '', // Active, Acquired, Shutdown
        website: '',
        teamSize: 0,
        role: '',
        outcome: '',
        lessonsLearned: '',
        techStack: [],
        achievements: [],
        featured: false,
        order: 0,
    },

    failure: {
        title: '',
        description: '',
        whatHappened: '',
        lessonsLearned: '',
        date: '',
        category: '', // Project, Startup, Career
        order: 0,
    },

    experience: {
        company: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
        responsibilities: [],
        achievements: [],
        techStack: [],
        logo: '',
        order: 0,
    },

    team: {
        name: '',
        role: '',
        bio: '',
        image: '',
        linkedin: '',
        twitter: '',
        github: '',
        order: 0,
    },

    media: {
        title: '',
        description: '',
        url: '',
        type: '', // image, video
        category: '',
        thumbnail: '',
        uploadedAt: null,
        order: 0,
    },

    socialLink: {
        platform: '', // GitHub, LinkedIn, Twitter, Instagram, etc.
        url: '',
        username: '',
        icon: '',
        followerCount: 0,
        order: 0,
    },

    form: {
        name: '',
        email: '',
        subject: '',
        message: '',
        phone: '',
        company: '',
        ip: '',
        userAgent: '',
        status: 'unread', // unread, read, replied
        submittedAt: null,
    },

    seoSettings: {
        page: '', // home, about, projects, etc.
        title: '',
        description: '',
        keywords: [],
        ogImage: '',
        ogTitle: '',
        ogDescription: '',
        twitterCard: 'summary_large_image',
        canonicalUrl: '',
        schema: {},
    },

    analyticsEvent: {
        eventType: '', // page_view, button_click, form_submission
        eventName: '',
        page: '',
        userId: '',
        sessionId: '',
        metadata: {},
        timestamp: null,
    },

    blog: {
        title: '',
        slug: '',
        excerpt: '',
        content: '', // Rich text HTML
        coverImage: '',
        author: '',
        category: '',
        tags: [],
        status: 'draft', // draft, published
        featured: false,
        seoTitle: '',
        seoDescription: '',
        seoKeywords: [],
        publishedAt: null,
        createdAt: null,
        updatedAt: null,
        readingTime: 0, // in minutes
        views: 0,
        order: 0,
    },

    resume: {
        title: '',
        description: '',
        fileUrl: '',
        fileName: '',
        fileSize: 0,
        uploadedAt: null,
        updatedAt: null,
        version: 1,
        isActive: true,
    },

    testimonial: {
        name: '',
        role: '',
        company: '',
        image: '',
        content: '',
        rating: 5,
        featured: false,
        order: 0,
        createdAt: null,
    },

    feature: {
        title: '',
        description: '',
        icon: '',
        category: '', // interactive, visual, functional
        enabled: true,
        order: 0,
    },

    newsletter: {
        email: '',
        subscribedAt: null,
        status: 'active', // active, unsubscribed
        source: 'footer', // footer, popup, etc.
        consent: true,
        ipAddress: '',
        userAgent: '',
    },
};
