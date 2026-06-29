'use client';
import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { IPayment } from '@/types';
import toast from 'react-hot-toast';

export default function AdminPaymentsPage() {
    const [payments, setPayments] = useState<IPayment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/admin/payments').then(res => setPayments(res.data.payments || [])).catch(() => toast.error('Failed to load payments.')).finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="flex justify-center py-20"><div className="spinner" /></div>;

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white">All Payments</h1>
                <div className="card-glass px-4 py-2 border-emerald-500/30 bg-emerald-500/10">
                    <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">Total Revenue</p>
                    <p className="text-xl font-bold text-white">${totalRevenue.toLocaleString()}</p>
                </div>
            </div>

            <div className="card-glass overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-white/5">
                            <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Transaction ID</th>
                            <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Patient</th>
                            <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Doctor</th>
                            <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Amount</th>
                            <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((p) => {
                            const patient = typeof p.patientId === 'object' ? p.patientId : null;
                            const doctor = typeof p.doctorId === 'object' ? p.doctorId : null;
                            return (
                                <tr key={p._id} className="border-b border-white/5 hover:bg-white/[0.02]">
                                    <td className="px-5 py-4 text-slate-400 font-mono text-xs">{p.transactionId}</td>
                                    <td className="px-5 py-4 font-semibold text-white">{patient?.name || 'Unknown'}</td>
                                    <td className="px-5 py-4">
                                        <p className="font-semibold text-emerald-400">{doctor?.doctorName}</p>
                                        <p className="text-xs text-slate-400">{doctor?.specialization}</p>
                                    </td>
                                    <td className="px-5 py-4 font-bold text-emerald-400">${p.amount}</td>
                                    <td className="px-5 py-4 text-slate-300">{new Date(p.paymentDate).toLocaleDateString()}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
