import React from 'react';
import Link from 'next/link';
import { FaHeartbeat, FaHome, FaSearch } from 'react-icons/fa';

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="text-center max-w-lg">
                {/* Illustration */}
                <div className="relative mb-8 mx-auto w-fit">
                    <div className="text-[10rem] font-black leading-none bg-gradient-to-b from-emerald-500/20 to-transparent bg-clip-text text-transparent select-none">
                        404
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <FaHeartbeat className="text-emerald-500 text-4xl animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                <h1 className="text-3xl font-bold text-white mb-3">Page Not Found</h1>
                <p className="text-slate-400 mb-8 leading-relaxed">
                    Oops! The page you&apos;re looking for seems to have gone for a medical checkup.
                    Don&apos;t worry, we&apos;ll help you find your way back.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                        href="/"
                        className="btn-primary flex items-center gap-2 px-6 py-3 text-sm"
                    >
                        <FaHome /> Back to Home
                    </Link>
                    <Link
                        href="/find-doctors"
                        className="btn-secondary flex items-center gap-2 px-6 py-3 text-sm"
                    >
                        <FaSearch /> Find Doctors
                    </Link>
                </div>
            </div>
        </div>
    );
}
