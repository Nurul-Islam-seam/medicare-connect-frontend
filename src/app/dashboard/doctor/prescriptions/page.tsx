'use client';
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { IPrescription } from '@/types';
import toast from 'react-hot-toast';
import { FiFileText, FiPlus } from 'react-icons/fi';

function PrescriptionsContent() {
    const searchParams = useSearchParams();
    const appointmentIdFromQuery = searchParams.get('appointmentId');
    const [prescriptions, setPrescriptions] = useState<IPrescription[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(!!appointmentIdFromQuery);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState({
        appointmentId: appointmentIdFromQuery || '',
        patientId: '',
        diagnosis: '',
        medications: [{ name: '', dosage: '', frequency: '', duration: '' }],
        notes: '',
    });

    const fetchPrescriptions = () => {
        api.get('/prescriptions/doctor').then(res => setPrescriptions(res.data.prescriptions || [])).catch(() => {}).finally(() => setLoading(false));
    };

    useEffect(() => { fetchPrescriptions(); }, []);

    const addMedication = () => setForm({ ...form, medications: [...form.medications, { name: '', dosage: '', frequency: '', duration: '' }] });
    const removeMedication = (index: number) => setForm({ ...form, medications: form.medications.filter((_, i) => i !== index) });
    const updateMedication = (index: number, field: string, value: string) => {
        const updated = [...form.medications];
        updated[index] = { ...updated[index], [field]: value };
        setForm({ ...form, medications: updated });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/prescriptions/${editingId}`, { diagnosis: form.diagnosis, medications: form.medications, notes: form.notes });
                toast.success('Prescription updated!');
            } else {
                await api.post('/prescriptions', form);
                toast.success('Prescription created!');
            }
            setShowForm(false);
            setEditingId(null);
            setForm({ appointmentId: '', patientId: '', diagnosis: '', medications: [{ name: '', dosage: '', frequency: '', duration: '' }], notes: '' });
            fetchPrescriptions();
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            toast.error(error.response?.data?.message || 'Failed to save prescription.');
        }
    };

    const startEdit = (p: IPrescription) => {
        setEditingId(p._id);
        setForm({ appointmentId: typeof p.appointmentId === 'string' ? p.appointmentId : p.appointmentId._id, patientId: typeof p.patientId === 'string' ? p.patientId : p.patientId._id, diagnosis: p.diagnosis, medications: p.medications, notes: p.notes });
        setShowForm(true);
    };

    if (loading) return <div className="flex justify-center py-20"><div className="spinner" /></div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white">Prescriptions</h1>
                <button onClick={() => { setShowForm(!showForm); setEditingId(null); }} className="btn-primary text-sm flex items-center gap-1"><FiPlus /> New</button>
            </div>

            {showForm && (
                <div className="card-glass p-6 mb-6">
                    <h2 className="text-lg font-semibold text-white mb-4">{editingId ? 'Update' : 'Create'} Prescription</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!editingId && (
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div><label className="block text-xs text-slate-400 mb-1">Appointment ID</label><input value={form.appointmentId} onChange={e => setForm({ ...form, appointmentId: e.target.value })} className="input-field" required /></div>
                                <div><label className="block text-xs text-slate-400 mb-1">Patient ID</label><input value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })} className="input-field" required /></div>
                            </div>
                        )}
                        <div><label className="block text-xs text-slate-400 mb-1">Diagnosis</label><input value={form.diagnosis} onChange={e => setForm({ ...form, diagnosis: e.target.value })} className="input-field" required /></div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-2">Medications</label>
                            {form.medications.map((med, i) => (
                                <div key={i} className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-2">
                                    <input value={med.name} onChange={e => updateMedication(i, 'name', e.target.value)} className="input-field text-sm" placeholder="Name" />
                                    <input value={med.dosage} onChange={e => updateMedication(i, 'dosage', e.target.value)} className="input-field text-sm" placeholder="Dosage" />
                                    <input value={med.frequency} onChange={e => updateMedication(i, 'frequency', e.target.value)} className="input-field text-sm" placeholder="Frequency" />
                                    <input value={med.duration} onChange={e => updateMedication(i, 'duration', e.target.value)} className="input-field text-sm" placeholder="Duration" />
                                    {form.medications.length > 1 && <button type="button" onClick={() => removeMedication(i)} className="text-red-400 text-sm">Remove</button>}
                                </div>
                            ))}
                            <button type="button" onClick={addMedication} className="text-emerald-400 text-sm mt-1 hover:underline">+ Add Medication</button>
                        </div>
                        <div><label className="block text-xs text-slate-400 mb-1">Notes</label><textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="input-field min-h-[80px]" /></div>
                        <div className="flex gap-2"><button type="submit" className="btn-primary px-6 py-2">{editingId ? 'Update' : 'Create'}</button><button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="btn-secondary px-6 py-2">Cancel</button></div>
                    </form>
                </div>
            )}

            {prescriptions.length === 0 && !showForm ? (
                <div className="card-glass p-12 text-center"><FiFileText className="text-4xl text-slate-600 mx-auto mb-4" /><p className="text-slate-400">No prescriptions yet.</p></div>
            ) : (
                <div className="space-y-4">
                    {prescriptions.map(p => {
                        const patient = typeof p.patientId === 'object' ? p.patientId : null;
                        return (
                            <div key={p._id} className="card-glass p-5">
                                <div className="flex justify-between items-start gap-4">
                                    <div>
                                        <p className="text-sm font-semibold text-white">Patient: {patient?.name || 'Unknown'}</p>
                                        <p className="text-xs text-slate-400 mt-1">Diagnosis: <span className="text-white">{p.diagnosis}</span></p>
                                        <div className="mt-2">
                                            <p className="text-xs text-slate-500 mb-1">Medications:</p>
                                            {p.medications.map((m, i) => (
                                                <p key={i} className="text-xs text-slate-300 ml-2">• {m.name} — {m.dosage}, {m.frequency}, {m.duration}</p>
                                            ))}
                                        </div>
                                        {p.notes && <p className="text-xs text-slate-500 mt-2">Notes: {p.notes}</p>}
                                    </div>
                                    <button onClick={() => startEdit(p)} className="text-xs text-blue-400 hover:text-blue-300">Edit</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default function DoctorPrescriptionsPage() {
    return <Suspense fallback={<div className="flex justify-center py-20"><div className="spinner" /></div>}><PrescriptionsContent /></Suspense>;
}
