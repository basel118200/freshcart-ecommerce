'use client';

import { useWishlist, useCart } from '@/hooks/useStore';
import { Trash2, ShoppingCart, HeartOff } from 'lucide-react';
import Link from 'next/link';

export default function Wishlist() {
    const { wishlistData, isLoading, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    if (isLoading) return <div className="loading-spinner">Loading your wishlist...</div>;

    const items = wishlistData?.data || [];

    if (items.length === 0) {
        return (
            <div className="section-padding">
                <div className="container">
                    <div className="empty-state">
                        <HeartOff size={48} className="mx-auto text-gray-300 mb-6" />
                        <h2 className="text-3xl font-bold text-secondary mb-3">Your wishlist is empty</h2>
                        <p className="text-gray-500 mb-8">Save items you like for later! ❤️</p>
                        <Link href="/products" className="btn-primary px-10 py-3 inline-block">Explore Products</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="section-padding min-h-screen">
            <div className="container">
                <h1 className="text-3xl font-bold mb-10 text-secondary">My <span className="text-primary">Wishlist</span></h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {items.map((product: any) => (
                        <div key={product.id} className="bg-white group rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-all duration-300">
                            <div className="aspect-square bg-gray-50 rounded-xl p-5 relative overflow-hidden mb-4">
                                <img src={product.imageCover} alt={product.title} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" />
                                <button
                                    onClick={() => removeFromWishlist(product.id)}
                                    className="absolute top-3 right-3 bg-white p-2 rounded-lg text-red-500 shadow-md hover:bg-red-500 hover:text-white transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <h3 className="font-semibold text-secondary line-clamp-2 h-12 mb-2 group-hover:text-primary transition-colors">{product.title}</h3>
                            <p className="text-xl font-bold text-primary mb-4">{product.price} <span className="text-xs">EGP</span></p>

                            <button
                                onClick={() => { addToCart(product.id); removeFromWishlist(product.id); }}
                                className="w-full btn-primary py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm"
                            >
                                <ShoppingCart size={16} /> Move to Cart
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
