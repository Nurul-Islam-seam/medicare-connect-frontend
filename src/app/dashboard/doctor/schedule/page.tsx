'use client';
import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { IDoctor } from '@/types';
import toast from 'react-hot-toast';
import { FiPlus, FiX } from 'react-icons/fi';

const daysOfWeek = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const defaultSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

export default function DoctorSchedulePage() {
    const [doctor, setDoctor] = useState<IDoctor | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
    const [customSlot, setCustomSlot] = useState('');

    useEffect(() => {
        api.get('/doctors/my/profile').then(res => {
            setDoctor(res.data.doctor);
            setSelectedDays(res.data.doctor.availableDays || []);
            setSelectedSlots(res.data.doctor.availableSlots || []);
        }).catch(() => toast.error('Failed to load profile.')).finally(() => setLoading(false));
    }, []);

    const toggleDay = (day: string) => {
        setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
    };

    const toggleSlot = (slot: string) => {
        setSelectedSlots(prev => prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot]);
    };

    const addCustomSlot = () => {
        if (customSlot && !selectedSlots.includes(customSlot)) {
            setSelectedSlots([...selectedSlots, customSlot]);
            setCustomSlot('');
        }
    };

    const removeSlot = (slot: string) => setSelectedSlots(prev => prev.filter(s => s !== slot));

    const handleSave = async () => {
        try {
            await api.put('/doctors/my/profile', { availableDays: selectedDays, availableSlots: selectedSlots });
            toast.success('Schedule updated successfully!');
        } catch { toast.error('Failed to update schedule.'); }
    };

    if (loading) return <div className="flex justify-center py-20"><div className="spinner" /></div>;

    return (
        <div>
            <h1 className="text-2xl font-bold text-white mb-6">Manage Schedule</h1>

            {/* Available Days */}
            <div className="card-glass p-6 mb-6">
                <h2 className="text-lg font-semibold text-white mb-4">Available Days</h2>
                <div className="flex flex-wrap gap-3">
                    {daysOfWeek.map(day => (
                        <button key={day} onClick={() => toggleDay(day)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedDays.includes(day) ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'}`}>
                            {day}
                        </button>
                    ))}
                </div>
            </div>

            {/* Available Slots */}
            <div className="card-glass p-6 mb-6">
                <h2 className="text-lg font-semibold text-white mb-4">Available Time Slots</h2>
                <div className="flex flex-wrap gap-3 mb-4">
                    {defaultSlots.map(slot => (
                        <button key={slot} onClick={() => toggleSlot(slot)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedSlots.includes(slot) ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'}`}>
                            {slot}
                        </button>
                    ))}
                </div>

                {/* Custom Slot */}
                <div className="flex gap-2 items-center">
                    <input type="time" value={customSlot} onChange={e => setCustomSlot(e.target.value)} className="input-field w-auto" />
                    <button onClick={addCustomSlot} className="btn-secondary text-sm px-3 py-2 flex items-center gap-1"><FiPlus /> Add Slot</button>
                </div>

                {/* Selected Slots Preview */}
                {selectedSlots.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/5">
                        <p className="text-xs text-slate-400 mb-2">Selected Slots:</p>
                        <div className="flex flex-wrap gap-2">
                            {selectedSlots.map(slot => (
                                <span key={slot} className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm">
                                    {slot}
                                    <button onClick={() => removeSlot(slot)} className="text-red-400 hover:text-red-300"><FiX className="text-xs" /></button>
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <button onClick={handleSave} className="btn-primary px-8 py-3">Save Schedule</button>
        </div>
    );
}
