'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { ShoppingCart, Heart, Star, Eye } from 'lucide-react';
import Link from 'next/link';
import { useCart, useWishlist } from '@/hooks/useStore';
import toast from 'react-hot-toast';

interface Props {
    categoryId?: string;
    brandId?: string;
    title?: string;
}

export default function FeaturedProducts({ categoryId, brandId, title = 'Featured Products' }: Props) {
    const { addToCart } = useCart();
    const { addToWishlist, isInWishlist } = useWishlist();

    const { data, isLoading } = useQuery({
        queryKey: ['products', categoryId, brandId],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (categoryId) params.append('category[in]', categoryId);
            if (brandId) params.append('brand', brandId);
            return (await api.get(`/products?${params.toString()}`)).data.data;
        },
    });

    const handleAddToCart = (id: string) => {
        addToCart(id);
    };

    if (isLoading) return <div className="loading-spinner">Loading Products...</div>;

    return (
        <section className="section-padding">
            <div className="container">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-3xl font-extrabold text-secondary relative after:content-[''] after:absolute after:-bottom-3 after:left-0 after:w-12 after:h-1 after:bg-primary after:rounded-full">
                        {title}
                    </h2>
                    <Link href="/products" className="text-primary font-bold text-sm hover:underline flex items-center gap-1 group">
                        View All <Eye size={16} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
                    {data?.map((product: any) => (
                        <div key={product._id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:border-primary/20 group relative">
                            {/* Tags */}
                            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                                <span className="bg-primary/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                                    {product.category?.name}
                                </span>
                                {product.priceAfterDiscount && (
                                    <span className="bg-red-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                                        Sale
                                    </span>
                                )}
                            </div>

                            {/* Wishlist Button */}
                            <button
                                onClick={() => addToWishlist(product._id)}
                                className={`absolute top-4 right-4 z-20 p-2.5 rounded-full shadow-lg transition-all duration-300 transform group-hover:scale-110 ${isInWishlist(product._id) ? 'bg-red-50 text-red-500 opacity-100' : 'bg-white text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500'}`}
                            >
                                <Heart size={18} fill={isInWishlist(product._id) ? 'currentColor' : 'none'} />
                            </button>

                            {/* Product Image */}
                            <div className="relative aspect-[4/5] bg-gray-50/50 overflow-hidden">
                                <Link href={`/product/${product._id}`} className="w-full h-full p-8 block">
                                    <img
                                        src={product.imageCover}
                                        alt={product.title}
                                        className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                                    />
                                </Link>

                                {/* Quick Actions Overlay */}
                                <div className="absolute inset-0 bg-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl transform translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
                                        <Eye size={20} className="text-secondary" />
                                    </div>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-5">
                                <div className="flex items-center gap-1 text-[11px] font-bold text-yellow-500 mb-2">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={12} fill={i < Math.floor(product.ratingsAverage) ? 'currentColor' : 'none'} />
                                        ))}
                                    </div>
                                    <span className="text-gray-400 ml-1">({product.ratingsAverage})</span>
                                </div>

                                <Link href={`/product/${product._id}`}>
                                    <h3 className="font-bold text-secondary mb-3 h-11 overflow-hidden line-clamp-2 text-sm hover:text-primary transition-colors leading-snug">
                                        {product.title}
                                    </h3>
                                </Link>

                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex flex-col">
                                        <span className="text-lg font-black text-primary leading-none">{product.price} EGP</span>
                                        {product.priceAfterDiscount && (
                                            <span className="text-xs text-gray-400 line-through mt-1">{product.price + 200} EGP</span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleAddToCart(product._id)}
                                        className="w-10 h-10 bg-secondary text-white rounded-xl flex items-center justify-center transition-all duration-300 hover:bg-primary hover:shadow-lg hover:-translate-y-1 active:scale-95"
                                        title="Add to Cart"
                                    >
                                        <ShoppingCart size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
