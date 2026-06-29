'use client';
import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { IReview, IAppointment } from '@/types';
import { FiStar, FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import { FaUserMd } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function PatientReviewsPage() {
    const [reviews, setReviews] = useState<IReview[]>([]);
    const [completedAppointments, setCompletedAppointments] = useState<IAppointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editRating, setEditRating] = useState(5);
    const [editText, setEditText] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newRating, setNewRating] = useState(5);
    const [newText, setNewText] = useState('');
    const [selectedDoctorId, setSelectedDoctorId] = useState('');

    const fetchData = async () => {
        try {
            const [reviewsRes, apptRes] = await Promise.allSettled([
                api.get('/reviews/my'),
                api.get('/appointments/my', { params: { status: 'completed' } }),
            ]);
            if (reviewsRes.status === 'fulfilled') setReviews(reviewsRes.value.data.reviews || []);
            if (apptRes.status === 'fulfilled') setCompletedAppointments(apptRes.value.data.appointments || []);
        } catch { /* silent */ }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    // Completed appointments that haven't been reviewed yet
    const reviewedDoctorIds = new Set(
        reviews.map(r => (typeof r.doctorId === 'object' ? r.doctorId._id : r.doctorId))
    );
    const unreviewedAppointments = completedAppointments.filter(a => {
        const dId = typeof a.doctorId === 'object' ? a.doctorId._id : a.doctorId;
        return !reviewedDoctorIds.has(dId);
    });

    const handleAddReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDoctorId) { toast.error('Please select a doctor.'); return; }
        if (!newText.trim()) { toast.error('Please write your review.'); return; }
        try {
            await api.post('/reviews', { doctorId: selectedDoctorId, rating: newRating, reviewText: newText });
            toast.success('Review submitted!');
            setShowAddForm(false);
            setNewRating(5);
            setNewText('');
            setSelectedDoctorId('');
            fetchData();
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            toast.error(error.response?.data?.message || 'Failed to submit review.');
        }
    };

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({ title: 'Delete Review?', text: 'This action cannot be undone.', icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444', confirmButtonText: 'Delete', background: '#1e293b', color: '#f1f5f9' });
        if (!result.isConfirmed) return;
        try { await api.delete(`/reviews/${id}`); toast.success('Review deleted.'); fetchData(); } catch { toast.error('Failed to delete.'); }
    };

    const handleUpdate = async (id: string) => {
        try { await api.put(`/reviews/${id}`, { rating: editRating, reviewText: editText }); toast.success('Review updated!'); setEditingId(null); fetchData(); } catch { toast.error('Failed to update.'); }
    };

    const startEdit = (review: IReview) => { setEditingId(review._id); setEditRating(review.rating); setEditText(review.reviewText); };

    if (loading) return <div className="flex justify-center py-20"><div className="spinner" /></div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <h1 className="text-2xl font-bold text-white">My Reviews</h1>
                {unreviewedAppointments.length > 0 && (
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="btn-primary text-sm flex items-center gap-1"
                    >
                        {showAddForm ? <><FiX /> Cancel</> : <><FiPlus /> Write a Review</>}
                    </button>
                )}
            </div>

            {/* Add Review Form */}
            {showAddForm && (
                <div className="card-glass p-6 mb-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Write a Review</h2>
                    <form onSubmit={handleAddReview} className="space-y-4">
                        {/* Doctor Selection */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Select Doctor (Completed Appointment)</label>
                            <div className="grid gap-2 sm:grid-cols-2">
                                {unreviewedAppointments.map((appt) => {
                                    const doctor = typeof appt.doctorId === 'object' ? appt.doctorId : null;
                                    const dId = doctor?._id || '';
                                    return (
                                        <button
                                            key={appt._id}
                                            type="button"
                                            onClick={() => setSelectedDoctorId(dId)}
                                            className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${selectedDoctorId === dId ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                                        >
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                                                <FaUserMd className="text-emerald-400" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium text-white">{doctor?.doctorName || 'Doctor'}</p>
                                                <p className="text-xs text-emerald-400">{doctor?.specialization}</p>
                                                <p className="text-xs text-slate-500">{new Date(appt.appointmentDate).toLocaleDateString()}</p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Rating */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Rating</label>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map(n => (
                                    <button
                                        key={n}
                                        type="button"
                                        onClick={() => setNewRating(n)}
                                        className={`text-2xl transition-colors ${n <= newRating ? 'text-amber-400' : 'text-slate-600 hover:text-amber-400/50'}`}
                                    >
                                        ★
                                    </button>
                                ))}
                                <span className="ml-2 text-sm text-slate-400">{newRating} / 5</span>
                            </div>
                        </div>

                        {/* Review Text */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Your Experience</label>
                            <textarea
                                value={newText}
                                onChange={(e) => setNewText(e.target.value)}
                                placeholder="Share your experience with this doctor..."
                                className="input-field min-h-[100px]"
                                required
                            />
                        </div>

                        <div className="flex gap-3">
                            <button type="submit" className="btn-primary px-6 py-2">Submit Review</button>
                            <button type="button" onClick={() => setShowAddForm(false)} className="btn-secondary px-6 py-2">Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Existing Reviews */}
            {reviews.length === 0 && !showAddForm ? (
                <div className="card-glass p-12 text-center">
                    <FiStar className="text-4xl text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 mb-4">You haven&apos;t written any reviews yet.</p>
                    {unreviewedAppointments.length > 0 && (
                        <button onClick={() => setShowAddForm(true)} className="btn-primary text-sm flex items-center gap-1 mx-auto">
                            <FiPlus /> Write Your First Review
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => {
                        const doctor = typeof review.doctorId === 'object' ? review.doctorId : null;
                        return (
                            <div key={review._id} className="card-glass p-5">
                                {editingId === review._id ? (
                                    <div className="space-y-3">
                                        <p className="text-sm font-semibold text-white">Editing review for {doctor?.doctorName}</p>
                                        <div className="flex items-center gap-1">
                                            {[1,2,3,4,5].map(n => (
                                                <button key={n} type="button" onClick={() => setEditRating(n)} className={`text-xl ${n <= editRating ? 'text-amber-400' : 'text-slate-600'}`}>★</button>
                                            ))}
                                        </div>
                                        <textarea value={editText} onChange={(e) => setEditText(e.target.value)} className="input-field min-h-[80px]" />
                                        <div className="flex gap-2">
                                            <button onClick={() => handleUpdate(review._id)} className="btn-primary text-sm px-4 py-2">Save</button>
                                            <button onClick={() => setEditingId(null)} className="btn-secondary text-sm px-4 py-2">Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <p className="text-sm font-semibold text-white">{doctor?.doctorName || 'Doctor'}</p>
                                            <p className="text-xs text-emerald-400">{doctor?.specialization || ''}</p>
                                            <div className="flex items-center gap-1 my-2">
                                                {[...Array(5)].map((_, i) => <FiStar key={i} className={`text-sm ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />)}
                                                <span className="ml-1 text-xs text-slate-400">{review.rating}/5</span>
                                            </div>
                                            <p className="text-sm text-slate-400">{review.reviewText}</p>
                                            <p className="text-xs text-slate-600 mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex gap-2 flex-shrink-0">
                                            <button onClick={() => startEdit(review)} className="p-2 rounded-lg hover:bg-white/5 text-blue-400"><FiEdit2 /></button>
                                            <button onClick={() => handleDelete(review._id)} className="p-2 rounded-lg hover:bg-red-500/5 text-red-400"><FiTrash2 /></button>
                                        </div>
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
