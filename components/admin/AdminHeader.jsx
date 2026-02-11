// components/admin/AdminHeader.jsx
'use client';

import { FaSearch, FaBell, FaUserCircle } from 'react-icons/fa';

export default function AdminHeader() {
    return (
        <header className="h-16 bg-accent/50 glass border-b border-border flex items-center justify-between px-8 sticky top-0 z-30">
            {/* Search Bar (Visual Only) */}
            <div className="relative w-96 hidden md:block">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-text-muted" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-border rounded-lg leading-5 bg-hover text-text-primary placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                    placeholder="Search anything..."
                />
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-6">
                {/* Notifications */}
                <button className="relative p-2 text-text-secondary hover:text-primary transition-colors">
                    <FaBell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-accent"></span>
                </button>

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-6 border-l border-border">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-text-primary">Admin User</p>
                        <p className="text-xs text-text-muted">Administrator</p>
                    </div>
                    <button className="text-text-secondary hover:text-primary transition-colors">
                        <FaUserCircle className="w-8 h-8" />
                    </button>
                </div>
            </div>
        </header>
    );
}
