'use client';

import { useCart } from '@/hooks/useStore';
import { Trash2, Plus, Minus, CreditCard, ShoppingBag, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function Cart() {
    const { cartData, isLoading, updateQuantity, removeItem, clearCart, isGuest, guestCount } = useCart();
    const [guestItems, setGuestItems] = useState<any[]>([]);
    const [isFetchingGuest, setIsFetchingGuest] = useState(false);
    const router = useRouter();

    // Fetch guest item details manually since the API cart requires login
    useEffect(() => {
        const fetchGuestDetails = async () => {
            if (isGuest && typeof window !== 'undefined') {
                const localIds = JSON.parse(localStorage.getItem('guestCart') || '[]');
                if (localIds.length > 0) {
                    setIsFetchingGuest(true);
                    try {
                        const products = [];
                        for (const id of localIds) {
                            const res = await api.get(`/products/${id}`);
                            products.push({ product: res.data.data, price: res.data.data.price, count: 1 });
                        }
                        setGuestItems(products);
                    } catch (error) {
                        console.error('Error fetching guest cart details', error);
                    } finally {
                        setIsFetchingGuest(false);
                    }
                } else {
                    setGuestItems([]);
                }
            }
        };
        fetchGuestDetails();
    }, [isGuest, guestCount]);

    if (isLoading || isFetchingGuest) return <div className="loading-spinner">Loading your cart...</div>;

    const items = isGuest ? guestItems : (cartData?.data?.products || []);
    const totalPrice = isGuest ? guestItems.reduce((acc, item) => acc + item.price, 0) : (cartData?.data?.totalCartPrice || 0);

    if (items.length === 0) {
        return (
            <div className="section-padding">
                <div className="container">
                    <div className="empty-state">
                        <ShoppingBag size={48} className="mx-auto text-gray-300 mb-6" />
                        <h2 className="text-3xl font-bold text-secondary mb-3">Your cart is empty</h2>
                        <p className="text-gray-500 mb-8">Looks like you haven&apos;t added anything yet.</p>
                        <Link href="/products" className="btn-primary px-10 py-3 inline-block">Browse Products</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="section-padding min-h-screen bg-gray-50/30">
            <div className="container">
                <h1 className="text-3xl font-bold mb-10 text-secondary">Shopping <span className="text-primary">Cart</span></h1>

                <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8 items-start">
                    {/* Cart Items */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <span className="font-semibold text-gray-500 text-sm">{items.length} Items</span>
                            <button onClick={() => clearCart()} className="text-red-500 font-semibold text-sm hover:underline flex items-center gap-1.5">
                                <Trash2 size={14} /> Clear All
                            </button>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {items.map((item: any) => (
                                <div key={item.product._id} className="p-6 flex flex-col md:flex-row items-center gap-6 hover:bg-gray-50/30 transition-colors">
                                    <div className="w-28 h-28 bg-gray-50 rounded-xl p-3 flex-shrink-0 border border-gray-100">
                                        <img src={item.product.imageCover} alt={item.product.title} className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <Link href={`/product/${item.product._id}`}>
                                            <h3 className="font-semibold text-secondary mb-1 hover:text-primary transition-colors">{item.product.title}</h3>
                                        </Link>
                                        <p className="text-primary font-bold text-lg mb-3">{item.price} EGP</p>
                                        <button onClick={() => removeItem(item.product._id)} className="text-red-500 text-sm font-medium flex items-center gap-1.5 justify-center md:justify-start hover:underline">
                                            <Trash2 size={14} /> Remove
                                        </button>
                                    </div>

                                    {!isGuest && (
                                        <div className="flex items-center gap-3 bg-gray-100/50 p-1.5 rounded-xl border border-gray-200">
                                            <button
                                                onClick={() => updateQuantity({ productId: item.product._id, count: item.count - 1 })}
                                                disabled={item.count <= 1}
                                                className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary disabled:opacity-30 hover:bg-primary hover:text-white transition-all"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="font-bold text-lg min-w-[24px] text-center">{item.count}</span>
                                            <button
                                                onClick={() => updateQuantity({ productId: item.product._id, count: item.count + 1 })}
                                                className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                    )}

                                    <div className="font-bold text-xl text-secondary min-w-[120px] text-right">
                                        {(item.price * (item.count || 1)).toLocaleString()} <span className="text-xs text-gray-400">EGP</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-28">
                        <h3 className="text-xl font-bold mb-6 pb-4 border-b border-gray-100 text-secondary">Order Summary</h3>
                        <div className="space-y-3 mb-6 text-sm">
                            <div className="flex justify-between text-gray-500">
                                <span>Subtotal</span>
                                <span className="text-secondary font-semibold">{totalPrice.toLocaleString()} EGP</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span>Shipping</span>
                                <span className="text-green-600 font-semibold">Free</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center py-4 border-t border-dashed border-gray-200 mb-6">
                            <span className="font-bold text-gray-600">Total</span>
                            <span className="text-2xl font-bold text-primary">{totalPrice.toLocaleString()} <span className="text-sm">EGP</span></span>
                        </div>

                        {isGuest ? (
                            <div className="space-y-4">
                                <p className="text-xs text-orange-600 font-medium bg-orange-50 p-3 rounded-lg flex items-start gap-2">
                                    ⚠️ You must be logged in to complete your purchase.
                                </p>
                                <Link href="/login" className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-3 bg-secondary hover:bg-primary">
                                    <LogIn size={20} /> Login to Checkout
                                </Link>
                            </div>
                        ) : (
                            <Link href="/checkout" className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-3">
                                <CreditCard size={20} /> Checkout
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
