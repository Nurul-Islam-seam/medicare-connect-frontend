import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import api from '@/lib/api';
import { IDoctor } from '@/types';
import StripeWrapper from '../payment/StripeWrapper';
import toast from 'react-hot-toast';

interface BookAppointmentModalProps {
    doctorId: string;
    onClose: () => void;
    onSuccess: () => void;
}

const BookAppointmentModal: React.FC<BookAppointmentModalProps> = ({ doctorId, onClose, onSuccess }) => {
    const [doctor, setDoctor] = useState<IDoctor | null>(null);
    const [step, setStep] = useState<1 | 2>(1); // 1: Book, 2: Pay
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [symptoms, setSymptoms] = useState('');

    const [appointmentId, setAppointmentId] = useState<string | null>(null);
    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
        api.get(`/doctors/${doctorId}`)
            .then(res => setDoctor(res.data.doctor))
            .catch(() => {
                toast.error('Failed to load doctor details.');
                onClose();
            })
            .finally(() => setLoading(false));
    }, [doctorId, onClose]);

    const handleBook = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        try {
            // 1. Create Appointment
            const apptRes = await api.post('/appointments', {
                doctorId,
                appointmentDate: date,
                appointmentTime: time,
                symptoms,
            });

            const newApptId = apptRes.data.appointment._id;
            setAppointmentId(newApptId);

            // 2. Create Payment Intent
            const payRes = await api.post('/payment/create-payment-intent', { appointmentId: newApptId });
            setClientSecret(payRes.data.clientSecret);

            setStep(2);
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            toast.error(error.response?.data?.message || 'Failed to book appointment.');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="spinner" />
        </div>
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b border-white/5 bg-slate-800/50">
                    <h2 className="text-lg font-bold text-white">
                        {step === 1 ? 'Book Appointment' : 'Complete Payment'}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <FiX className="text-xl" />
                    </button>
                </div>

                <div className="p-6">
                    {step === 1 ? (
                        <form onSubmit={handleBook} className="space-y-4">
                            <div>
                                <p className="text-sm text-slate-300 mb-2">Booking with <span className="font-semibold text-white">Dr. {doctor?.doctorName}</span></p>
                                <p className="text-xs text-slate-400 mb-4">Consultation Fee: <span className="text-emerald-400 font-semibold">${doctor?.consultationFee}</span></p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Date</label>
                                <input type="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="input-field" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Time Slot</label>
                                <select value={time} onChange={e => setTime(e.target.value)} className="input-field" required>
                                    <option value="">Select a time slot</option>
                                    {doctor?.availableSlots?.map(slot => (
                                        <option key={slot} value={slot}>{slot}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Symptoms / Reason</label>
                                <textarea value={symptoms} onChange={e => setSymptoms(e.target.value)} className="input-field min-h-[80px]" placeholder="Briefly describe your symptoms..." required />
                            </div>
                            <button type="submit" disabled={processing} className="btn-primary w-full py-3 mt-2 disabled:opacity-50">
                                {processing ? 'Processing...' : 'Proceed to Payment'}
                            </button>
                        </form>
                    ) : (
                        <div>
                            <p className="text-sm text-slate-300 mb-6 text-center">
                                Please pay the consultation fee of <span className="text-emerald-400 font-bold">${doctor?.consultationFee}</span> to confirm your booking.
                            </p>
                            {clientSecret && appointmentId && (
                                <StripeWrapper
                                    appointmentId={appointmentId}
                                    amount={doctor?.consultationFee || 0}
                                    clientSecret={clientSecret}
                                    onSuccess={() => {
                                        onSuccess();
                                        onClose();
                                    }}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookAppointmentModal;
