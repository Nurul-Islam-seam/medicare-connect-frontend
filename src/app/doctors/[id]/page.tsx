'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { IDoctor, IReview } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { FaUserMd, FaStar, FaCalendarCheck, FaClock, FaHospital, FaGraduationCap, FaBriefcase, FaDollarSign } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function DoctorDetailsPage() {
    const params = useParams();
    const { user } = useAuth();
    const [doctor, setDoctor] = useState<IDoctor | null>(null);
    const [reviews, setReviews] = useState<IReview[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const res = await api.get(`/doctors/${params.id}`);
                setDoctor(res.data.doctor);
                setReviews(res.data.reviews || []);
            } catch {
                toast.error('Failed to load doctor details.');
            } finally {
                setLoading(false);
            }
        };
        if (params.id) fetchDoctor();
    }, [params.id]);

    if (loading) return <div className="flex justify-center py-20"><div className="spinner" /></div>;
    if (!doctor) return <div className="text-center py-20 text-slate-400">Doctor not found.</div>;

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Doctor Profile Card */}
                <div className="card-glass p-6 sm:p-8 mb-8">
                    <div className="flex flex-col sm:flex-row gap-6">
                        <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {doctor.profileImage ? (
                                <img src={doctor.profileImage} alt={doctor.doctorName} className="w-full h-full object-cover rounded-2xl" />
                            ) : (
                                <FaUserMd className="text-emerald-400 text-4xl" />
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-start justify-between flex-wrap gap-4">
                                <div>
                                    <h1 className="text-2xl font-bold text-white">{doctor.doctorName}</h1>
                                    <p className="text-emerald-400 font-medium">{doctor.specialization}</p>
                                    {doctor.averageRating > 0 && (
                                        <div className="flex items-center gap-1 mt-2">
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar key={i} className={`text-sm ${i < Math.round(doctor.averageRating) ? 'text-amber-400' : 'text-slate-700'}`} />
                                            ))}
                                            <span className="text-sm text-slate-400 ml-1">{doctor.averageRating} ({doctor.ratingCount} reviews)</span>
                                        </div>
                                    )}
                                </div>
                                {user?.role === 'patient' && (
                                    <Link href={`/dashboard/patient/appointments?book=${doctor._id}`} className="btn-primary flex items-center gap-2">
                                        <FaCalendarCheck /> Book Appointment
                                    </Link>
                                )}
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                                <div className="card-glass p-4 text-center">
                                    <FaBriefcase className="text-emerald-400 mx-auto mb-2" />
                                    <p className="text-lg font-bold text-white">{doctor.experience}</p>
                                    <p className="text-xs text-slate-400">Years Exp</p>
                                </div>
                                <div className="card-glass p-4 text-center">
                                    <FaDollarSign className="text-emerald-400 mx-auto mb-2" />
                                    <p className="text-lg font-bold text-white">${doctor.consultationFee}</p>
                                    <p className="text-xs text-slate-400">Fee</p>
                                </div>
                                <div className="card-glass p-4 text-center">
                                    <FaHospital className="text-emerald-400 mx-auto mb-2" />
                                    <p className="text-sm font-semibold text-white truncate">{doctor.hospitalName || 'N/A'}</p>
                                    <p className="text-xs text-slate-400">Hospital</p>
                                </div>
                                <div className="card-glass p-4 text-center">
                                    <FaGraduationCap className="text-emerald-400 mx-auto mb-2" />
                                    <p className="text-sm font-semibold text-white truncate">{doctor.qualifications?.join(', ') || 'N/A'}</p>
                                    <p className="text-xs text-slate-400">Qualifications</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Available Schedule */}
                <div className="card-glass p-6 sm:p-8 mb-8">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><FaClock className="text-emerald-400" /> Available Schedule</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-sm font-medium text-slate-300 mb-2">Available Days</h3>
                            <div className="flex flex-wrap gap-2">
                                {doctor.availableDays?.length > 0 ? doctor.availableDays.map((day) => (
                                    <span key={day} className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400">{day}</span>
                                )) : <p className="text-sm text-slate-500">Not specified</p>}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-slate-300 mb-2">Available Slots</h3>
                            <div className="flex flex-wrap gap-2">
                                {doctor.availableSlots?.length > 0 ? doctor.availableSlots.map((slot) => (
                                    <span key={slot} className="px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm text-blue-400">{slot}</span>
                                )) : <p className="text-sm text-slate-500">Not specified</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews */}
                <div className="card-glass p-6 sm:p-8">
                    <h2 className="text-lg font-semibold text-white mb-6">Patient Reviews ({reviews.length})</h2>
                    {reviews.length > 0 ? (
                        <div className="space-y-4">
                            {reviews.map((review) => {
                                const patient = typeof review.patientId === 'object' ? review.patientId : null;
                                return (
                                    <div key={review._id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
                                                    {patient?.name?.charAt(0) || 'P'}
                                                </div>
                                                <span className="text-sm font-medium text-white">{patient?.name || 'Patient'}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar key={i} className={`text-xs ${i < review.rating ? 'text-amber-400' : 'text-slate-700'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-400">{review.reviewText}</p>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-500 text-center py-8">No reviews yet for this doctor.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
