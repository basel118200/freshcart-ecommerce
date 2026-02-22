'use client';

import { useCart } from '@/hooks/useStore';
import { Trash2, Plus, Minus, CreditCard, ShoppingBag, LogIn, ArrowLeft, ShoppingCart as CartIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function Cart() {
    const { cartData, isLoading, updateQuantity, removeItem, clearCart, isGuest, guestCount } = useCart();
    const [guestItems, setGuestItems] = useState<any[]>([]);
    const [isFetchingGuest, setIsFetchingGuest] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchGuestDetails = async () => {
            if (isGuest && typeof window !== 'undefined') {
                const localCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
                if (localCart.length > 0) {
                    setIsFetchingGuest(true);
                    try {
                        const products = [];
                        for (const item of localCart) {
                            const res = await api.get(`/products/${item.id}`);
                            products.push({ product: res.data.data, price: res.data.data.price, count: item.count });
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
    const totalPrice = isGuest ? guestItems.reduce((acc, item) => acc + (item.price * item.count), 0) : (cartData?.data?.totalCartPrice || 0);
    const itemCount = isGuest ? guestItems.reduce((acc, item) => acc + item.count, 0) : (cartData?.numOfCartItems || 0);

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
        <div className="section-padding min-h-screen bg-white">
            <div className="container max-w-6xl">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                            <CartIcon size={24} />
                        </div>
                        <h1 className="text-3xl font-black text-[#003B5C]">Shopping Cart</h1>
                    </div>
                    <p className="text-gray-500 font-medium">
                        You have <span className="text-primary font-bold">{itemCount} {itemCount === 1 ? 'item' : 'items'}</span> in your cart
                    </p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-[1fr_350px] gap-10 items-start">
                    {/* Cart Items List */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-4 sm:p-8 space-y-8">
                            {items.map((item: any) => (
                                <div key={item.product._id} className="flex flex-col sm:flex-row items-center gap-6 group">
                                    {/* Product Image */}
                                    <div className="w-32 h-32 bg-[#F8F9FA] rounded-[24px] p-4 flex-shrink-0 flex items-center justify-center border border-gray-50">
                                        <img src={item.product.imageCover} alt={item.product.title} className="w-full h-full object-contain mix-blend-multiply" />
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-1 text-center sm:text-left">
                                        <h3 className="font-bold text-secondary text-lg mb-2 line-clamp-1">{item.product.title}</h3>
                                        <div className="mb-3">
                                            <span className="bg-[#E6F9F3] text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                                {item.product.category?.name || 'Category'}
                                            </span>
                                        </div>
                                        <p className="text-primary font-black text-xl mb-4">{item.price.toLocaleString()} EGP</p>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center justify-center sm:justify-start">
                                            <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
                                                <button
                                                    onClick={() => updateQuantity({ productId: item.product._id, count: item.count - 1 })}
                                                    disabled={item.count <= 1}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-primary disabled:opacity-20 transition-colors"
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span className="font-black text-lg px-6 min-w-[50px] text-center text-secondary">{item.count}</span>
                                                <button
                                                    onClick={() => updateQuantity({ productId: item.product._id, count: item.count + 1 })}
                                                    className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-md shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Subtotal & Delete */}
                                    <div className="flex flex-col items-end gap-3 min-w-[120px]">
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total</p>
                                            <p className="text-2xl font-black text-secondary">
                                                {(item.price * item.count).toLocaleString()} <span className="text-[11px] font-bold text-gray-400 uppercase">EGP</span>
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.product._id)}
                                            className="w-10 h-10 rounded-xl border border-red-100 bg-red-50/30 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Bottom Links */}
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-2">
                            <Link href="/products" className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
                                <ArrowLeft size={18} /> Continue Shopping
                            </Link>
                            <button
                                onClick={() => clearCart()}
                                className="flex items-center gap-2 text-gray-400 font-bold hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={18} /> Clear all items
                            </button>
                        </div>
                    </div>

                    {/* Summary Card */}
                    <div className="bg-[#F8F9FA] p-8 rounded-[32px] border border-gray-100 sticky top-28">
                        <h3 className="text-2xl font-black mb-8 text-secondary">Order Summary</h3>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-gray-400">Subtotal</span>
                                <span className="font-black text-secondary">{totalPrice.toLocaleString()} EGP</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-gray-400">Shipping</span>
                                <span className="font-black text-green-500">FREE</span>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-dashed border-gray-200 mb-8">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-secondary">Total</span>
                                <span className="text-3xl font-black text-primary">{totalPrice.toLocaleString()} <span className="text-sm font-bold">EGP</span></span>
                            </div>
                        </div>

                        {isGuest ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex gap-3">
                                    <div className="w-5 h-5 rounded-full bg-orange-500 flex-shrink-0 text-white text-[10px] flex items-center justify-center font-bold">!</div>
                                    <p className="text-xs text-orange-700 font-bold leading-tight">You must be logged in to complete your checkout.</p>
                                </div>
                                <Link href="/login" className="w-full bg-secondary text-white py-5 rounded-[20px] font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-secondary/20 hover:-translate-y-1 active:translate-y-0 transition-all">
                                    <LogIn size={20} /> Login to Checkout
                                </Link>
                            </div>
                        ) : (
                            <Link href="/checkout" className="w-full btn-primary py-5 rounded-[20px] font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:-translate-y-1 active:translate-y-0 transition-all">
                                <CreditCard size={20} /> Checkout
                            </Link>
                        )}

                        <div className="mt-8 grid grid-cols-4 gap-4 grayscale opacity-30">
                            {/* Simple placeholders for payment icons */}
                            <div className="h-8 bg-gray-200 rounded"></div>
                            <div className="h-8 bg-gray-200 rounded"></div>
                            <div className="h-8 bg-gray-200 rounded"></div>
                            <div className="h-8 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
