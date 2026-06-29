'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { IAppointment } from '@/types';
import { FiCalendar, FiClock, FiArrowLeft, FiFileText } from 'react-icons/fi';
import { FaUserMd, FaHospital, FaDollarSign } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function AppointmentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [appointment, setAppointment] = useState<IAppointment | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        api.get(`/appointments/${id}`)
            .then(res => setAppointment(res.data.appointment))
            .catch(() => toast.error('Failed to load appointment details.'))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="flex justify-center py-20"><div className="spinner" /></div>;
    if (!appointment) {
        return (
            <div className="text-center py-20">
                <FiFileText className="text-5xl text-slate-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">Appointment Not Found</h2>
                <p className="text-slate-400 mb-6">This appointment could not be found or you don&apos;t have access.</p>
                <Link href="/dashboard/patient/appointments" className="btn-primary inline-flex items-center gap-2">
                    <FiArrowLeft /> Back to Appointments
                </Link>
            </div>
        );
    }

    const doctor = typeof appointment.doctorId === 'object' ? appointment.doctorId : null;

    const statusColors: Record<string, string> = {
        pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        accepted: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
        completed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        canceled: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    };

    return (
        <div>
            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="mb-6 flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
                <FiArrowLeft /> Back to Appointments
            </button>

            <h1 className="text-2xl font-bold text-white mb-6">Appointment Details</h1>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Doctor Info */}
                <div className="lg:col-span-1">
                    <div className="card-glass p-6">
                        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Doctor Information</h2>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mb-4">
                                {doctor?.profileImage ? (
                                    <img src={doctor.profileImage} alt={doctor.doctorName} className="w-full h-full rounded-2xl object-cover" />
                                ) : (
                                    <FaUserMd className="text-3xl text-emerald-400" />
                                )}
                            </div>
                            <h3 className="text-base font-semibold text-white">{doctor?.doctorName || 'Doctor'}</h3>
                            <p className="text-sm text-emerald-400 mb-1">{doctor?.specialization}</p>
                            {doctor?.hospitalName && (
                                <p className="text-xs text-slate-500 flex items-center gap-1 justify-center">
                                    <FaHospital className="text-slate-600" /> {doctor.hospitalName}
                                </p>
                            )}
                            {doctor?.consultationFee && (
                                <p className="text-xs text-slate-400 flex items-center gap-1 justify-center mt-1">
                                    <FaDollarSign className="text-emerald-500" /> ${doctor.consultationFee} consultation fee
                                </p>
                            )}
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/5 text-center">
                            <Link
                                href={`/doctors/${doctor?._id}`}
                                className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                            >
                                View Doctor Profile →
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Appointment Details */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Status Card */}
                    <div className="card-glass p-6">
                        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Appointment Status</h2>
                        <div className="flex flex-wrap items-center gap-4">
                            <span className={`px-4 py-1.5 rounded-full text-sm font-medium border capitalize ${statusColors[appointment.appointmentStatus]}`}>
                                {appointment.appointmentStatus}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${appointment.paymentStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                Payment: {appointment.paymentStatus}
                            </span>
                        </div>
                    </div>

                    {/* Schedule Card */}
                    <div className="card-glass p-6">
                        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Schedule</h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                    <FiCalendar className="text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Date</p>
                                    <p className="text-sm font-medium text-white">
                                        {new Date(appointment.appointmentDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                    <FiClock className="text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Time</p>
                                    <p className="text-sm font-medium text-white">{appointment.appointmentTime}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Symptoms Card */}
                    <div className="card-glass p-6">
                        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Symptoms / Reason for Visit</h2>
                        <p className="text-sm text-slate-300 leading-relaxed">{appointment.symptoms || 'No symptoms recorded.'}</p>
                    </div>

                    {/* Booking Info */}
                    <div className="card-glass p-6">
                        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Booking Information</h2>
                        <div className="grid sm:grid-cols-2 gap-3 text-sm">
                            <div>
                                <p className="text-xs text-slate-500 mb-1">Appointment ID</p>
                                <p className="text-white font-mono text-xs break-all">{appointment._id}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 mb-1">Booked On</p>
                                <p className="text-white">{new Date(appointment.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3">
                        {['pending', 'accepted'].includes(appointment.appointmentStatus) && (
                            <Link
                                href="/dashboard/patient/appointments"
                                className="btn-secondary text-sm px-5 py-2.5 flex items-center gap-2"
                            >
                                Reschedule / Cancel
                            </Link>
                        )}
                        {appointment.appointmentStatus === 'completed' && appointment.paymentStatus === 'paid' && (
                            <Link
                                href="/dashboard/patient/reviews"
                                className="btn-primary text-sm px-5 py-2.5"
                            >
                                Write a Review
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
