'use client';
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import api from '@/lib/api';

interface MonthlyTrend {
    _id: { month: number; year: number };
    count: number;
}

interface RevenueTrend {
    _id: { month: number; year: number };
    totalRevenue: number;
}

interface AppointmentStat {
    _id: string;
    count: number;
}

interface TopDoctor {
    _id: string;
    doctorName: string;
    specialization: string;
    averageRating?: number;
    ratingCount: number;
}

interface AnalyticsData {
    monthlyTrends: MonthlyTrend[];
    revenueData: RevenueTrend[];
    appointmentStats: AppointmentStat[];
    topDoctors: TopDoctor[];
}

export default function AdminAnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/admin/analytics').then(res => setData(res.data.analytics)).catch(() => {}).finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="flex justify-center py-20"><div className="spinner" /></div>;
    if (!data) return <div className="text-center py-20 text-slate-400">Failed to load analytics data.</div>;

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const apptTrends = data.monthlyTrends.map((t) => ({
        name: `${monthNames[t._id.month - 1]} ${t._id.year}`,
        Appointments: t.count,
    }));

    const revTrends = data.revenueData.map((t) => ({
        name: `${monthNames[t._id.month - 1]} ${t._id.year}`,
        Revenue: t.totalRevenue,
    }));

    const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];
    const pieData = data.appointmentStats.map((s) => ({ name: s._id, value: s.count }));

    return (
        <div>
            <h1 className="text-2xl font-bold text-white mb-6">Platform Analytics</h1>

            <div className="grid lg:grid-cols-2 gap-6 mb-6">
                {/* Appointment Trends */}
                <div className="card-glass p-6">
                    <h2 className="text-lg font-semibold text-white mb-6">Appointments Over Time</h2>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={apptTrends}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }} />
                                <Line type="monotone" dataKey="Appointments" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Revenue Trends */}
                <div className="card-glass p-6">
                    <h2 className="text-lg font-semibold text-white mb-6">Revenue Growth</h2>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revTrends}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                                <Bar dataKey="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Appointment Status Pie */}
                <div className="card-glass p-6">
                    <h2 className="text-lg font-semibold text-white mb-2">Status Distribution</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                    {pieData.map((entry, index) => <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 mt-2">
                        {pieData.map((entry, index) => (
                            <div key={entry.name} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                <span className="text-xs text-slate-400 capitalize">{entry.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Doctors */}
                <div className="lg:col-span-2 card-glass p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Top Rated Doctors</h2>
                    <div className="space-y-4">
                        {data.topDoctors.slice(0, 5).map((d, i) => (
                            <div key={d._id} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] p-3">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">#{i + 1}</div>
                                    <div>
                                        <p className="text-sm font-semibold text-white">{d.doctorName}</p>
                                        <p className="text-xs text-slate-400">{d.specialization}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-amber-400">★ {d.averageRating?.toFixed(1) || 0}</p>
                                    <p className="text-xs text-slate-500">{d.ratingCount} reviews</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
