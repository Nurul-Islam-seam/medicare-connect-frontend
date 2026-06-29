'use client';
import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { IPayment } from '@/types';
import { FiDollarSign } from 'react-icons/fi';

export default function PatientPaymentsPage() {
    const [payments, setPayments] = useState<IPayment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/payments/my').then(res => setPayments(res.data.payments || [])).catch(() => {}).finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="flex justify-center py-20"><div className="spinner" /></div>;

    return (
        <div>
            <h1 className="text-2xl font-bold text-white mb-6">Payment History</h1>
            {payments.length === 0 ? (
                <div className="card-glass p-12 text-center"><FiDollarSign className="text-4xl text-slate-600 mx-auto mb-4" /><p className="text-slate-400">No payment records found.</p></div>
            ) : (
                <div className="card-glass overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Doctor</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Amount</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Transaction ID</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((p) => {
                                const doc = typeof p.doctorId === 'object' ? p.doctorId : null;
                                return (
                                    <tr key={p._id} className="border-b border-white/5 hover:bg-white/[0.02]">
                                        <td className="px-5 py-4 text-white">{doc?.doctorName || 'Doctor'}</td>
                                        <td className="px-5 py-4 text-emerald-400 font-semibold">${p.amount}</td>
                                        <td className="px-5 py-4 text-slate-400 font-mono text-xs">{p.transactionId}</td>
                                        <td className="px-5 py-4 text-slate-400">{new Date(p.paymentDate).toLocaleDateString()}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
