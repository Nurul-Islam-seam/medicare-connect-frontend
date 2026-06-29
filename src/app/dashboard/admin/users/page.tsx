'use client';
import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { IUser } from '@/types';
import { FiTrash2, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = () => {
        api.get('/admin/users').then(res => setUsers(res.data.users || [])).catch(() => toast.error('Failed to load users.')).finally(() => setLoading(false));
    };

    useEffect(() => { fetchUsers(); }, []);

    const toggleStatus = async (id: string, currentStatus: string) => {
        try {
            await api.put(`/admin/users/${id}/status`, { status: currentStatus === 'active' ? 'suspended' : 'active' });
            toast.success('User status updated.');
            fetchUsers();
        } catch { toast.error('Failed to update status.'); }
    };

    const deleteUser = async (id: string) => {
        const result = await Swal.fire({ title: 'Delete User?', text: 'This cannot be undone.', icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444', confirmButtonText: 'Delete', background: '#1e293b', color: '#f1f5f9' });
        if (!result.isConfirmed) return;
        try { await api.delete(`/admin/users/${id}`); toast.success('User deleted.'); fetchUsers(); } catch { toast.error('Failed to delete.'); }
    };

    const makeAdmin = async (id: string) => {
        const result = await Swal.fire({ title: 'Make Admin?', text: 'This user will have full access.', icon: 'question', showCancelButton: true, confirmButtonColor: '#10b981', confirmButtonText: 'Confirm', background: '#1e293b', color: '#f1f5f9' });
        if (!result.isConfirmed) return;
        try { await api.put(`/admin/users/${id}/role`, { role: 'admin' }); toast.success('User is now an admin.'); fetchUsers(); } catch { toast.error('Failed to update role.'); }
    };

    if (loading) return <div className="flex justify-center py-20"><div className="spinner" /></div>;

    return (
        <div>
            <h1 className="text-2xl font-bold text-white mb-6">Manage Users</h1>
            <div className="card-glass overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-white/5">
                            <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase">User</th>
                            <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Role</th>
                            <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Status</th>
                            <th className="text-right px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u._id} className="border-b border-white/5 hover:bg-white/[0.02]">
                                <td className="px-5 py-4">
                                    <p className="font-semibold text-white">{u.name}</p>
                                    <p className="text-xs text-slate-400">{u.email}</p>
                                </td>
                                <td className="px-5 py-4 text-slate-300 capitalize">{u.role}</td>
                                <td className="px-5 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${u.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                        {u.status}
                                    </span>
                                </td>
                                <td className="px-5 py-4 flex items-center justify-end gap-2">
                                    {u.role !== 'admin' && (
                                        <button onClick={() => makeAdmin(u._id)} className="p-2 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20" title="Make Admin"><FiShield /></button>
                                    )}
                                    <button onClick={() => toggleStatus(u._id, u.status)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${u.status === 'active' ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'}`}>
                                        {u.status === 'active' ? 'Suspend' : 'Activate'}
                                    </button>
                                    <button onClick={() => deleteUser(u._id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20" title="Delete User"><FiTrash2 /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
