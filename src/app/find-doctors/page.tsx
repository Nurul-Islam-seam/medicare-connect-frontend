'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { IDoctor, IPagination } from '@/types';
import { FaUserMd, FaStar, FaSearch, FaChevronLeft, FaChevronRight, FaTh, FaList } from 'react-icons/fa';
import { motion } from 'framer-motion';

function FindDoctorsContent() {
    const searchParams = useSearchParams();
    const [doctors, setDoctors] = useState<IDoctor[]>([]);
    const [pagination, setPagination] = useState<IPagination>({ total: 0, page: 1, limit: 9, totalPages: 0 });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [specialization, setSpecialization] = useState(searchParams.get('specialization') || '');
    const [sortBy, setSortBy] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); // Option 4: Table/Card toggle

    const fetchDoctors = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const params: Record<string, string | number> = { page, limit: 9 };
            if (search) params.search = search;
            if (specialization) params.specialization = specialization;
            if (sortBy) { params.sortBy = sortBy; params.sortOrder = sortOrder; }

            const res = await api.get('/doctors', { params });
            setDoctors(res.data.doctors || []);
            setPagination((current) => res.data.pagination || current);
        } catch (error) {
            console.error('Failed to fetch doctors:', error);
        } finally {
            setLoading(false);
        }
    }, [search, specialization, sortBy, sortOrder]);

    useEffect(() => {
        void Promise.resolve().then(() => fetchDoctors());
    }, [fetchDoctors]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchDoctors(1);
    };

    return (
        <div className="min-h-screen py-8 sm:py-10">
            <div className="page-shell">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="mb-2 text-3xl font-bold text-white">Find Doctors</h1>
                    <p className="max-w-2xl text-slate-400">Search and book appointments with verified healthcare professionals.</p>
                </div>

                {/* Filters Bar */}
                <div className="card-glass p-4 sm:p-6 mb-8">
                    <form onSubmit={handleSearch} className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_12rem_13rem_auto]">
                        {/* Search Input */}
                        <div className="relative flex-1">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="input-field pl-10"
                                placeholder="Search by name or specialization..."
                            />
                        </div>

                        {/* Specialization Filter */}
                        <select
                            value={specialization}
                            onChange={(e) => { setSpecialization(e.target.value); }}
                            className="input-field"
                        >
                            <option value="">All Specializations</option>
                            <option value="Cardiology">Cardiology</option>
                            <option value="Neurology">Neurology</option>
                            <option value="Orthopedics">Orthopedics</option>
                            <option value="Pediatrics">Pediatrics</option>
                            <option value="Dermatology">Dermatology</option>
                            <option value="General Medicine">General Medicine</option>
                        </select>

                        {/* Sort */}
                        <select
                            value={`${sortBy}-${sortOrder}`}
                            onChange={(e) => {
                                const [field, order] = e.target.value.split('-');
                                setSortBy(field);
                                setSortOrder(order);
                            }}
                            className="input-field"
                        >
                            <option value="-">Sort By</option>
                            <option value="consultationFee-asc">Fee: Low to High</option>
                            <option value="consultationFee-desc">Fee: High to Low</option>
                            <option value="experience-desc">Experience: Highest</option>
                            <option value="experience-asc">Experience: Lowest</option>
                            <option value="averageRating-desc">Rating: Highest</option>
                            <option value="averageRating-asc">Rating: Lowest</option>
                        </select>

                        <button type="submit" className="btn-primary px-6">Search</button>
                    </form>

                    {/* View toggle & result count */}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-4">
                        <p className="text-sm text-slate-400">
                            {pagination.total} doctor{pagination.total !== 1 ? 's' : ''} found
                        </p>
                        <div className="flex gap-1">
                            <button type="button" aria-label="Grid view" onClick={() => setViewMode('grid')} className={`rounded-lg p-2 transition-colors ${viewMode === 'grid' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}>
                                <FaTh />
                            </button>
                            <button type="button" aria-label="List view" onClick={() => setViewMode('list')} className={`rounded-lg p-2 transition-colors ${viewMode === 'list' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}>
                                <FaList />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex justify-center py-20"><div className="spinner" /></div>
                )}

                {/* Doctors Grid/List */}
                {!loading && doctors.length > 0 && (
                    <div className={viewMode === 'grid' ? 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
                        {doctors.map((doctor, index) => (
                            <motion.div
                                key={doctor._id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <Link href={`/doctors/${doctor._id}`} className={`card-glass group block transition-all duration-300 ${viewMode === 'list' ? 'grid gap-4 p-5 sm:grid-cols-[4rem_minmax(0,1fr)] sm:items-center' : 'p-5'}`}>
                                    <div className={`${viewMode === 'list' ? '' : 'mb-4'}`}>
                                        <div className={`${viewMode === 'list' ? 'h-16 w-16' : 'h-20 w-20'} flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20`}>
                                            {doctor.profileImage ? (
                                                <img src={doctor.profileImage} alt={doctor.doctorName} className="w-full h-full object-cover" />
                                            ) : (
                                                <FaUserMd className="text-emerald-400 text-2xl" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-balance-safe text-base font-semibold text-white transition-colors group-hover:text-emerald-400">{doctor.doctorName}</h3>
                                        <p className="text-sm text-emerald-400 mb-2">{doctor.specialization}</p>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mb-3">
                                            <span>{doctor.experience} yrs experience</span>
                                            <span>${doctor.consultationFee} fee</span>
                                            {doctor.hospitalName && <span>{doctor.hospitalName}</span>}
                                        </div>
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar key={i} className={`text-xs ${i < Math.round(doctor.averageRating) ? 'text-amber-400' : 'text-slate-700'}`} />
                                                ))}
                                                <span className="text-xs text-slate-400 ml-1">({doctor.ratingCount})</span>
                                            </div>
                                            <span className="text-xs font-medium text-emerald-400 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">View Details</span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* No results */}
                {!loading && doctors.length === 0 && (
                    <div className="text-center py-20">
                        <FaUserMd className="text-5xl text-slate-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-white mb-2">No Doctors Found</h3>
                        <p className="text-slate-400">Try adjusting your search or filter criteria.</p>
                    </div>
                )}

                {/* Pagination */}
                {!loading && pagination.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-10">
                        <button
                            onClick={() => fetchDoctors(pagination.page - 1)}
                            disabled={pagination.page <= 1}
                            className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <FaChevronLeft />
                        </button>
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                            <button
                                key={pageNum}
                                onClick={() => fetchDoctors(pageNum)}
                                className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                                    pageNum === pagination.page
                                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                                        : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                {pageNum}
                            </button>
                        ))}
                        <button
                            onClick={() => fetchDoctors(pagination.page + 1)}
                            disabled={pagination.page >= pagination.totalPages}
                            className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <FaChevronRight />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function FindDoctorsPage() {
    return (
        <Suspense fallback={<div className="flex justify-center py-20"><div className="spinner" /></div>}>
            <FindDoctorsContent />
        </Suspense>
    );
}
