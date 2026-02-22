'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { ShoppingCart, Heart, Star, CheckCircle, ChevronRight, Minus, Plus, Zap, User, FileText, MessageSquare, Truck, Check } from 'lucide-react';
import Link from 'next/link';
import FeaturedProducts from '@/components/FeaturedProducts';
import { useCart, useWishlist } from '@/hooks/useStore';

export default function ProductDetails() {
    const { id } = useParams();
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('details');

    const { data, isLoading } = useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            const res = await api.get(`/products/${id}`);
            return res.data.data;
        },
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
        <div className="section-padding bg-white">
            <div className="container max-w-7xl">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-10 overflow-x-auto whitespace-nowrap pb-2">
                    <Link href="/" className="hover:text-primary transition-colors font-medium">Home</Link>
                    <ChevronRight size={14} className="flex-shrink-0" />
                    <Link href="/products" className="hover:text-primary transition-colors font-medium">Products</Link>
                    <ChevronRight size={14} className="flex-shrink-0" />
                    <span className="text-primary font-bold truncate">{data.title}</span>
                </div>

                {/* Main Product Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-24">
                    {/* Left: Images */}
                    <div className="space-y-6">
                        <div className="bg-[#F8F9FA] rounded-[32px] p-12 aspect-square flex justify-center items-center group overflow-hidden border border-gray-100 shadow-sm">
                            <img
                                src={mainImage}
                                alt={data.title}
                                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 mix-blend-multiply"
                            />
                        </div>

                        {allImages.length > 1 && (
                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                                {allImages.map((img: string, idx: number) => (
                                    <div
                                        key={idx}
                                        onClick={() => setSelectedImage(img)}
                                        className={`aspect-square rounded-2xl overflow-hidden border-2 p-2 cursor-pointer transition-all bg-white ${mainImage === img ? 'border-primary shadow-lg scale-105' : 'border-gray-100 hover:border-primary/50'}`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-col h-full">
                        <div className="mb-6">
                            <span className="inline-block bg-[#E6F9F3] text-primary text-[10px] font-black px-4 py-1.5 rounded-full mb-6 uppercase tracking-[.15em]">
                                {data.category?.name}
                            </span>
                            <h1 className="text-3xl md:text-5xl font-black text-[#003B5C] mb-6 leading-[1.1]">{data.title}</h1>

                            <div className="flex items-center gap-6 mb-8">
                                <div className="flex items-center gap-1.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={18}
                                            fill={i < Math.floor(data.ratingsAverage) ? '#FFC107' : 'none'}
                                            color={i < Math.floor(data.ratingsAverage) ? '#FFC107' : '#D1D5DB'}
                                        />
                                    ))}
                                    <span className="ml-2 text-gray-400 font-bold">({data.ratingsAverage})</span>
                                </div>
                                <div className="w-px h-4 bg-gray-200" />
                                <span className="text-green-500 font-bold flex items-center gap-1.5 text-sm">
                                    <CheckCircle size={16} /> In Stock
                                </span>
                            </div>
                        </div>

                        <div className="mb-10 p-8 bg-[#F8F9FA] rounded-[32px] border border-gray-50">
                            <div className="flex items-baseline gap-3 mb-1">
                                <span className="text-5xl font-black text-primary">{data.price.toLocaleString()}</span>
                                <span className="text-lg font-bold text-gray-400 uppercase">EGP</span>
                            </div>
                            <p className="text-gray-400 text-sm font-medium">Free shipping on all orders over 1000 EGP</p>
                        </div>

                        <div className="space-y-6 mt-auto">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center bg-white border border-gray-200 rounded-2xl p-1.5 shadow-sm min-w-[140px]">
                                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-primary transition-colors">
                                        <Minus size={18} />
                                    </button>
                                    <span className="flex-1 text-center font-black text-xl text-secondary">{quantity}</span>
                                    <button onClick={() => setQuantity(q => Math.min(data.quantity, q + 1))} className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                                        <Plus size={18} />
                                    </button>
                                </div>
                                <button
                                    onClick={toggleWishlist}
                                    className={`w-14 h-14 border-2 rounded-2xl flex items-center justify-center transition-all ${isInWishlist(data._id) ? 'border-red-500 bg-red-50 text-red-500' : 'border-gray-100 hover:border-red-500 hover:text-red-500'}`}
                                >
                                    <Heart size={24} fill={isInWishlist(data._id) ? 'currentColor' : 'none'} />
                                </button>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button onClick={handleAddToCart} className="flex-1 btn-primary py-5 rounded-[20px] text-lg font-black flex items-center justify-center gap-3 shadow-xl shadow-primary/20">
                                    <ShoppingCart size={22} /> Add to Cart
                                </button>
                                <button onClick={handleBuyNow} className="flex-1 py-5 rounded-[20px] text-lg font-black flex items-center justify-center gap-3 bg-secondary text-white hover:bg-[#002B44] transition-all shadow-xl shadow-secondary/10">
                                    <Zap size={22} /> Buy Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Tabs Section (Requested Style) ── */}
                <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden mb-24">
                    {/* Tab Buttons */}
                    <div className="flex border-b border-gray-100 bg-[#F8F9FA]/50">
                        <button
                            onClick={() => setActiveTab('details')}
                            className={`flex items-center gap-2 px-8 py-5 text-sm font-bold transition-all relative ${activeTab === 'details' ? 'text-primary' : 'text-gray-500 hover:text-secondary'}`}
                        >
                            <FileText size={18} />
                            Product Details
                            {activeTab === 'details' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full" />}
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`flex items-center gap-2 px-8 py-5 text-sm font-bold transition-all relative ${activeTab === 'reviews' ? 'text-primary' : 'text-gray-500 hover:text-secondary'}`}
                        >
                            <Star size={18} />
                            Reviews ({reviews.length})
                            {activeTab === 'reviews' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full" />}
                        </button>
                        <button
                            onClick={() => setActiveTab('shipping')}
                            className={`flex items-center gap-2 px-8 py-5 text-sm font-bold transition-all relative ${activeTab === 'shipping' ? 'text-primary' : 'text-gray-500 hover:text-secondary'}`}
                        >
                            <Truck size={18} />
                            Shipping & Returns
                            {activeTab === 'shipping' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full" />}
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="p-10">
                        {activeTab === 'details' && (
                            <div className="space-y-12">
                                <div>
                                    <h3 className="text-xl font-black text-secondary mb-4">About this Product</h3>
                                    <p className="text-gray-500 leading-relaxed max-w-4xl">{data.description}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Product Information Box */}
                                    <div className="bg-[#F8F9FA] rounded-[24px] p-8 border border-gray-50">
                                        <h4 className="text-lg font-black text-secondary mb-6">Product Information</h4>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center text-sm font-medium">
                                                <span className="text-gray-400">Category</span>
                                                <span className="text-secondary font-bold text-right">{data.category?.name || 'Women\'s Fashion'}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm font-medium">
                                                <span className="text-gray-400">Subcategory</span>
                                                <span className="text-secondary font-bold text-right">{data.subcategory?.[0]?.name || 'Clothing'}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm font-medium">
                                                <span className="text-gray-400">Brand</span>
                                                <span className="text-secondary font-bold text-right">{data.brand?.name || 'Original'}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm font-medium">
                                                <span className="text-gray-400">Items Sold</span>
                                                <span className="text-secondary font-bold text-right">{data.sold || '23921'}+ sold</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Key Features Box */}
                                    <div className="bg-[#F8F9FA] rounded-[24px] p-8 border border-gray-50">
                                        <h4 className="text-lg font-black text-secondary mb-6">Key Features</h4>
                                        <div className="space-y-4">
                                            {[
                                                'Premium Quality Product',
                                                '100% Authentic Guarantee',
                                                'Fast & Secure Packaging',
                                                'Quality Tested'
                                            ].map((feature, i) => (
                                                <div key={i} className="flex items-center gap-3 text-sm font-bold text-secondary">
                                                    <div className="text-primary flex-shrink-0">
                                                        <Check size={18} strokeWidth={3} />
                                                    </div>
                                                    {feature}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="space-y-8">
                                {reviews.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {reviews.map((review: any) => (
                                            <div key={review._id} className="bg-white border border-gray-100 p-8 rounded-[24px] shadow-sm">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black uppercase">
                                                            {review.user?.name?.[0] || <User size={18} />}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-secondary text-sm">{review.user?.name || 'Anonymous'}</div>
                                                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{new Date(review.createdAt).toLocaleDateString()}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex text-yellow-400">
                                                        {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < review.rating ? 'currentColor' : 'none'} />)}
                                                    </div>
                                                </div>
                                                <p className="text-gray-500 text-sm leading-relaxed">{review.review}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 text-gray-400 font-bold text-lg">No reviews yet for this product.</div>
                                )}
                            </div>
                        )}

                        {activeTab === 'shipping' && (
                            <div className="space-y-6 max-w-3xl">
                                <h3 className="text-xl font-black text-secondary">Shipping Information</h3>
                                <p className="text-gray-500 leading-relaxed">We provide fast and reliable shipping to all regions. All orders are processed within 24 hours. Standard shipping takes 2-4 business days.</p>
                                <h3 className="text-xl font-black text-secondary pt-4">Return Policy</h3>
                                <p className="text-gray-500 leading-relaxed">If you are not satisfied with your purchase, you can return it within 14 days for a full refund or exchange. Items must be in their original condition and packaging.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                <div className="mt-10">
                    <FeaturedProducts
                        categoryId={data.category?._id}
                        title="Related Products"
                    />
                </div>
            </div>
        </div>
    );
}
