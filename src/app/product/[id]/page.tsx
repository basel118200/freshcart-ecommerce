'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { ShoppingCart, Heart, Star, CheckCircle, ChevronRight, Minus, Plus, Zap, User } from 'lucide-react';
import Link from 'next/link';
import FeaturedProducts from '@/components/FeaturedProducts';
import { useCart, useWishlist } from '@/hooks/useStore';

export default function ProductDetails() {
    const { id } = useParams();
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: ['product', id],
        queryFn: async () => (await api.get(`/products/${id}`)).data.data,
    });

    if (isLoading) return <div className="loading-spinner">Loading Details...</div>;
    if (!data) return <div className="text-center py-32 text-xl">Product not found</div>;

    const mainImage = selectedImage || data.imageCover;
    const allImages = [data.imageCover, ...(data.images || [])];
    const reviews = data.reviews || [];

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(data._id);
        }
    };

    const handleBuyNow = () => {
        handleAddToCart();
        window.location.href = '/cart';
    };

    const toggleWishlist = () => {
        if (isInWishlist(data._id)) {
            removeFromWishlist(data._id);
        } else {
            addToWishlist(data._id);
        }
    };

    return (
        <div className="section-padding">
            <div className="container">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                    <Link href="/" className="hover:text-primary">Home</Link>
                    <ChevronRight size={14} />
                    <Link href="/products" className="hover:text-primary">Products</Link>
                    <ChevronRight size={14} />
                    <span className="text-primary font-medium truncate max-w-[200px]">{data.title}</span>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                    {/* ── Images ── */}
                    <div className="space-y-4">
                        <div className="bg-gray-50 rounded-2xl p-8 flex justify-center items-center group overflow-hidden border border-gray-100">
                            <img
                                src={mainImage}
                                alt={data.title}
                                className="max-w-full max-h-[450px] object-contain transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>

                        {allImages.length > 1 && (
                            <div className="grid grid-cols-5 gap-2">
                                {allImages.map((img: string, idx: number) => (
                                    <div
                                        key={idx}
                                        onClick={() => setSelectedImage(img)}
                                        className={`aspect-square rounded-xl overflow-hidden border-2 p-1.5 cursor-pointer transition-all bg-white ${mainImage === img ? 'border-primary shadow-md' : 'border-gray-200 hover:border-primary'}`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-contain" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Info ── */}
                    <div>
                        <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
                            {data.category?.name}
                        </span>
                        <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-4 leading-tight">{data.title}</h1>

                        {/* Rating & Brand */}
                        <div className="flex flex-wrap items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={16}
                                        fill={i < Math.floor(data.ratingsAverage) ? '#EAB308' : 'none'}
                                        color={i < Math.floor(data.ratingsAverage) ? '#EAB308' : '#D1D5DB'}
                                    />
                                ))}
                                <span className="ml-1 text-gray-500 text-sm font-medium">
                                    {data.ratingsAverage} ({data.ratingsQuantity} Reviews)
                                </span>
                            </div>
                            {data.brand?.name && (
                                <>
                                    <div className="w-px h-4 bg-gray-200" />
                                    <span className="text-sm text-secondary font-medium">
                                        Brand: <span className="text-primary">{data.brand.name}</span>
                                    </span>
                                </>
                            )}
                            {data.sold && (
                                <>
                                    <div className="w-px h-4 bg-gray-200" />
                                    <span className="text-sm text-gray-500">{data.sold.toLocaleString()} sold</span>
                                </>
                            )}
                        </div>

                        {/* Description */}
                        <p className="text-gray-500 leading-relaxed mb-6 whitespace-pre-line">{data.description}</p>

                        {/* Price & Stock */}
                        <div className="flex items-center gap-6 mb-6">
                            <div className="text-4xl font-bold text-primary">
                                {data.price} <span className="text-lg">EGP</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-green-600 font-semibold bg-green-50 px-3 py-1.5 rounded-lg text-sm">
                                <CheckCircle size={16} /> In Stock ({data.quantity})
                            </div>
                        </div>

                        {/* Quantity Selector */}
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-sm font-semibold text-secondary">Quantity:</span>
                            <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600"
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="w-12 text-center font-bold text-secondary text-lg">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(q => Math.min(data.quantity, q + 1))}
                                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 btn-primary py-4 text-lg flex items-center justify-center gap-3"
                            >
                                <ShoppingCart size={20} /> Add to Cart
                            </button>
                            <button
                                onClick={handleBuyNow}
                                className="flex-1 py-4 text-lg flex items-center justify-center gap-3 bg-secondary text-white rounded-xl font-semibold hover:bg-secondary/90 transition-colors"
                            >
                                <Zap size={20} /> Buy Now
                            </button>
                            <button
                                onClick={toggleWishlist}
                                className={`w-14 h-14 border-2 rounded-xl flex items-center justify-center transition-all ${isInWishlist(data._id)
                                    ? 'border-red-500 bg-red-50 text-red-500'
                                    : 'border-gray-200 hover:border-red-500 hover:text-red-500'
                                    }`}
                            >
                                <Heart size={24} fill={isInWishlist(data._id) ? 'currentColor' : 'none'} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Reviews Section ── */}
                {reviews.length > 0 && (
                    <div className="mt-16">
                        <div className="flex items-center gap-3 mb-8">
                            <h2 className="text-2xl font-bold text-secondary">Customer Reviews</h2>
                            <span className="bg-primary/10 text-primary text-sm font-bold px-3 py-1 rounded-full">
                                {reviews.length} Reviews
                            </span>
                        </div>

                        {/* Rating Summary */}
                        <div className="bg-gray-50 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 mb-8 border border-gray-100">
                            <div className="text-center">
                                <div className="text-6xl font-bold text-secondary">{data.ratingsAverage}</div>
                                <div className="flex items-center justify-center gap-1 mt-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={18}
                                            fill={i < Math.floor(data.ratingsAverage) ? '#EAB308' : 'none'}
                                            color={i < Math.floor(data.ratingsAverage) ? '#EAB308' : '#D1D5DB'}
                                        />
                                    ))}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">{data.ratingsQuantity} Reviews</div>
                            </div>

                            {/* Rating bars */}
                            <div className="flex-1 w-full space-y-2">
                                {[5, 4, 3, 2, 1].map((star) => {
                                    const count = reviews.filter((r: any) => Math.floor(r.rating) === star).length;
                                    const pct = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
                                    return (
                                        <div key={star} className="flex items-center gap-3">
                                            <span className="text-sm text-gray-500 w-4">{star}</span>
                                            <Star size={12} fill="#EAB308" color="#EAB308" />
                                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                            <span className="text-sm text-gray-500 w-6">{count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Individual Reviews */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {reviews.map((review: any) => (
                                <div key={review._id} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                <User size={18} />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-secondary">{review.user?.name || 'Anonymous'}</div>
                                                <div className="text-xs text-gray-400">
                                                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric', month: 'short', day: 'numeric'
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={13}
                                                    fill={i < review.rating ? '#EAB308' : 'none'}
                                                    color={i < review.rating ? '#EAB308' : '#D1D5DB'}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed">{review.review}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Related Products ── */}
                <div className="mt-20">
                    <FeaturedProducts
                        categoryId={data.category?._id}
                        title="Related Products"
                    />
                </div>
            </div>
        </div>
    );
}
