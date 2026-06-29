'use client';
import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { IAppointment } from '@/types';
import toast from 'react-hot-toast';

export default function AdminAppointmentsPage() {
    const [appointments, setAppointments] = useState<IAppointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('');

    const fetchAppointments = () => {
        const params: Record<string, string> = {};
        if (filterStatus) params.status = filterStatus;
        api.get('/admin/appointments', { params }).then(res => setAppointments(res.data.appointments || [])).catch(() => toast.error('Failed to load appointments.')).finally(() => setLoading(false));
    };

    useEffect(() => { fetchAppointments(); }, [filterStatus]);

    if (loading) return <div className="flex justify-center py-20"><div className="spinner" /></div>;

    const statusColors: Record<string, string> = {
        pending: 'bg-amber-500/10 text-amber-400',
        accepted: 'bg-emerald-500/10 text-emerald-400',
        rejected: 'bg-red-500/10 text-red-400',
        completed: 'bg-blue-500/10 text-blue-400',
        canceled: 'bg-slate-500/10 text-slate-400',
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <h1 className="text-2xl font-bold text-white">All Appointments</h1>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-field w-auto">
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="completed">Completed</option>
                    <option value="canceled">Canceled</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            <div className="card-glass overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-white/5">
                            <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Patient</th>
                            <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Doctor</th>
                            <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Date & Time</th>
                            <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Status</th>
                            <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Payment</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((a) => {
                            const patient = typeof a.patientId === 'object' ? a.patientId : null;
                            const doctor = typeof a.doctorId === 'object' ? a.doctorId : null;
                            return (
                                <tr key={a._id} className="border-b border-white/5 hover:bg-white/[0.02]">
                                    <td className="px-5 py-4">
                                        <p className="font-semibold text-white">{patient?.name}</p>
                                    </td>
                                    <td className="px-5 py-4">
                                        <p className="font-semibold text-emerald-400">{doctor?.doctorName}</p>
                                        <p className="text-xs text-slate-400">{doctor?.specialization}</p>
                                    </td>
                                    <td className="px-5 py-4 text-slate-300">
                                        {new Date(a.appointmentDate).toLocaleDateString()} <br/>
                                        <span className="text-xs text-slate-500">{a.appointmentTime}</span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${statusColors[a.appointmentStatus]}`}>
                                            {a.appointmentStatus}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${a.paymentStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                            {a.paymentStatus}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
