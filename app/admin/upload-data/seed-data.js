export const SEED_DATA = {
    profile: {
        name: "Prince",
        title: "Founder & Full-Stack Product Builder",
        bio: "Founder who ships real products in EdTech, Creator Tools, and SaaS — from idea to deployment. I build systems, not just code.",
        email: "monsterprince3633@gmail.com",
        location: "Delhi, India",
        yearsOfExperience: 3,
        startupsLaunched: 7,
        projectsCompleted: 15,
        resumeUrl: "", // User can update this later
        heroImage: "", // User can update this later
        socialLinks: {
            linkedin: "", // To be filled
            github: "", // To be filled
            twitter: "", // To be filled
            youtube: "Snap Shiksha",
            instagram: ""
        }
    },
    skills: [
        // Frontend
        { name: "React.js", category: "Frontend", proficiency: 95, icon: "FaReact" },
        { name: "Next.js", category: "Frontend", proficiency: 90, icon: "SiNextdotjs" },
        { name: "JavaScript", category: "Frontend", proficiency: 95, icon: "SiJavascript" },
        { name: "TypeScript", category: "Frontend", proficiency: 85, icon: "SiTypescript" },
        { name: "Tailwind CSS", category: "Frontend", proficiency: 95, icon: "SiTailwindcss" },
        { name: "HTML5", category: "Frontend", proficiency: 100, icon: "FaHtml5" },
        { name: "CSS3", category: "Frontend", proficiency: 95, icon: "FaCss3Alt" },

        // Backend
        { name: "Node.js", category: "Backend", proficiency: 90, icon: "FaNodeJs" },
        { name: "Express.js", category: "Backend", proficiency: 90, icon: "SiExpress" },
        { name: "REST APIs", category: "Backend", proficiency: 95, icon: "AiOutlineApi" },
        { name: "Firebase", category: "Backend", proficiency: 95, icon: "SiFirebase" },
        { name: "MongoDB", category: "Backend", proficiency: 85, icon: "SiMongodb" },
        { name: "PostgreSQL", category: "Backend", proficiency: 70, icon: "SiPostgresql" },

        // AI & Automation
        { name: "AI API Integrations", category: "AI & Automation", proficiency: 90, icon: "FaRobot" },
        { name: "Prompt Engineering", category: "AI & Automation", proficiency: 95, icon: "FaBrain" },
        { name: "AI Content Gen", category: "AI & Automation", proficiency: 90, icon: "FaMagic" },

        // Tools & DevOps
        { name: "Git & GitHub", category: "DevOps", proficiency: 90, icon: "FaGithub" },
        { name: "VS Code", category: "Tools", proficiency: 100, icon: "SiVisualstudiocode" },
        { name: "Postman", category: "Tools", proficiency: 90, icon: "SiPostman" },

        // Business
        { name: "Product Management", category: "Business", proficiency: 85, icon: "FaChartLine" },
        { name: "Startup Strategy", category: "Business", proficiency: 90, icon: "FaRocket" },
        { name: "EdTech Expertise", category: "Business", proficiency: 95, icon: "FaGraduationCap" }
    ],
    experience: [
        {
            company: "SnapShiksha / Snap6",
            position: "Founder & Product Builder",
            location: "Delhi, India",
            startDate: "2024-01",
            endDate: null, // Present
            current: true,
            description: "Built and launched education platforms connecting students with teachers. Managed product strategy, development, branding, and execution.",
            responsibilities: [
                "Built and launched education platforms connecting students with teachers in under 30 minutes.",
                "Designed full-stack systems including user dashboards, admin panels, payments, and notifications.",
                "Implemented low-cost service models (₹99/hour) targeting mass adoption in India.",
                "Managed product strategy, development, branding, and execution independently."
            ],
            techStack: ["React", "Node.js", "Firebase", "MongoDB", "Razorpay"],
            type: "founder"
        },
        {
            company: "Freelance & Projects",
            position: "Software Developer",
            location: "Remote",
            startDate: "2023-01",
            endDate: null, // Present
            current: true,
            description: "Developed multiple web applications including LMS tools, IMS systems, e-commerce platforms, and QR-based restaurant ordering systems.",
            responsibilities: [
                "Developed multiple web applications including LMS tools, IMS systems, e-commerce platforms, and QR-based restaurant ordering systems.",
                "Integrated payment gateways, real-time notifications, and analytics dashboards.",
                "Focused on performance, usability, and rapid iteration based on user feedback."
            ],
            techStack: ["Full Stack", "Web Development", "System Design"],
            type: "freelance"
        }
    ],
    startups: [
        {
            name: "SnapShiksha",
            tagline: "On-demand home & online tutoring platform",
            description: "Flagship ed-tech startup connecting students with teachers in 30 minutes. Features ₹99/hour pricing model, marketplace, and payments.",
            status: "Active",
            role: "Founder",
            featured: true,
            techStack: ["React", "Node.js", "Firebase"],
            order: 1
        },
        {
            name: "Snap6",
            tagline: "Teacher Order & Management Platform",
            description: "Platform where teachers receive student orders, view details, and send professional auto-generated messages.",
            status: "Active",
            role: "Founder",
            featured: true,
            techStack: ["React", "Automation"],
            order: 2
        },
        {
            name: "Hubsnap Creator OS",
            tagline: "Creator Operating System",
            description: "Comprehensive dashboard for YouTube & Instagram creators to track analytics and generate content.",
            status: "Active",
            role: "Founder",
            featured: true,
            techStack: ["React", "AI APIs", "Analytics"],
            order: 3
        },
        {
            name: "Secure Future Academy",
            tagline: "Cybersecurity Education",
            description: "Ethical hacking and cybersecurity education platform for schools and institutes.",
            status: "Active",
            role: "Founder",
            featured: false,
            techStack: ["Education", "Security"],
            order: 4
        },
        {
            name: "Snapsix",
            tagline: "Parent Brand",
            description: "Umbrella identity behind multiple products.",
            status: "Active",
            role: "Founder",
            featured: false,
            techStack: ["Brand"],
            order: 5
        }
    ],
    projects: [
        {
            title: "SnapShiksha Platform",
            description: "Full-stack ed-tech platform for on-demand tutoring.",
            longDescription: "A comprehensive marketplace connecting students with tutors. Features include real-time booking, payment integration, teacher dashboards, and admin analytics. Supports both home and online tutoring models.",
            category: "Web Application",
            technologies: ["React", "Node.js", "Firebase", "Razorpay"],
            status: "completed",
            featured: true,
            liveUrl: "https://snapshiksha.com", // Placeholder if not known
            order: 1
        },
        {
            title: "Hubsnap Creator OS",
            description: "Analytics and content generation dashboard for creators.",
            longDescription: "An operating system for creators on YouTube and Instagram. Includes profile cards, content analytics, and AI-driven content generation tools.",
            category: "Web Application",
            technologies: ["React", "AI", "Dashboard"],
            status: "in-progress",
            featured: true,
            order: 2
        },
        {
            title: "AI Web & App Builder",
            description: "Generates full websites/apps from a single prompt.",
            longDescription: "An advanced tool that takes a user prompt and generates complete website or app code, including UI and backend logic. Not just templates, but real implementation.",
            category: "AI & Automation",
            technologies: ["AI", "React", "Node.js"],
            status: "completed",
            featured: true,
            order: 3
        },
        {
            title: "QR Restaurant Ordering",
            description: "Table-specific QR ordering system.",
            longDescription: "A digital menu and ordering system for restaurants. Users scan a QR code on their table to order. Includes admin dashboard for orders and revenue tracking.",
            category: "Web Application",
            technologies: ["React", "Firebase", "Real-time"],
            status: "completed",
            featured: false,
            order: 4
        },
        {
            title: "AI Content Generator",
            description: "Generates study materials for students.",
            longDescription: "Allows users to select class, subject, and chapter to generate summaries, important questions, and PDFs using AI.",
            category: "AI & Automation",
            technologies: ["AI", "PDF Generation"],
            status: "completed",
            featured: false,
            order: 5
        },
        {
            title: "Internal Management System (IMS)",
            description: "Admin & attendance management for institutes.",
            longDescription: "A dashboard for managing internal operations of educational institutes, including attendance tracking and staff management.",
            category: "Web Application",
            technologies: ["React", "Dashboard"],
            status: "in-progress",
            featured: false,
            order: 6
        },
        {
            title: "BRDL-AI",
            description: "WhatsApp-like chat platform with voice/video calls.",
            longDescription: "A secure chat application featuring real-time messaging, voice and video calls, file sharing, and local data persistence.",
            category: "Web Application",
            technologies: ["WebRTC", "Socket.io", "React"],
            status: "completed",
            featured: false,
            order: 7
        },
        {
            title: "ZsanpyPro",
            description: "SaaS-style pro tools suite.",
            longDescription: "A suite of advanced tools and workflows designed for power users, positioned as a premium SaaS product.",
            category: "Web Application",
            technologies: ["SaaS", "React"],
            status: "completed",
            featured: false,
            order: 8
        },
        {
            title: "E-Commerce Platform",
            description: "Full-featured online store with admin panel.",
            longDescription: "A complete e-commerce solution with product management, shopping cart, order processing, and a comprehensive admin dashboard.",
            category: "Web Application",
            technologies: ["React", "Node.js", "Stripe/Razorpay"],
            status: "completed",
            featured: false,
            order: 9
        },
        {
            title: "Focus Timer",
            description: "Productivity timer for students.",
            longDescription: "A dedicated focus timer app designed to help students manage study sessions effectively.",
            category: "Tool",
            technologies: ["React", "Timer Logic"],
            status: "completed",
            featured: false,
            order: 10
        }
    ]
};
