'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const router = useRouter();

    const titles = ['Forgot Password', 'Verify Reset Code', 'Reset Password'];

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/auth/forgotPasswords', { email });
            if (data.statusMsg === 'success') {
                toast.success(data.message);
                setStep(2);
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/auth/verifyResetCode', { resetCode: code });
            if (data.status === 'Success') {
                toast.success('Code verified!');
                setStep(3);
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Invalid code');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.put('/auth/resetPassword', { email, newPassword });
            if (data.token) {
                toast.success('Password updated!');
                router.push('/login');
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Error updating password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 py-10 px-5">
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg w-full max-w-md">
                <h1 className="page-title">{titles[step - 1]}</h1>

                {step === 1 && (
                    <form onSubmit={handleSendCode} className="space-y-5">
                        <div className="flex flex-col gap-1.5">
                            <label className="form-label">Email Address</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your registered email" required className="input-field" />
                        </div>
                        <button type="submit" className="btn-primary w-full py-3.5 text-lg" disabled={loading}>
                            {loading ? 'Sending...' : 'Send Reset Code'}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyCode} className="space-y-5">
                        <div className="flex flex-col gap-1.5">
                            <label className="form-label text-center">Verification Code</label>
                            <input type="text" value={code} onChange={e => setCode(e.target.value)} placeholder="Enter 6-digit code" required className="input-field text-center text-2xl tracking-[8px] font-bold" />
                        </div>
                        <button type="submit" className="btn-primary w-full py-3.5 text-lg" disabled={loading}>
                            {loading ? 'Verifying...' : 'Verify Code'}
                        </button>
                        <p className="text-center text-sm text-gray-500">
                            Didn&apos;t receive the code? <button type="button" onClick={handleSendCode} className="text-primary font-bold hover:underline">Resend</button>
                        </p>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleResetPassword} className="space-y-5">
                        <div className="flex flex-col gap-1.5">
                            <label className="form-label">New Password</label>
                            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Enter new password" required className="input-field" />
                        </div>
                        <button type="submit" className="btn-primary w-full py-3.5 text-lg" disabled={loading}>
                            {loading ? 'Updating...' : 'Reset Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
