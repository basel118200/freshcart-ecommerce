'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/auth/signin', { email, password });
            if (data.message === 'success') {
                localStorage.setItem('userToken', data.token);
                toast.success('Logged in successfully!');
                router.push('/');
                setTimeout(() => window.location.reload(), 500);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 py-10 px-5">
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg w-full max-w-md">
                <h1 className="page-title">Login</h1>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="flex flex-col gap-1.5">
                        <label className="form-label">Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" required className="input-field" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="form-label">Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" required minLength={6} className="input-field" />
                    </div>
                    <div className="text-right">
                        <Link href="/forgot-password" className="text-sm text-primary font-medium hover:underline">Forgot Password?</Link>
                    </div>
                    <button type="submit" className="btn-primary w-full py-3.5 text-lg" disabled={loading}>
                        {loading ? 'Processing...' : 'Login'}
                    </button>
                </form>
                <p className="text-center mt-8 text-sm text-gray-500">
                    Don&apos;t have an account? <Link href="/register" className="text-primary font-bold">Register</Link>
                </p>
            </div>
        </div>
    );
}
