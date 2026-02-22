'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function ChangePassword() {
    const [form, setForm] = useState({ currentPassword: '', password: '', rePassword: '' });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.password !== form.rePassword) {
            toast.error("Passwords don't match");
            return;
        }
        setLoading(true);
        try {
            const { data } = await api.put('/auth/changePassword', form);
            if (data.message === 'success') {
                toast.success('Password changed!');
                localStorage.removeItem('userToken');
                router.push('/login');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 py-10 px-5">
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg w-full max-w-md">
                <h1 className="page-title">Change Password</h1>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="flex flex-col gap-1.5">
                        <label className="form-label">Current Password</label>
                        <input type="password" value={form.currentPassword} onChange={e => update('currentPassword', e.target.value)} placeholder="••••••••" required minLength={6} className="input-field" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="form-label">New Password</label>
                        <input type="password" value={form.password} onChange={e => update('password', e.target.value)} placeholder="••••••••" required minLength={6} className="input-field" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="form-label">Confirm New Password</label>
                        <input type="password" value={form.rePassword} onChange={e => update('rePassword', e.target.value)} placeholder="••••••••" required minLength={6} className="input-field" />
                    </div>
                    <button type="submit" className="btn-primary w-full py-3.5 text-lg" disabled={loading}>
                        {loading ? 'Processing...' : 'Update Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}
