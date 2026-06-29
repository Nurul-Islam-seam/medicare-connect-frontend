'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { FaHeartbeat, FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const { login, googleLogin } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error('Please fill in all fields.');
            return;
        }
        setLoading(true);
        try {
            await login(email, password);
            toast.success('Welcome back!');
            router.push('/dashboard');
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            toast.error(error.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await googleLogin();
            toast.success('Welcome!');
            router.push('/dashboard');
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            toast.error(error.response?.data?.message || 'Google login failed.');
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="card-glass p-8 sm:p-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20">
                            <FaHeartbeat className="text-white text-xl" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                        <p className="text-sm text-slate-400">Sign in to your MediCare account</p>
                    </div>

                    {/* Quick Login Helpers */}
                    <div className="mb-8 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 text-center">Test Accounts</p>
                        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                            <button
                                type="button"
                                onClick={() => { setEmail('admin@medicare.com'); setPassword('Admin@123'); }}
                                className="flex-1 sm:flex-none px-3 py-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-sm font-medium transition-colors border border-emerald-500/20"
                            >
                                Admin
                            </button>
                            <button
                                type="button"
                                onClick={() => { setEmail('amanda@doctor.com'); setPassword('Doctor@123'); }}
                                className="flex-1 sm:flex-none px-3 py-2.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 text-sm font-medium transition-colors border border-blue-500/20"
                            >
                                Doctor
                            </button>
                            <button
                                type="button"
                                onClick={() => { setEmail('sarah@patient.com'); setPassword('Patient@123'); }}
                                className="flex-1 sm:flex-none px-3 py-2.5 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 text-sm font-medium transition-colors border border-purple-500/20"
                            >
                                Patient
                            </button>
                        </div>
                    </div>

                    {/* Google Login */}
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-all mb-6"
                    >
                        <FaGoogle className="text-lg" />
                        Continue with Google
                    </button>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-3 bg-slate-800 text-slate-500">or sign in with email</span>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field pr-10"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-3 text-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-400 mt-6">
                        Don&apos;t have an account?{' '}
                        <Link href="/register" className="text-emerald-400 hover:text-emerald-300 font-medium">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
