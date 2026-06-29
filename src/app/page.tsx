'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { IDoctor, IReview, IStats } from '@/types';
import {
    FaAllergies,
    FaArrowRight,
    FaBone,
    FaBrain,
    FaCalendarCheck,
    FaChild,
    FaClock,
    FaHeartbeat,
    FaLock,
    FaMobileAlt,
    FaQuoteLeft,
    FaShieldAlt,
    FaStar,
    FaStethoscope,
    FaUserMd,
    FaUsers,
} from 'react-icons/fa';

const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.5 },
};

const HeroBanner = () => (
    <section className="relative overflow-hidden border-b border-white/5 bg-[linear-gradient(135deg,rgba(16,185,129,0.08),transparent_42%,rgba(20,184,166,0.06))]">
        <div className="page-shell py-12 sm:py-16 lg:py-20">
            <div className="grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12">
                <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-2xl">
                    <span className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400">
                        <FaHeartbeat className="text-xs" /> #1 Healthcare Platform
                    </span>
                    <h1 className="text-balance-safe mb-6 text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
                        Your Health, <span className="gradient-text">Our Priority</span>
                    </h1>
                    <p className="mb-8 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
                        Connect with top-rated doctors, book appointments instantly, and manage your healthcare journey all in one platform.
                    </p>
                    <div className="grid gap-3 sm:flex sm:flex-wrap">
                        <Link href="/find-doctors" className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base">
                            Find a Doctor <FaArrowRight />
                        </Link>
                        <Link href="/about" className="btn-secondary inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base">
                            Learn More
                        </Link>
                    </div>

                    <div className="mt-10 grid max-w-lg grid-cols-3 gap-3 border-t border-white/5 pt-8">
                        {[
                            ['500+', 'Verified Doctors'],
                            ['50K+', 'Happy Patients'],
                            ['4.9', 'Average Rating'],
                        ].map(([value, label]) => (
                            <div key={label} className="min-w-0">
                                <p className="text-2xl font-bold text-white">{value}</p>
                                <p className="text-xs leading-snug text-slate-500">{label}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }} className="relative">
                    <div className="relative mx-auto aspect-[4/3] w-full max-w-xl overflow-hidden rounded-lg border border-white/10 bg-slate-800 shadow-2xl shadow-black/30">
                        <Image
                            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=85"
                            alt="Doctor consulting with a patient"
                            fill
                            priority
                            sizes="(min-width: 1024px) 560px, 100vw"
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/60 via-slate-950/10 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-lg border border-white/10 bg-slate-950/75 p-4 backdrop-blur-md">
                                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
                                    <FaCalendarCheck className="text-blue-400" /> Appointment booked
                                </div>
                                <p className="text-xs leading-relaxed text-slate-300">Same-day slots with verified specialists.</p>
                            </div>
                            <div className="rounded-lg border border-white/10 bg-slate-950/75 p-4 backdrop-blur-md">
                                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
                                    <FaStar className="text-amber-400" /> 4.9 average rating
                                </div>
                                <p className="text-xs leading-relaxed text-slate-300">Trusted care across every department.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    </section>
);

const FeaturedDoctors = ({ doctors }: { doctors: IDoctor[] }) => (
    <section className="py-16 sm:py-20">
        <div className="page-shell">
            <motion.div {...fadeUp} className="mb-12 text-center">
                <span className="text-sm font-semibold uppercase tracking-wider text-emerald-400">Our Experts</span>
                <h2 className="section-title mt-2 mb-4 text-white">Featured Doctors</h2>
                <p className="section-subtitle">Meet top-rated healthcare professionals ready to provide attentive medical care.</p>
            </motion.div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {doctors.map((doctor, index) => (
                    <motion.div key={doctor._id} {...fadeUp} transition={{ duration: 0.45, delay: index * 0.06 }}>
                        <Link href={`/doctors/${doctor._id}`} className="card-glass group block h-full p-5 transition-all duration-300">
                            <div className="flex items-start gap-4">
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 transition-all group-hover:from-emerald-500/30 group-hover:to-teal-500/30">
                                    {doctor.profileImage ? (
                                        <img src={doctor.profileImage} alt={doctor.doctorName} className="h-full w-full object-cover" />
                                    ) : (
                                        <FaUserMd className="text-2xl text-emerald-400" />
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-balance-safe text-base font-semibold text-white transition-colors group-hover:text-emerald-400">{doctor.doctorName}</h3>
                                    <p className="mb-1 text-sm text-emerald-400">{doctor.specialization}</p>
                                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400">
                                        <span>{doctor.experience} yrs exp</span>
                                        <span>${doctor.consultationFee}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-4">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} className={`text-xs ${i < Math.round(doctor.averageRating) ? 'text-amber-400' : 'text-slate-700'}`} />
                                    ))}
                                    <span className="ml-1 text-xs text-slate-400">({doctor.ratingCount})</span>
                                </div>
                                <span className="text-xs font-medium text-emerald-400">View Profile</span>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {doctors.length > 0 && (
                <div className="mt-10 text-center">
                    <Link href="/find-doctors" className="btn-secondary inline-flex items-center gap-2">
                        View All Doctors <FaArrowRight />
                    </Link>
                </div>
            )}

            {doctors.length === 0 && (
                <div className="py-16 text-center">
                    <FaUserMd className="mx-auto mb-4 text-4xl text-slate-600" />
                    <p className="text-slate-400">No featured doctors available yet. Check back soon.</p>
                </div>
            )}
        </div>
    </section>
);

const specializations = [
    { name: 'Cardiology', icon: FaHeartbeat, color: 'from-red-500/20 to-rose-500/20', text: 'text-red-400', desc: 'Heart care' },
    { name: 'Neurology', icon: FaBrain, color: 'from-violet-500/20 to-indigo-500/20', text: 'text-violet-400', desc: 'Nervous system' },
    { name: 'Orthopedics', icon: FaBone, color: 'from-blue-500/20 to-cyan-500/20', text: 'text-blue-400', desc: 'Bones and joints' },
    { name: 'Pediatrics', icon: FaChild, color: 'from-amber-500/20 to-orange-500/20', text: 'text-amber-400', desc: 'Child healthcare' },
    { name: 'Dermatology', icon: FaAllergies, color: 'from-pink-500/20 to-fuchsia-500/20', text: 'text-pink-400', desc: 'Skin care' },
    { name: 'General Medicine', icon: FaStethoscope, color: 'from-emerald-500/20 to-teal-500/20', text: 'text-emerald-400', desc: 'Primary care' },
];

const Specializations = () => (
    <section className="border-y border-white/5 bg-white/[0.015] py-16 sm:py-20">
        <div className="page-shell">
            <div className="mb-12 text-center">
                <span className="text-sm font-semibold uppercase tracking-wider text-emerald-400">Departments</span>
                <h2 className="section-title mt-2 mb-4 text-white">Medical Specializations</h2>
                <p className="section-subtitle">Browse medical departments with qualified specialists.</p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                {specializations.map((spec) => (
                    <Link key={spec.name} href={`/find-doctors?specialization=${spec.name}`} className="card-glass group p-4 text-center transition-all duration-300 hover:-translate-y-1">
                        <div className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br ${spec.color} transition-transform group-hover:scale-105`}>
                            <spec.icon className={`text-xl ${spec.text}`} />
                        </div>
                        <h3 className="text-sm font-semibold text-white">{spec.name}</h3>
                        <p className="mt-1 text-xs leading-snug text-slate-500">{spec.desc}</p>
                    </Link>
                ))}
            </div>
        </div>
    </section>
);

const PlatformStats = ({ stats }: { stats: IStats }) => {
    const statItems = [
        { label: 'Verified Doctors', value: stats.totalDoctors, icon: FaUserMd, color: 'from-emerald-500 to-teal-600' },
        { label: 'Happy Patients', value: stats.totalPatients, icon: FaUsers, color: 'from-blue-500 to-cyan-600' },
        { label: 'Appointments', value: stats.totalAppointments, icon: FaCalendarCheck, color: 'from-violet-500 to-indigo-600' },
        { label: 'Patient Reviews', value: stats.totalReviews, icon: FaStar, color: 'from-amber-500 to-orange-600' },
    ];

    return (
        <section className="py-16 sm:py-20">
            <div className="page-shell">
                <motion.div {...fadeUp} className="card-glass p-6 sm:p-10">
                    <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
                        {statItems.map((item) => (
                            <div key={item.label} className="text-center">
                                <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${item.color} shadow-lg`}>
                                    <item.icon className="text-xl text-white" />
                                </div>
                                <p className="text-3xl font-black text-white sm:text-4xl">{item.value.toLocaleString()}+</p>
                                <p className="mt-1 text-sm text-slate-400">{item.label}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

const SuccessStories = ({ reviews }: { reviews: IReview[] }) => (
    <section className="py-16 sm:py-20">
        <div className="page-shell">
            <div className="mb-12 text-center">
                <span className="text-sm font-semibold uppercase tracking-wider text-emerald-400">Testimonials</span>
                <h2 className="section-title mt-2 mb-4 text-white">Patient Success Stories</h2>
                <p className="section-subtitle">Real experiences from patients who trusted MediCare Connect for their healthcare needs.</p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {reviews.map((review, index) => {
                    const patient = typeof review.patientId === 'object' ? review.patientId : null;
                    const doctor = typeof review.doctorId === 'object' ? review.doctorId : null;
                    return (
                        <motion.div key={review._id} {...fadeUp} transition={{ duration: 0.45, delay: index * 0.06 }} className="card-glass p-5">
                            <FaQuoteLeft className="mb-4 text-3xl text-emerald-500/20" />
                            <p className="mb-4 line-clamp-4 text-sm leading-relaxed text-slate-300">&quot;{review.reviewText}&quot;</p>
                            <div className="mb-4 flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} className={`text-xs ${i < review.rating ? 'text-amber-400' : 'text-slate-700'}`} />
                                ))}
                            </div>
                            <div className="flex items-center gap-3 border-t border-white/5 pt-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-sm font-bold text-white">
                                    {patient?.name?.charAt(0) || 'P'}
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-white">{patient?.name || 'Patient'}</p>
                                    {doctor && <p className="truncate text-xs text-slate-500">Treated by Dr. {(doctor as IDoctor).doctorName}</p>}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {reviews.length === 0 && (
                <div className="py-16 text-center">
                    <FaStar className="mx-auto mb-4 text-4xl text-slate-600" />
                    <p className="text-slate-400">No patient stories yet. Be the first to share your experience.</p>
                </div>
            )}
        </div>
    </section>
);

const whyChooseUs = [
    { icon: FaShieldAlt, title: 'Verified Doctors', description: 'Every doctor goes through a careful verification process by our admin team.' },
    { icon: FaClock, title: 'Instant Booking', description: 'Book appointments in seconds without waiting in lines or making phone calls.' },
    { icon: FaMobileAlt, title: 'Digital Records', description: 'Prescriptions, appointments, and medical history stay organized in one place.' },
    { icon: FaLock, title: 'Secure & Private', description: 'Your health data is protected with privacy-first platform safeguards.' },
];

const WhyChooseUs = () => (
    <section className="border-t border-white/5 bg-white/[0.015] py-16 sm:py-20">
        <div className="page-shell">
            <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                <div>
                    <span className="text-sm font-semibold uppercase tracking-wider text-emerald-400">Why Choose Us</span>
                    <h2 className="section-title mt-2 mb-4 text-white">Why Choose MediCare Connect?</h2>
                    <p className="leading-relaxed text-slate-400">
                        We are reimagining healthcare by making it more accessible, efficient, and patient-centered.
                    </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    {whyChooseUs.map((item) => (
                        <div key={item.title} className="card-glass p-5">
                            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                                <item.icon className="text-emerald-400" />
                            </div>
                            <h3 className="mb-1 text-sm font-semibold text-white">{item.title}</h3>
                            <p className="text-xs leading-relaxed text-slate-400">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </section>
);

export default function HomePage() {
    const [doctors, setDoctors] = useState<IDoctor[]>([]);
    const [reviews, setReviews] = useState<IReview[]>([]);
    const [stats, setStats] = useState<IStats>({ totalDoctors: 0, totalPatients: 0, totalAppointments: 0, totalReviews: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [doctorsRes, reviewsRes, statsRes] = await Promise.allSettled([
                    api.get('/doctors/featured'),
                    api.get('/reviews/recent/testimonials'),
                    api.get('/admin/stats'),
                ]);

                if (doctorsRes.status === 'fulfilled') setDoctors(doctorsRes.value.data.doctors || []);
                if (reviewsRes.status === 'fulfilled') setReviews(reviewsRes.value.data.reviews || []);
                if (statsRes.status === 'fulfilled') setStats((current) => statsRes.value.data.stats || current);
            } catch (err) {
                console.error('Failed to fetch home data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="spinner" />
            </div>
        );
    }

    return (
        <>
            <HeroBanner />
            <FeaturedDoctors doctors={doctors} />
            <Specializations />
            <PlatformStats stats={stats} />
            <SuccessStories reviews={reviews} />
            <WhyChooseUs />
        </>
    );
}
