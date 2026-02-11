// components/admin/Sidebar.jsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
    FaHome,
    FaUser,
    FaGraduationCap,
    FaCode,
    FaProjectDiagram,
    FaRocket,
    FaImages,
    FaEnvelope,
    FaChartBar,
    FaSearch,
    FaChevronLeft,
    FaChevronRight,
    FaSignOutAlt,
    FaCloudUploadAlt
} from 'react-icons/fa';

const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: FaHome },
    { name: 'Upload Data', path: '/admin/upload-data', icon: FaCloudUploadAlt, highlight: true },
    { name: 'Profile', path: '/admin/profile', icon: FaUser },
    { name: 'Projects', path: '/admin/projects', icon: FaProjectDiagram },
    { name: 'Startups', path: '/admin/startups', icon: FaRocket },
    { name: 'Skills', path: '/admin/skills', icon: FaCode },
    { name: 'Education', path: '/admin/education', icon: FaGraduationCap },
    { name: 'Media', path: '/admin/media', icon: FaImages },
    { name: 'Forms', path: '/admin/forms', icon: FaEnvelope },
    { name: 'Analytics', path: '/admin/analytics', icon: FaChartBar },
    { name: 'SEO', path: '/admin/seo', icon: FaSearch },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside
            className={cn(
                "h-screen sticky top-0 flex flex-col transition-all duration-300 border-r border-white/5 bg-[#0A0A0A]/50 backdrop-blur-xl z-50",
                collapsed ? "w-20" : "w-72"
            )}
        >
            {/* Logo Area */}
            <div className={cn(
                "h-20 flex items-center border-b border-white/5",
                collapsed ? "justify-center px-0" : "px-6 justify-between"
            )}>
                {!collapsed && (
                    <Link href="/admin/dashboard" className="text-xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent tracking-wide">
                        Prince<span className="text-white">Admin</span>
                    </Link>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-2 rounded-lg text-text-secondary hover:bg-white/5 hover:text-white transition-colors"
                >
                    {collapsed ? <FaChevronRight size={14} /> : <FaChevronLeft size={14} />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={cn(
                                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-text-secondary hover:bg-white/5 hover:text-white",
                                collapsed && "justify-center px-0"
                            )}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
                            )}

                            <Icon className={cn(
                                "w-5 h-5 transition-transform duration-300",
                                isActive ? "scale-110" : "group-hover:scale-110",
                                item.highlight && !isActive && "text-primary"
                            )} />

                            {!collapsed && (
                                <span className="font-medium text-sm tracking-wide truncat flex-1">
                                    {item.name}
                                </span>
                            )}

                            {!collapsed && item.highlight && (
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            )}

                            {/* Tooltip for collapsed state */}
                            {collapsed && (
                                <div className="absolute left-full ml-4 px-3 py-1.5 bg-accent border border-white/10 rounded-lg text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl">
                                    {item.name}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile / Footer */}
            <div className="p-4 border-t border-white/5 bg-black/20">
                <div className={cn(
                    "flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-white/5 cursor-pointer group",
                    collapsed && "justify-center"
                )}>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20">
                        P
                    </div>

                    {!collapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">Prince Kumar</p>
                            <p className="text-xs text-text-muted truncate">Administrator</p>
                        </div>
                    )}

                    {!collapsed && (
                        <FaSignOutAlt className="text-text-secondary group-hover:text-red-500 transition-colors" />
                    )}
                </div>
            </div>
        </aside>
    );
}
