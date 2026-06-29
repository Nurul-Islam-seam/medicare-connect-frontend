'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { IAppointment } from '@/types';
import { FiCalendar, FiClock, FiX, FiEdit2 } from 'react-icons/fi';
import { FaUserMd } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { useSearchParams, useRouter } from 'next/navigation';
import BookAppointmentModal from '@/components/appointments/BookAppointmentModal';
import { Suspense } from 'react';

function PatientAppointmentsContent() {
    const [appointments, setAppointments] = useState<IAppointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('');
    const [rescheduleId, setRescheduleId] = useState<string | null>(null);
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');
    
    const searchParams = useSearchParams();
    const router = useRouter();
    const bookId = searchParams.get('book');

    const fetchAppointments = async () => {
        try {
            const params: Record<string, string> = {};
            if (filterStatus) params.status = filterStatus;
            const res = await api.get('/appointments/my', { params });
            setAppointments(res.data.appointments || []);
        } catch { toast.error('Failed to load appointments.'); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        void Promise.resolve().then(() => fetchAppointments());
    }, [filterStatus]);

    const handleCancel = async (id: string) => {
        const result = await Swal.fire({
            title: 'Cancel Appointment?',
            text: 'Are you sure you want to cancel this appointment?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Yes, cancel it',
            background: '#1e293b',
            color: '#f1f5f9',
        });
        if (!result.isConfirmed) return;
        try {
            await api.put(`/appointments/cancel/${id}`);
            toast.success('Appointment canceled.');
            fetchAppointments();
        } catch { toast.error('Failed to cancel.'); }
    };

    const handleReschedule = async (id: string) => {
        if (!newDate || !newTime) { toast.error('Please select date and time.'); return; }
        try {
            await api.put(`/appointments/reschedule/${id}`, { appointmentDate: newDate, appointmentTime: newTime });
            toast.success('Appointment rescheduled!');
            setRescheduleId(null);
            setNewDate('');
            setNewTime('');
            fetchAppointments();
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            toast.error(error.response?.data?.message || 'Failed to reschedule.');
        }
    };

    const statusColors: Record<string, string> = {
        pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        accepted: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
        completed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        canceled: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    };

    if (loading) return <div className="flex justify-center py-20"><div className="spinner" /></div>;

    const closeBooking = () => {
        router.push('/dashboard/patient/appointments');
    };

    return (
        <div>
            {bookId && (
                <BookAppointmentModal
                    doctorId={bookId}
                    onClose={closeBooking}
                    onSuccess={() => {
                        fetchAppointments();
                        closeBooking();
                    }}
                />
            )}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <h1 className="text-2xl font-bold text-white">My Appointments</h1>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-field w-auto">
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="completed">Completed</option>
                    <option value="canceled">Canceled</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            {appointments.length === 0 ? (
                <div className="card-glass p-12 text-center">
                    <FiCalendar className="text-4xl text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">No appointments found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {appointments.map((appt) => {
                        const doctor = typeof appt.doctorId === 'object' ? appt.doctorId : null;
                        return (
                            <div key={appt._id} className="card-glass p-5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                                            <FaUserMd className="text-emerald-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-white">{doctor?.doctorName || 'Doctor'}</h3>
                                            <p className="text-xs text-emerald-400">{doctor?.specialization || ''}</p>
                                            <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                                                <span className="flex items-center gap-1"><FiCalendar /> {new Date(appt.appointmentDate).toLocaleDateString()}</span>
                                                <span className="flex items-center gap-1"><FiClock /> {appt.appointmentTime}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1">Symptoms: {appt.symptoms}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[appt.appointmentStatus]}`}>
                                            {appt.appointmentStatus}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded text-xs ${appt.paymentStatus === 'paid' ? 'text-emerald-400' : 'text-amber-400'}`}>
                                            {appt.paymentStatus}
                                        </span>
                                        <Link href={`/dashboard/patient/appointments/${appt._id}`} className="text-xs text-slate-400 hover:text-white transition-colors">
                                            View Details →
                                        </Link>
                                        {['pending', 'accepted'].includes(appt.appointmentStatus) && (
                                            <div className="flex gap-2">
                                                <button onClick={() => setRescheduleId(rescheduleId === appt._id ? null : appt._id)} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                                                    <FiEdit2 /> Reschedule
                                                </button>
                                                <button onClick={() => handleCancel(appt._id)} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
                                                    <FiX /> Cancel
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Reschedule Form */}
                                {rescheduleId === appt._id && (
                                    <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap items-end gap-3">
                                        <div>
                                            <label className="block text-xs text-slate-400 mb-1">New Date</label>
                                            <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="input-field text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-slate-400 mb-1">New Time</label>
                                            <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} className="input-field text-sm" />
                                        </div>
                                        <button onClick={() => handleReschedule(appt._id)} className="btn-primary text-sm px-4 py-2">Confirm</button>
                                        <button onClick={() => setRescheduleId(null)} className="btn-secondary text-sm px-4 py-2">Cancel</button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default function PatientAppointmentsPage() {
    return (
        <Suspense fallback={<div className="flex justify-center py-20"><div className="spinner" /></div>}>
            <PatientAppointmentsContent />
        </Suspense>
    );
}
