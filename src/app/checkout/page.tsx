'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useStore';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { CreditCard, Truck, MapPin, Phone, Building } from 'lucide-react';

export default function Checkout() {
    const { cartData } = useCart();
    const [details, setDetails] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const canSubmit = details && phone && city && !loading;

    const handleCashOrder = async () => {
        if (!cartData?.data?._id) return;
        setLoading(true);
        try {
            const { data } = await api.post(`/orders/${cartData.data._id}`, {
                shippingAddress: { details, phone, city }
            });
            if (data.status === 'success') {
                toast.success('Order placed successfully!');
                router.push('/orders');
            }
        } catch {
            toast.error('Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    const handleOnlinePayment = async () => {
        if (!cartData?.data?._id) return;
        setLoading(true);
        try {
            const { data } = await api.post(`/orders/checkout-session/${cartData.data._id}?url=${window.location.origin}`, {
                shippingAddress: { details, phone, city }
            });
            if (data.status === 'success') {
                window.location.href = data.session.url;
            }
        } catch {
            toast.error('Failed to initiate payment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="section-padding bg-gray-50/30 min-h-screen">
            <div className="container">
                <h1 className="text-3xl font-bold mb-10 text-secondary">Checkout</h1>

                <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8 items-start">
                    {/* Shipping Form */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-8 text-secondary flex items-center gap-2">
                            <Truck size={22} className="text-primary" /> Shipping Information
                        </h2>
                        <div className="space-y-5">
                            <div className="flex flex-col gap-1.5">
                                <label className="form-label flex items-center gap-1.5">
                                    <Building size={14} /> Address Details
                                </label>
                                <textarea
                                    value={details}
                                    onChange={e => setDetails(e.target.value)}
                                    placeholder="Street address, building number, apartment..."
                                    required
                                    className="input-field h-28 resize-none"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="flex flex-col gap-1.5">
                                    <label className="form-label flex items-center gap-1.5">
                                        <Phone size={14} /> Phone Number
                                    </label>
                                    <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. 01012345678" required className="input-field" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="form-label flex items-center gap-1.5">
                                        <MapPin size={14} /> City
                                    </label>
                                    <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="Enter city name" required className="input-field" />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-6">
                                <button
                                    onClick={handleCashOrder}
                                    className="flex-1 bg-secondary text-white py-4 rounded-xl font-bold text-lg transition-all hover:bg-black disabled:opacity-50"
                                    disabled={!canSubmit}
                                >
                                    Pay with Cash
                                </button>
                                <button
                                    onClick={handleOnlinePayment}
                                    className="flex-1 btn-primary py-4 text-lg flex items-center justify-center gap-2"
                                    disabled={!canSubmit}
                                >
                                    <CreditCard size={20} /> Pay Online
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-28">
                        <h3 className="text-xl font-bold mb-6 text-secondary">Order Summary</h3>
                        <div className="space-y-3 mb-6 text-sm">
                            <div className="flex justify-between text-gray-500">
                                <span>Cart Subtotal</span>
                                <span className="text-secondary font-semibold">{cartData?.data?.totalCartPrice || 0} EGP</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span>Delivery</span>
                                <span className="text-green-600 font-semibold">Free</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center py-4 border-t border-dashed border-gray-200 mb-4">
                            <span className="font-bold text-gray-600">Total</span>
                            <span className="text-2xl font-bold text-primary">{cartData?.data?.totalCartPrice || 0} <span className="text-sm">EGP</span></span>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">By placing your order, you agree to our Terms of Service. All payments are secure and encrypted.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
