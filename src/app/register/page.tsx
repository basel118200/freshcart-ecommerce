'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '', rePassword: '', phone: '' });
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
            const { data } = await api.post('/auth/signup', form);
            if (data.message === 'success') {
                toast.success('Account created!');
                router.push('/login');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 py-10 px-5">
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg w-full max-w-md">
                <h1 className="page-title">Register</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="form-label">Name</label>
                        <input value={form.name} onChange={e => update('name', e.target.value)} placeholder="Enter your name" required minLength={3} className="input-field" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="form-label">Email</label>
                        <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="Enter your email" required className="input-field" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="form-label">Password</label>
                        <input type="password" value={form.password} onChange={e => update('password', e.target.value)} placeholder="Enter password" required minLength={6} className="input-field" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="form-label">Confirm Password</label>
                        <input type="password" value={form.rePassword} onChange={e => update('rePassword', e.target.value)} placeholder="Confirm password" required minLength={6} className="input-field" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="form-label">Phone</label>
                        <input value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="e.g. 01012345678" required pattern="^01[0125][0-9]{8}$" className="input-field" />
                    </div>
                    <button type="submit" className="btn-primary w-full py-3.5 text-lg" disabled={loading}>
                        {loading ? 'Processing...' : 'Register'}
                    </button>
                </form>
                <p className="text-center mt-8 text-sm text-gray-500">
                    Already have an account? <Link href="/login" className="text-primary font-bold">Login</Link>
                </p>
            </div>
        </div>
    );
}
