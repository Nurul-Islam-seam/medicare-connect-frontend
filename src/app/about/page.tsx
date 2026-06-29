import React from 'react';
import { FaHeartbeat, FaUsers, FaShieldAlt, FaClock, FaMedal, FaGlobe } from 'react-icons/fa';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'About Us' };

const values = [
    { icon: FaShieldAlt, title: 'Patient Safety', description: 'Every doctor on our platform is thoroughly verified before being listed.' },
    { icon: FaClock, title: 'Accessibility', description: 'Healthcare should be accessible to everyone, anytime, anywhere.' },
    { icon: FaMedal, title: 'Excellence', description: 'We partner with top-rated hospitals and specialists to ensure quality care.' },
    { icon: FaGlobe, title: 'Innovation', description: 'We leverage technology to bridge the gap between patients and providers.' },
];

const milestones = [
    { year: '2020', title: 'Founded', description: 'MediCare Connect was born with a vision to digitize healthcare.' },
    { year: '2021', title: 'First 1000 Patients', description: 'Reached our first milestone of serving 1000 patients.' },
    { year: '2023', title: '500+ Verified Doctors', description: 'Expanded to over 500 verified doctors across specializations.' },
    { year: '2024', title: 'AI Integration', description: 'Introduced AI-powered recommendations and smart scheduling.' },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero */}
                <div className="text-center mb-16">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/20">
                        <FaHeartbeat className="text-white text-3xl" />
                    </div>
                    <h1 className="text-4xl font-black text-white mb-4">About MediCare Connect</h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        We&apos;re on a mission to make quality healthcare accessible to everyone through technology, transparency, and trust.
                    </p>
                </div>

                {/* Mission */}
                <div className="card-glass p-8 sm:p-12 mb-12">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <span className="text-emerald-400 text-sm font-semibold uppercase tracking-wider">Our Mission</span>
                            <h2 className="text-2xl font-bold text-white mt-2 mb-4">Transforming Healthcare Access</h2>
                            <p className="text-slate-400 leading-relaxed mb-4">
                                Traditional appointment systems involve long waiting times, manual paperwork, and poor communication. MediCare Connect digitizes the entire healthcare journey.
                            </p>
                            <p className="text-slate-400 leading-relaxed">
                                From booking your first appointment to receiving prescriptions, we ensure a seamless, secure, and efficient experience for patients and healthcare providers alike.
                            </p>
                        </div>
                        <div className="flex justify-center">
                            <div className="w-48 h-48 rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 flex items-center justify-center">
                                <FaUsers className="text-emerald-400 text-6xl" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Values */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-white text-center mb-8">Our Core Values</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {values.map((v) => (
                            <div key={v.title} className="card-glass p-6 text-center">
                                <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                                    <v.icon className="text-emerald-400 text-xl" />
                                </div>
                                <h3 className="text-sm font-semibold text-white mb-2">{v.title}</h3>
                                <p className="text-xs text-slate-400 leading-relaxed">{v.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Timeline */}
                <div>
                    <h2 className="text-2xl font-bold text-white text-center mb-8">Our Journey</h2>
                    <div className="space-y-6">
                        {milestones.map((m, i) => (
                            <div key={m.year} className="flex gap-4 items-start">
                                <div className="flex flex-col items-center flex-shrink-0">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-emerald-500/20">{m.year}</div>
                                    {i < milestones.length - 1 && <div className="w-0.5 h-12 bg-emerald-500/20 mt-2" />}
                                </div>
                                <div className="card-glass p-5 flex-1">
                                    <h3 className="text-sm font-semibold text-white mb-1">{m.title}</h3>
                                    <p className="text-xs text-slate-400">{m.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
