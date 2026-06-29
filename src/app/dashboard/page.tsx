'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { FiCalendar, FiDollarSign, FiStar, FiUsers, FiActivity, FiCheckSquare } from 'react-icons/fi';

export default function DashboardOverview() {
    const { user } = useAuth();
    const [stats, setStats] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                if (user?.role === 'admin') {
                    const res = await api.get('/admin/stats');
                    setStats(res.data.stats);
                } else if (user?.role === 'doctor') {
                    const [appts, reviews] = await Promise.all([
                        api.get('/appointments/doctor/requests'),
                        api.get('/reviews/doctor/me').catch(() => ({ data: { reviews: [] } })),
                    ]);
                    const allAppts = appts.data.appointments || [];
                    const today = new Date().toISOString().split('T')[0];
                    const todaysAppts = allAppts.filter(
                        (a: { appointmentDate: string }) => a.appointmentDate?.startsWith(today)
                    );
                    // Count unique patients
                    const uniquePatients = new Set(
                        allAppts.map((a: { patientId: string | { _id: string } }) =>
                            typeof a.patientId === 'object' ? a.patientId._id : a.patientId
                        )
                    ).size;
                    setStats({
                        totalPatients: uniquePatients,
                        totalAppointments: allAppts.length,
                        todaysAppointments: todaysAppts.length,
                        totalReviews: reviews.data.reviews?.length || 0,
                    });
                } else {
                    const [appts, payments, reviews] = await Promise.all([
                        api.get('/appointments/my'),
                        api.get('/payments/my'),
                        api.get('/reviews/my'),
                    ]);
                    const upcoming = (appts.data.appointments || []).filter(
                        (a: { appointmentStatus: string }) => ['pending', 'accepted'].includes(a.appointmentStatus)
                    );
                    setStats({
                        upcomingAppointments: upcoming.length,
                        totalAppointments: appts.data.appointments?.length || 0,
                        totalPayments: payments.data.payments?.length || 0,
                        totalReviews: reviews.data.reviews?.length || 0,
                    });
                }
            } catch (error) {
                console.error('Failed to fetch dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchStats();
    }, [user]);

    if (loading) return <div className="flex justify-center py-20"><div className="spinner" /></div>;

    const getStatCards = () => {
        if (user?.role === 'admin') {
            return [
                { label: 'Total Doctors', value: stats.totalDoctors || 0, icon: FiActivity, color: 'from-emerald-500 to-teal-600' },
                { label: 'Total Patients', value: stats.totalPatients || 0, icon: FiUsers, color: 'from-blue-500 to-cyan-600' },
                { label: 'Total Appointments', value: stats.totalAppointments || 0, icon: FiCalendar, color: 'from-purple-500 to-violet-600' },
                { label: 'Total Reviews', value: stats.totalReviews || 0, icon: FiStar, color: 'from-amber-500 to-orange-600' },
            ];
        }
        if (user?.role === 'doctor') {
            return [
                { label: 'Total Patients', value: stats.totalPatients || 0, icon: FiUsers, color: 'from-purple-500 to-violet-600' },
                { label: 'Total Appointments', value: stats.totalAppointments || 0, icon: FiCalendar, color: 'from-emerald-500 to-teal-600' },
                { label: "Today's Appointments", value: stats.todaysAppointments || 0, icon: FiCheckSquare, color: 'from-blue-500 to-cyan-600' },
                { label: 'Reviews Received', value: stats.totalReviews || 0, icon: FiStar, color: 'from-amber-500 to-orange-600' },
            ];
        }
        return [
            { label: 'Upcoming Appointments', value: stats.upcomingAppointments || 0, icon: FiCalendar, color: 'from-emerald-500 to-teal-600' },
            { label: 'Total Appointments', value: stats.totalAppointments || 0, icon: FiCheckSquare, color: 'from-blue-500 to-cyan-600' },
            { label: 'Total Payments', value: stats.totalPayments || 0, icon: FiDollarSign, color: 'from-purple-500 to-violet-600' },
            { label: 'My Reviews', value: stats.totalReviews || 0, icon: FiStar, color: 'from-amber-500 to-orange-600' },
        ];
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-white mb-6">
                Welcome back, {user?.name?.split(' ')[0]}!
            </h1>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {getStatCards().map((card) => (
                    <div key={card.label} className="card-glass p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${card.color}`}>
                                <card.icon className="text-white text-lg" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-white">{card.value}</p>
                        <p className="text-sm text-slate-400 mt-1">{card.label}</p>
                    </div>
                ))}
            </div>

            <div className="card-glass p-6">
                <h2 className="text-lg font-semibold text-white mb-3">Quick Actions</h2>
                <p className="text-sm text-slate-400">Navigate to specific sections from the sidebar to manage your {user?.role === 'admin' ? 'platform' : user?.role === 'doctor' ? 'practice' : 'appointments'}.</p>
            </div>
        </div>
    );
}
