'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
    FiGrid, FiCalendar, FiDollarSign, FiStar, FiUser, FiUsers, FiActivity,
    FiClipboard, FiCheckSquare, FiFileText, FiBarChart2, FiMenu, FiX, FiLogOut, FiShield
} from 'react-icons/fi';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, loading, logout } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Redirect if not logged in
    if (!loading && !user) {
        router.push('/login');
        return null;
    }

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><div className="spinner" /></div>;
    }

    const patientLinks = [
        { name: 'Overview', href: '/dashboard', icon: FiGrid },
        { name: 'My Appointments', href: '/dashboard/patient/appointments', icon: FiCalendar },
        { name: 'Payment History', href: '/dashboard/patient/payments', icon: FiDollarSign },
        { name: 'My Reviews', href: '/dashboard/patient/reviews', icon: FiStar },
        { name: 'Profile', href: '/dashboard/profile', icon: FiUser },
    ];

    const doctorLinks = [
        { name: 'Overview', href: '/dashboard', icon: FiGrid },
        { name: 'Manage Schedule', href: '/dashboard/doctor/schedule', icon: FiCalendar },
        { name: 'Appointment Requests', href: '/dashboard/doctor/requests', icon: FiCheckSquare },
        { name: 'Prescriptions', href: '/dashboard/doctor/prescriptions', icon: FiFileText },
        { name: 'Profile', href: '/dashboard/doctor/profile', icon: FiUser },
    ];

    const adminLinks = [
        { name: 'Overview', href: '/dashboard', icon: FiGrid },
        { name: 'Manage Users', href: '/dashboard/admin/users', icon: FiUsers },
        { name: 'Manage Doctors', href: '/dashboard/admin/doctors', icon: FiActivity },
        { name: 'Appointments', href: '/dashboard/admin/appointments', icon: FiCalendar },
        { name: 'Payments', href: '/dashboard/admin/payments', icon: FiDollarSign },
        { name: 'Analytics', href: '/dashboard/admin/analytics', icon: FiBarChart2 },
    ];

    const links = user?.role === 'admin' ? adminLinks : user?.role === 'doctor' ? doctorLinks : patientLinks;

    const roleColors: Record<string, string> = {
        patient: 'from-blue-500 to-cyan-600',
        doctor: 'from-emerald-500 to-teal-600',
        admin: 'from-purple-500 to-violet-600',
    };

    return (
        <div className="min-h-screen flex">
            {/* Sidebar Overlay (mobile) */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`fixed lg:sticky top-0 left-0 z-50 lg:z-auto w-72 h-screen bg-slate-900/95 lg:bg-slate-900/50 backdrop-blur-xl border-r border-white/5 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                {/* User Info */}
                <div className="p-6 border-b border-white/5">
                    <div className="flex items-center justify-between lg:justify-start gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${roleColors[user?.role || 'patient']} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                                <p className="text-xs text-slate-400 capitalize flex items-center gap-1">
                                    {user?.role === 'admin' && <FiShield className="text-purple-400" />}
                                    {user?.role}
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
                            <FiX className="text-xl" />
                        </button>
                    </div>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`sidebar-link ${isActive ? 'active' : ''}`}
                            >
                                <link.icon className="text-lg flex-shrink-0" />
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={() => { logout(); router.push('/'); }}
                        className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/5"
                    >
                        <FiLogOut className="text-lg" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
                {/* Mobile topbar */}
                <div className="lg:hidden sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex items-center gap-3">
                    <button onClick={() => setSidebarOpen(true)} className="text-slate-400 hover:text-white">
                        <FiMenu className="text-xl" />
                    </button>
                    <h2 className="text-sm font-semibold text-white">Dashboard</h2>
                </div>

                <div className="p-4 sm:p-6 lg:p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
