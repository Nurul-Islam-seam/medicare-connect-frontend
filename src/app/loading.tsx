'use client';
import React from 'react';
import { FaHeartbeat } from 'react-icons/fa';

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/95 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-6">
                {/* Animated Logo */}
                <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-xl shadow-emerald-500/30 animate-pulse">
                        <FaHeartbeat className="text-white text-3xl" />
                    </div>
                    <div className="absolute inset-0 w-20 h-20 rounded-2xl border-2 border-emerald-400/30 animate-ping" />
                </div>

                {/* Loading text */}
                <div className="text-center">
                    <h2 className="text-lg font-semibold text-white mb-1">MediCare Connect</h2>
                    <p className="text-sm text-slate-400">Loading your healthcare experience...</p>
                </div>

                {/* Spinner bar */}
                <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-[loading_1.5s_ease-in-out_infinite]" />
                </div>
            </div>

            <style jsx>{`
                @keyframes loading {
                    0% { width: 0%; margin-left: 0; }
                    50% { width: 60%; margin-left: 20%; }
                    100% { width: 0%; margin-left: 100%; }
                }
            `}</style>
        </div>
    );
}
