'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { jwtDecode } from 'jwt-decode';
import { Package, Clock, CheckCircle, Truck } from 'lucide-react';

export default function Orders() {
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                setUserId(decoded.id);
            } catch {
                console.error('Invalid token');
            }
        }
    }, []);

    const { data: orders, isLoading } = useQuery({
        queryKey: ['orders', userId],
        queryFn: async () => {
            const { data } = await api.get(`/orders/user/${userId}`);
            return data;
        },
        enabled: !!userId,
    });

    if (isLoading) return <div className="loading-spinner">Loading your orders...</div>;

    return (
        <div className="section-padding min-h-screen">
            <div className="container">
                <h1 className="text-3xl font-bold mb-10 text-secondary">Your <span className="text-primary">Orders</span></h1>

                {(!orders || orders.length === 0) && (
                    <div className="empty-state">
                        <Package size={48} className="mx-auto text-gray-300 mb-6" />
                        <h3 className="text-2xl font-bold text-secondary mb-2">No orders yet</h3>
                        <p className="text-gray-500">Your order history will appear here after your first purchase.</p>
                    </div>
                )}

                <div className="space-y-6">
                    {orders?.map((order: any) => (
                        <div key={order.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                            {/* Header */}
                            <div className="px-6 py-4 bg-gray-50 flex flex-col sm:flex-row justify-between items-center border-b border-gray-100 gap-3">
                                <div className="text-sm text-gray-500 space-y-0.5">
                                    <p>Order <span className="text-secondary font-bold">#{order.id}</span></p>
                                    <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold text-xs ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {order.isPaid ? <CheckCircle size={14} /> : <Clock size={14} />}
                                    {order.isPaid ? 'Paid' : 'Pending'}
                                </div>
                            </div>

                            {/* Items */}
                            <div className="p-6 space-y-4">
                                {order.cartItems.map((item: any) => (
                                    <div key={item._id} className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gray-50 rounded-lg p-1.5 border border-gray-100 flex-shrink-0">
                                            <img src={item.product.imageCover} alt={item.product.title} className="w-full h-full object-contain" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-secondary text-sm truncate">{item.product.title}</h4>
                                            <p className="text-xs text-gray-400">Qty: <span className="font-semibold text-gray-600">{item.count}</span> × {item.price} EGP</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Truck size={16} className="text-primary" />
                                    <span>{order.shippingAddress?.city}, {order.shippingAddress?.details}</span>
                                </div>
                                <div className="text-lg font-bold text-secondary">
                                    Total: <span className="text-primary">{order.totalOrderPrice} EGP</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
