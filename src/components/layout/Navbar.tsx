'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { FiGrid, FiLogOut, FiMenu, FiMoon, FiSun, FiUser, FiX } from 'react-icons/fi';
import { FaHeartbeat } from 'react-icons/fa';

const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Find Doctors', href: '/find-doctors' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
];

const Navbar = () => {
    const { user, logout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(true);

    const closeMenus = () => {
        setMobileOpen(false);
        setProfileOpen(false);
    };

    const toggleTheme = () => {
        const nextMode = !darkMode;
        setDarkMode(nextMode);
        document.documentElement.setAttribute('data-theme', nextMode ? 'dark' : 'light');
    };

    return (
        <nav className="navbar-glass sticky top-0 z-50 border-b border-white/10">
            <div className="page-shell">
                <div className="flex min-h-16 items-center justify-between gap-3 py-3 lg:min-h-20">
                    <Link href="/" onClick={closeMenus} className="group flex min-w-0 items-center gap-2">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20 transition-shadow group-hover:shadow-emerald-500/40">
                            <FaHeartbeat className="text-base text-white" />
                        </span>
                        <span className="truncate text-base font-bold text-white sm:text-lg">
                            MediCare<span className="hidden sm:inline"> Connect</span>
                        </span>
                    </Link>

                    <div className="hidden items-center gap-1 lg:flex">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition-all duration-200 hover:bg-white/5 hover:text-white"
                            >
                                {link.name}
                            </Link>
                        ))}
                        {user && (
                            <Link href="/dashboard" className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition-all duration-200 hover:bg-white/5 hover:text-white">
                                Dashboard
                            </Link>
                        )}
                    </div>

                    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                        <button
                            onClick={toggleTheme}
                            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-white/5 hover:text-white"
                            aria-label="Toggle theme"
                            type="button"
                        >
                            {darkMode ? <FiSun className="text-lg" /> : <FiMoon className="text-lg" />}
                        </button>

                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => {
                                        setProfileOpen((open) => !open);
                                        setMobileOpen(false);
                                    }}
                                    className="flex max-w-[11rem] items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-3 transition-all hover:bg-white/10"
                                    type="button"
                                >
                                    {user.photo ? (
                                        <img src={user.photo} alt={user.name} className="h-8 w-8 shrink-0 rounded-full object-cover ring-2 ring-emerald-500/50" />
                                    ) : (
                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-sm font-bold text-white">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                    <span className="hidden truncate text-sm text-slate-300 sm:block">{user.name}</span>
                                </button>

                                {profileOpen && (
                                    <div className="absolute right-0 mt-2 w-[min(14rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-white/10 bg-slate-900 shadow-xl shadow-black/50">
                                        <div className="border-b border-white/10 px-4 py-3">
                                            <p className="truncate text-sm font-medium text-white">{user.name}</p>
                                            <p className="truncate text-xs text-slate-400">{user.email}</p>
                                            <span className="mt-2 inline-block rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs capitalize text-emerald-400">{user.role}</span>
                                        </div>
                                        <Link href="/dashboard" onClick={closeMenus} className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white">
                                            <FiGrid className="text-base" /> Dashboard
                                        </Link>
                                        <Link href="/dashboard/profile" onClick={closeMenus} className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white">
                                            <FiUser className="text-base" /> My Profile
                                        </Link>
                                        <button
                                            onClick={() => {
                                                logout();
                                                closeMenus();
                                            }}
                                            className="flex w-full items-center gap-2 border-t border-white/10 px-4 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/5 hover:text-red-300"
                                            type="button"
                                        >
                                            <FiLogOut className="text-base" /> Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="hidden items-center gap-2 lg:flex">
                                <Link href="/login" className="px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-white">
                                    Sign In
                                </Link>
                                <Link href="/register" className="rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-emerald-500/25 transition-all hover:from-emerald-600 hover:to-teal-700 hover:shadow-emerald-500/40">
                                    Register
                                </Link>
                            </div>
                        )}

                        <button
                            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-white/5 hover:text-white lg:hidden"
                            onClick={() => {
                                setMobileOpen((open) => !open);
                                setProfileOpen(false);
                            }}
                            aria-label="Toggle navigation menu"
                            type="button"
                        >
                            {mobileOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
                        </button>
                    </div>
                </div>

                {mobileOpen && (
                    <div className="lg:hidden">
                        <div className="mb-3 grid gap-1 rounded-lg border border-white/10 bg-slate-900/95 p-2 shadow-xl shadow-black/30">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={closeMenus}
                                    className="rounded-lg px-4 py-3 text-sm font-medium text-slate-300 transition-all hover:bg-white/5 hover:text-white"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            {user ? (
                                <Link href="/dashboard" onClick={closeMenus} className="rounded-lg px-4 py-3 text-sm font-medium text-slate-300 transition-all hover:bg-white/5 hover:text-white">
                                    Dashboard
                                </Link>
                            ) : (
                                <div className="grid gap-2 border-t border-white/10 p-2">
                                    <Link href="/login" onClick={closeMenus} className="rounded-lg border border-white/10 px-4 py-2.5 text-center text-sm font-medium text-slate-300 transition-all hover:text-white">
                                        Sign In
                                    </Link>
                                    <Link href="/register" onClick={closeMenus} className="rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2.5 text-center text-sm font-medium text-white">
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
