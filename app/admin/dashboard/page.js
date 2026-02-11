// app/admin/dashboard/page.js
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import Loader from '@/components/ui/Loader';
import {
    FaProjectDiagram,
    FaRocket,
    FaEnvelope,
    FaEye,
    FaArrowUp,
    FaArrowRight,
    FaPlus
} from 'react-icons/fa';
import { getAllDocuments } from '@/lib/firebase/firestore';
import { COLLECTIONS } from '@/lib/schema/collections';
import Link from 'next/link';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        projects: 0,
        startups: 0,
        forms: 0,
        unreadForms: 0,
        skills: 0
    });
    const [projectData, setProjectData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const [projects, startups, forms, skills] = await Promise.all([
                getAllDocuments(COLLECTIONS.PROJECTS),
                getAllDocuments(COLLECTIONS.STARTUPS),
                getAllDocuments(COLLECTIONS.FORMS),
                getAllDocuments(COLLECTIONS.SKILLS)
            ]);

            setStats({
                projects: projects.length,
                startups: startups.length,
                forms: forms.length,
                unreadForms: forms.filter(f => f.status === 'unread').length,
                skills: skills.length
            });

            // Process data for charts
            // 1. Projects by Category
            const categories = {};
            projects.forEach(p => {
                const cat = p.category || 'Other';
                categories[cat] = (categories[cat] || 0) + 1;
            });

            const chartData = Object.keys(categories).map(key => ({
                name: key,
                value: categories[key]
            }));

            setProjectData(chartData);

        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            setLoading(false);
        }
    };

    // Dummy data for Area Chart (Activity)
    const activityData = [
        { name: 'Mon', visits: 40, views: 24 },
        { name: 'Tue', visits: 30, views: 13 },
        { name: 'Wed', visits: 20, views: 58 },
        { name: 'Thu', visits: 27, views: 39 },
        { name: 'Fri', visits: 18, views: 48 },
        { name: 'Sat', visits: 23, views: 38 },
        { name: 'Sun', visits: 34, views: 43 },
    ];

    const COLORS = ['#6366f1', '#10B981', '#8B5CF6', '#F59E0B'];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader size="lg" />
            </div>
        );
    }

    const StatCard = ({ label, value, icon: Icon, color, trend }) => (
        <Card className="relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Icon className={`w-24 h-24 text-${color}`} />
            </div>
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-lg bg-${color}/10 text-${color}`}>
                        <Icon size={24} />
                    </div>
                    {trend && (
                        <span className="flex items-center text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                            <FaArrowUp size={10} className="mr-1" />
                            {trend}
                        </span>
                    )}
                </div>
                <h3 className="text-3xl font-bold mb-1">{value}</h3>
                <p className="text-text-secondary text-sm font-medium">{label}</p>
            </div>
        </Card>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                        Dashboard Overview
                    </h1>
                    <p className="text-text-secondary">Welcome back, Prince. Here's what's happening today.</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/admin/upload-data">
                        <button className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-white/10 border border-white/10 rounded-lg text-sm transition-colors">
                            <FaPlus size={12} /> Upload Data
                        </button>
                    </Link>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm transition-colors">
                        Download Report
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Total Projects"
                    value={stats.projects}
                    icon={FaProjectDiagram}
                    color="primary"
                    trend="+12%"
                />
                <StatCard
                    label="Active Startups"
                    value={stats.startups}
                    icon={FaRocket}
                    color="purple-500"
                    trend="Stable"
                />
                <StatCard
                    label="Skills Mastered"
                    value={stats.skills}
                    icon={FaRocket}
                    color="emerald-500"
                    trend="+3"
                />
                <StatCard
                    label="Unread Messages"
                    value={stats.unreadForms}
                    icon={FaEnvelope}
                    color="orange-500"
                    trend={stats.unreadForms > 0 ? "New" : "All read"}
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Activity Chart */}
                <Card className="lg:col-span-2 overflow-hidden">
                    <h3 className="text-lg font-bold mb-6">Activity Overview</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={activityData}>
                                <defs>
                                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="visits"
                                    stroke="#6366f1"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorVisits)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Projects Pie Chart */}
                <Card className="overflow-hidden">
                    <h3 className="text-lg font-bold mb-6">Projects Distribution</h3>
                    <div className="h-[300px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={projectData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {projectData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center">
                                <span className="block text-2xl font-bold text-white">{stats.projects}</span>
                                <span className="text-xs text-text-secondary">Projects</span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Recent Actions / Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold">Quick Actions</h3>
                    </div>
                    <div className="space-y-3">
                        <Link href="/admin/projects" className="flex items-center justify-between p-3 rounded-lg bg-surface hover:bg-white/5 transition-colors group">
                            <span className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <FaPlus size={12} />
                                </div>
                                <span className="text-sm font-medium">Add New Project</span>
                            </span>
                            <FaArrowRight size={12} className="text-text-muted group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="/admin/startups" className="flex items-center justify-between p-3 rounded-lg bg-surface hover:bg-white/5 transition-colors group">
                            <span className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                    <FaRocket size={12} />
                                </div>
                                <span className="text-sm font-medium">Record Startup</span>
                            </span>
                            <FaArrowRight size={12} className="text-text-muted group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="/admin/forms" className="flex items-center justify-between p-3 rounded-lg bg-surface hover:bg-white/5 transition-colors group">
                            <span className="flex items-center gap-3">
                                <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                    <FaEnvelope size={12} />
                                </div>
                                <span className="text-sm font-medium">View Messages</span>
                            </span>
                            <FaArrowRight size={12} className="text-text-muted group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </Card>

                <Card>
                    <h3 className="font-bold mb-4">System Status</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-text-secondary">Storage Usage</span>
                                <span className="font-medium">45%</span>
                            </div>
                            <div className="h-2 bg-accent rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-[45%]" />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-text-secondary">API Requests</span>
                                <span className="font-medium">Clean</span>
                            </div>
                            <div className="h-2 bg-accent rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 w-[90%]" />
                            </div>
                        </div>
                        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs leading-relaxed text-blue-200">
                            <strong>Note:</strong> Your portfolio is running on the latest version v1.2.0. All systems are operational.
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
