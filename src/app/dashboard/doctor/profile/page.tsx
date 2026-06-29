'use client';
import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { IDoctor } from '@/types';
import toast from 'react-hot-toast';

export default function DoctorProfilePage() {
    const [doctor, setDoctor] = useState<IDoctor | null>(null);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ doctorName: '', specialization: '', qualifications: '', experience: 0, consultationFee: 0, hospitalName: '', profileImage: '' });

    useEffect(() => {
        api.get('/doctors/my/profile').then(res => {
            const d = res.data.doctor;
            setDoctor(d);
            setForm({ doctorName: d.doctorName, specialization: d.specialization, qualifications: d.qualifications?.join(', ') || '', experience: d.experience, consultationFee: d.consultationFee, hospitalName: d.hospitalName || '', profileImage: d.profileImage || '' });
        }).catch(() => toast.error('Failed to load profile.')).finally(() => setLoading(false));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.put('/doctors/my/profile', { ...form, qualifications: form.qualifications.split(',').map(q => q.trim()).filter(Boolean) });
            toast.success('Profile updated!');
        } catch { toast.error('Failed to update.'); }
    };

    if (loading) return <div className="flex justify-center py-20"><div className="spinner" /></div>;

    return (
        <div>
            <h1 className="text-2xl font-bold text-white mb-6">Doctor Profile</h1>
            {doctor?.verificationStatus !== 'verified' && (
                <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm text-amber-400">
                    ⚠️ Your profile is <strong>{doctor?.verificationStatus}</strong>. You will appear in search results only after admin verification.
                </div>
            )}
            <div className="card-glass p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-slate-300 mb-1.5">Name</label><input value={form.doctorName} onChange={e => setForm({ ...form, doctorName: e.target.value })} className="input-field" /></div>
                        <div><label className="block text-sm font-medium text-slate-300 mb-1.5">Specialization</label><input value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} className="input-field" /></div>
                        <div><label className="block text-sm font-medium text-slate-300 mb-1.5">Qualifications (comma separated)</label><input value={form.qualifications} onChange={e => setForm({ ...form, qualifications: e.target.value })} className="input-field" placeholder="MBBS, MD" /></div>
                        <div><label className="block text-sm font-medium text-slate-300 mb-1.5">Experience (years)</label><input type="number" value={form.experience} onChange={e => setForm({ ...form, experience: Number(e.target.value) })} className="input-field" /></div>
                        <div><label className="block text-sm font-medium text-slate-300 mb-1.5">Consultation Fee ($)</label><input type="number" value={form.consultationFee} onChange={e => setForm({ ...form, consultationFee: Number(e.target.value) })} className="input-field" /></div>
                        <div><label className="block text-sm font-medium text-slate-300 mb-1.5">Hospital Name</label><input value={form.hospitalName} onChange={e => setForm({ ...form, hospitalName: e.target.value })} className="input-field" /></div>
                    </div>
                    <div><label className="block text-sm font-medium text-slate-300 mb-1.5">Profile Image URL</label><input value={form.profileImage} onChange={e => setForm({ ...form, profileImage: e.target.value })} className="input-field" /></div>
                    <button type="submit" className="btn-primary px-8 py-3">Update Profile</button>
                </form>
            </div>
        </div>
    );
}
