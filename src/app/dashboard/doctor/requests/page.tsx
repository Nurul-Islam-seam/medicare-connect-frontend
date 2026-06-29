'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { IAppointment } from '@/types';
import { FiCheck, FiX, FiCheckSquare } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function DoctorRequestsPage() {
    const [appointments, setAppointments] = useState<IAppointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('');
    const router = useRouter();

    const fetchRequests = () => {
        const params: Record<string, string> = {};
        if (filterStatus) params.status = filterStatus;
        api.get('/appointments/doctor/requests', { params }).then(res => setAppointments(res.data.appointments || [])).catch(() => {}).finally(() => setLoading(false));
    };

    useEffect(() => { fetchRequests(); }, [filterStatus]);

    const handleAction = async (id: string, action: 'accept' | 'reject' | 'complete') => {
        try {
            const res = await api.put(`/appointments/${action}/${id}`);
            toast.success(res.data.message);
            if (action === 'complete' && res.data.redirectTo) {
                router.push(res.data.redirectTo);
            }
            fetchRequests();
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            toast.error(error.response?.data?.message || `Failed to ${action}.`);
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

    return (
        <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <h1 className="text-2xl font-bold text-white">Appointment Requests</h1>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-field w-auto">
                    <option value="">All</option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            {appointments.length === 0 ? (
                <div className="card-glass p-12 text-center"><p className="text-slate-400">No appointment requests.</p></div>
            ) : (
                <div className="space-y-4">
                    {appointments.map(appt => {
                        const patient = typeof appt.patientId === 'object' ? appt.patientId : null;
                        return (
                            <div key={appt._id} className="card-glass p-5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-semibold text-white">{patient?.name || 'Patient'}</p>
                                        <p className="text-xs text-slate-400">{patient?.email}</p>
                                        <p className="text-xs text-slate-400 mt-1">
                                            📅 {new Date(appt.appointmentDate).toLocaleDateString()} at {appt.appointmentTime}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">Symptoms: {appt.symptoms}</p>
                                        <p className="text-xs mt-1">Payment: <span className={appt.paymentStatus === 'paid' ? 'text-emerald-400' : 'text-amber-400'}>{appt.paymentStatus}</span></p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[appt.appointmentStatus]}`}>{appt.appointmentStatus}</span>
                                        <div className="flex gap-2">
                                            {appt.appointmentStatus === 'pending' && (
                                                <>
                                                    <button onClick={() => handleAction(appt._id, 'accept')} className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 flex items-center gap-1"><FiCheck /> Accept</button>
                                                    <button onClick={() => handleAction(appt._id, 'reject')} className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center gap-1"><FiX /> Reject</button>
                                                </>
                                            )}
                                            {appt.appointmentStatus === 'accepted' && appt.paymentStatus === 'paid' && (
                                                <button onClick={() => handleAction(appt._id, 'complete')} className="text-xs px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 flex items-center gap-1"><FiCheckSquare /> Complete</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
