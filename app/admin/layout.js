// app/admin/layout.js
'use client';

import Sidebar from '@/components/admin/Sidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-[#050505] text-text-primary font-sans antialiased overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <AdminHeader />
                <main className="flex-1 overflow-y-auto custom-scrollbar bg-dots-pattern relative">
                    {/* Background decoration */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-purple-500/5 pointer-events-none fixed" />
                    <div className="relative z-10 p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
