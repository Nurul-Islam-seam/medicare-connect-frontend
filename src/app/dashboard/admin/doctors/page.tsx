'use client';
import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { IDoctor } from '@/types';
import { FiCheck, FiX, FiRefreshCcw } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminDoctorsPage() {
    const [doctors, setDoctors] = useState<IDoctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('');

    const fetchDoctors = () => {
        const params: Record<string, string> = {};
        if (filterStatus) params.verificationStatus = filterStatus;
        api.get('/admin/doctors', { params }).then(res => setDoctors(res.data.doctors || [])).catch(() => toast.error('Failed to load doctors.')).finally(() => setLoading(false));
    };

    useEffect(() => { fetchDoctors(); }, [filterStatus]);

    const updateStatus = async (id: string, status: string) => {
        try {
            await api.put(`/admin/doctors/${id}/verify`, { verificationStatus: status });
            toast.success('Doctor verification status updated.');
            fetchDoctors();
        } catch { toast.error('Failed to update status.'); }
    };

    if (loading) return <div className="flex justify-center py-20"><div className="spinner" /></div>;

    const statusColors: Record<string, string> = {
        verified: 'bg-emerald-500/10 text-emerald-400',
        pending: 'bg-amber-500/10 text-amber-400',
        rejected: 'bg-red-500/10 text-red-400',
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <h1 className="text-2xl font-bold text-white">Manage Doctors</h1>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-field w-auto">
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            <div className="card-glass overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-white/5">
                            <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Doctor</th>
                            <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Specialization</th>
                            <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Experience</th>
                            <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Status</th>
                            <th className="text-right px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {doctors.map((d) => (
                            <tr key={d._id} className="border-b border-white/5 hover:bg-white/[0.02]">
                                <td className="px-5 py-4">
                                    <p className="font-semibold text-white">{d.doctorName}</p>
                                    <p className="text-xs text-slate-400">{typeof d.userId === 'object' ? d.userId.email : ''}</p>
                                </td>
                                <td className="px-5 py-4 text-emerald-400">{d.specialization}</td>
                                <td className="px-5 py-4 text-slate-300">{d.experience} yrs</td>
                                <td className="px-5 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${statusColors[d.verificationStatus]}`}>
                                        {d.verificationStatus}
                                    </span>
                                </td>
                                <td className="px-5 py-4 flex items-center justify-end gap-2">
                                    {d.verificationStatus !== 'verified' && (
                                        <button onClick={() => updateStatus(d._id, 'verified')} className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20" title="Verify"><FiCheck /></button>
                                    )}
                                    {d.verificationStatus !== 'rejected' && (
                                        <button onClick={() => updateStatus(d._id, 'rejected')} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20" title="Reject"><FiX /></button>
                                    )}
                                    {d.verificationStatus !== 'pending' && (
                                        <button onClick={() => updateStatus(d._id, 'pending')} className="p-2 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20" title="Reset to Pending"><FiRefreshCcw /></button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
