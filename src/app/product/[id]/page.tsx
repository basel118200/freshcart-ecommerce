'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { ShoppingCart, Heart, Star, CheckCircle, ChevronRight, Minus, Plus, Zap, User, FileText, MessageSquare, Truck, Check, Share2, Info } from 'lucide-react';
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start mb-24">
                    {/* Left: Images */}
                    <div className="space-y-6">
                        <div className="bg-[#F8F9FA] rounded-[40px] p-16 aspect-square flex justify-center items-center group overflow-hidden border border-gray-100 shadow-sm relative">
                            <img
                                src={mainImage}
                                alt={data.title}
                                className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-110 mix-blend-multiply"
                            />
                            <button className="absolute top-6 right-6 p-3 bg-white/80 backdrop-blur-md rounded-full text-secondary hover:text-primary transition-all border border-gray-100 shadow-sm hover:scale-110 active:scale-95">
                                <Share2 size={20} />
                            </button>
                        </div>

                        {allImages.length > 1 && (
                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
                                {allImages.map((img: string, idx: number) => (
                                    <div
                                        key={idx}
                                        onClick={() => setSelectedImage(img)}
                                        className={`aspect-square rounded-[20px] overflow-hidden border-2 p-3 cursor-pointer transition-all bg-white hover:shadow-lg ${mainImage === img ? 'border-primary shadow-xl -translate-y-1' : 'border-gray-50 hover:border-primary/30 shadow-sm'}`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Actions & Info */}
                    <div className="flex flex-col">
                        <div className="mb-8">
                            <div className="flex items-center gap-4 mb-6">
                                <span className="inline-block bg-[#E6F9F3] text-[#2DB224] text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[.15em] border border-[#2DB224]/10">
                                    {data.category?.name}
                                </span>
                                {data.brand?.name && (
                                    <span className="inline-block bg-[#F8F9FA] text-secondary text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[.15em] border border-gray-100">
                                        {data.brand.name}
                                    </span>
                                )}
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black text-[#003B5C] mb-8 leading-[1.05] tracking-tight">{data.title}</h1>

                            <div className="flex flex-wrap items-center gap-6 mb-8 p-4 bg-white rounded-2xl border border-gray-50 shadow-sm">
                                <div className="flex items-center gap-1.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={20}
                                            fill={i < Math.floor(data.ratingsAverage) ? '#FFC107' : 'none'}
                                            color={i < Math.floor(data.ratingsAverage) ? '#FFC107' : '#D1D5DB'}
                                        />
                                    ))}
                                    <span className="ml-2 text-secondary font-black text-lg">{data.ratingsAverage}</span>
                                    <span className="text-gray-400 font-bold text-sm">/ 5.0</span>
                                </div>
                                <div className="w-px h-6 bg-gray-100 hidden sm:block" />
                                <span className="text-[#2DB224] font-black flex items-center gap-1.5 text-sm">
                                    <CheckCircle size={18} /> In Stock ({data.quantity} units)
                                </span>
                            </div>
                        </div>

                        {/* Highlight Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-10">
                            {[
                                { icon: <Info size={16} />, label: 'Fast Delivery', val: '2-4 Days' },
                                { icon: <Truck size={16} />, label: 'Shipping', val: 'Free over 1000' },
                            ].map((h, i) => (
                                <div key={i} className="flex flex-col gap-1 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-primary/20 transition-colors">
                                    <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest leading-none">
                                        {h.icon} {h.label}
                                    </div>
                                    <span className="text-secondary font-black text-xs">{h.val}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mb-10 p-10 bg-[#003B5C] rounded-[32px] shadow-2xl shadow-secondary/20 relative overflow-hidden group">
                            {/* Decorative circles */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
                            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-primary/20 rounded-full blur-xl" />

                            <div className="relative z-10 flex items-baseline gap-3 mb-2">
                                <span className="text-6xl font-black text-white">{data.price.toLocaleString()}</span>
                                <span className="text-xl font-bold text-white/50 uppercase">EGP</span>
                            </div>
                            <p className="relative z-10 text-white/40 text-sm font-bold tracking-tight uppercase">Limited Time Price • Secure Transaction</p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center bg-white border border-gray-200 rounded-[20px] p-2 shadow-sm min-w-[160px]">
                                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-primary transition-all hover:scale-110 active:scale-90">
                                        <Minus size={20} />
                                    </button>
                                    <span className="flex-1 text-center font-black text-2xl text-secondary">{quantity}</span>
                                    <button onClick={() => setQuantity(q => Math.min(data.quantity, q + 1))} className="w-12 h-12 bg-[#2DB224] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#2DB224]/20 hover:rotate-90 hover:scale-105 active:scale-95 transition-all">
                                        <Plus size={20} strokeWidth={3} />
                                    </button>
                                </div>
                                <button
                                    onClick={toggleWishlist}
                                    className={`w-16 h-16 border-2 rounded-[24px] flex items-center justify-center transition-all duration-300 ${isInWishlist(data._id) ? 'border-red-500 bg-red-50 text-red-500 shadow-xl shadow-red-500/10 scale-105' : 'border-gray-50 bg-gray-50/50 text-gray-400 hover:border-red-500/30 hover:text-red-500'}`}
                                >
                                    <Heart size={28} fill={isInWishlist(data._id) ? 'currentColor' : 'none'} />
                                </button>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-5">
                                <button onClick={handleAddToCart} className="flex-[1.5] bg-[#003B5C] text-white py-6 rounded-[24px] text-xl font-black flex items-center justify-center gap-3 shadow-2xl shadow-secondary/10 hover:bg-primary transition-all hover:-translate-y-1 active:translate-y-0">
                                    <ShoppingCart size={24} /> Add to Cart
                                </button>
                                <button onClick={handleBuyNow} className="flex-1 py-6 rounded-[24px] text-xl font-black flex items-center justify-center gap-3 bg-[#E6F9F3] text-[#2DB224] border border-[#2DB224]/20 hover:bg-[#2DB224] hover:text-white transition-all shadow-xl shadow-[#2DB224]/5 hover:-translate-y-1 active:translate-y-0">
                                    <Zap size={24} /> Buy Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Tabs Section (Enhanced Style from Screenshot) ── */}
                <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden mb-24 min-h-[500px]">
                    {/* Tab Navigation */}
                    <div className="flex border-b border-gray-50 bg-white">
                        <button
                            onClick={() => setActiveTab('details')}
                            className={`flex items-center gap-3 px-10 py-6 text-sm font-black transition-all relative ${activeTab === 'details' ? 'text-secondary' : 'text-gray-400 hover:text-secondary'}`}
                        >
                            <FileText size={18} />
                            Product Details
                            {activeTab === 'details' && <div className="absolute bottom-0 left-0 w-full h-[4px] bg-[#2DB224] rounded-t-full shadow-[0_-4px_10px_rgba(45,178,36,0.5)]" />}
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`flex items-center gap-3 px-10 py-6 text-sm font-black transition-all relative ${activeTab === 'reviews' ? 'text-secondary' : 'text-gray-400 hover:text-secondary'}`}
                        >
                            <Star size={18} fill={activeTab === 'reviews' ? "#2DB224" : "none"} color={activeTab === 'reviews' ? "#2DB224" : "currentColor"} />
                            Reviews ({reviews.length})
                            {activeTab === 'reviews' && <div className="absolute bottom-0 left-0 w-full h-[4px] bg-[#2DB224] rounded-t-full shadow-[0_-4px_10px_rgba(45,178,36,0.5)]" />}
                        </button>
                        <button
                            onClick={() => setActiveTab('shipping')}
                            className={`flex items-center gap-3 px-10 py-6 text-sm font-black transition-all relative ${activeTab === 'shipping' ? 'text-secondary' : 'text-gray-400 hover:text-secondary'}`}
                        >
                            <Truck size={18} />
                            Shipping & Returns
                            {activeTab === 'shipping' && <div className="absolute bottom-0 left-0 w-full h-[4px] bg-[#2DB224] rounded-t-full shadow-[0_-4px_10px_rgba(45,178,36,0.5)]" />}
                        </button>
                    </div>

                    {/* Tab Content Panels */}
                    <div className="p-12 md:p-16">
                        {activeTab === 'details' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h3 className="text-2xl font-black text-secondary mb-8">About this Product</h3>
                                <p className="text-[#5F6368] text-lg leading-[1.8] max-w-4xl mb-12 font-medium">{data.description}</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="bg-[#F8F9FA] rounded-[32px] p-10 border border-gray-100/50">
                                        <h4 className="text-lg font-black text-secondary mb-8 uppercase tracking-widest flex items-center gap-3">
                                            <div className="w-2 h-6 bg-[#2DB224] rounded-full" />
                                            Product Information
                                        </h4>
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center group">
                                                <span className="text-gray-400 font-bold text-sm group-hover:text-primary transition-colors">Category</span>
                                                <span className="text-secondary font-black text-sm">{data.category?.name || 'Women\'s Fashion'}</span>
                                            </div>
                                            <div className="flex justify-between items-center group">
                                                <span className="text-gray-400 font-bold text-sm group-hover:text-primary transition-colors">Subcategory</span>
                                                <span className="text-secondary font-black text-sm">{data.subcategory?.[0]?.name || 'Clothing'}</span>
                                            </div>
                                            <div className="flex justify-between items-center group">
                                                <span className="text-gray-400 font-bold text-sm group-hover:text-primary transition-colors">Brand</span>
                                                <span className="text-secondary font-black text-sm">{data.brand?.name || 'Original'}</span>
                                            </div>
                                            <div className="flex justify-between items-center group">
                                                <span className="text-gray-400 font-bold text-sm group-hover:text-primary transition-colors">Items Sold</span>
                                                <span className="text-secondary font-black text-sm flex items-center gap-1.5">
                                                    <span className="w-2 h-2 rounded-full bg-[#2DB224] animate-pulse" />
                                                    {data.sold || '23,921'}+ sold
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-[#F8F9FA] rounded-[32px] p-10 border border-gray-100/50">
                                        <h4 className="text-lg font-black text-secondary mb-8 uppercase tracking-widest flex items-center gap-3">
                                            <div className="w-2 h-6 bg-[#2DB224] rounded-full" />
                                            Key Features
                                        </h4>
                                        <div className="grid grid-cols-1 gap-5">
                                            {[
                                                'Premium Quality Product',
                                                '100% Authentic Guarantee',
                                                'Fast & Secure Packaging',
                                                'Quality Tested & Certified'
                                            ].map((feature, i) => (
                                                <div key={i} className="flex items-center gap-4 text-sm font-black text-secondary bg-white p-4 rounded-2xl border border-gray-50 shadow-sm transition-transform hover:scale-[1.02]">
                                                    <div className="w-8 h-8 rounded-full bg-[#E6F9F3] text-[#2DB224] flex items-center justify-center flex-shrink-0">
                                                        <Check size={16} strokeWidth={4} />
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
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Rating Distribution Section (Exact Screenshot Style) */}
                                <div className="grid grid-cols-1 md:grid-cols-[180px_1fr_40px] gap-8 items-center mb-16 pb-12 border-b border-gray-50">
                                    <div className="text-center md:text-left flex flex-col items-center md:items-start">
                                        <div className="text-[72px] font-black leading-none text-secondary tracking-tighter mb-2">{data.ratingsAverage || '4.3'}</div>
                                        <div className="flex gap-1 mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={16} fill={i < 4 ? "#FFC107" : "none"} color={i < 4 ? "#FFC107" : "#D1D5DB"} />
                                            ))}
                                        </div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Based on {reviews.length || 4} reviews</p>
                                    </div>

                                    <div className="space-y-4 max-w-2xl">
                                        {[5, 4, 3, 2, 1].map((star, idx) => {
                                            const pcts = [25, 60, 25, 5, 5]; // Mock percentages to match UI
                                            return (
                                                <div key={star} className="flex items-center gap-6 group">
                                                    <span className="text-[11px] font-black text-gray-400 w-10 uppercase">{star} star</span>
                                                    <div className="flex-1 h-2 bg-[#F1F3F4] rounded-full overflow-hidden relative">
                                                        <div
                                                            className="absolute left-0 top-0 h-full bg-[#FFC107] rounded-full transition-all duration-1000 group-hover:brightness-110"
                                                            style={{ width: `${pcts[idx]}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-[11px] font-black text-gray-400 w-10 text-right">{pcts[idx]}%</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Custom Empty State / Footer Section */}
                                <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                                        <Star size={40} fill="currentColor" />
                                    </div>
                                    <p className="text-gray-400 font-bold text-lg">Customer reviews will be displayed here.</p>
                                    <button className="text-[#2DB224] font-black text-lg hover:underline transition-all">Write a Review</button>
                                </div>

                                {/* Real reviews if they exist (hidden in empty state screenshot but kept for logic) */}
                                {reviews.length > 0 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                                        {reviews.map((review: any) => (
                                            <div key={review._id} className="bg-white border border-gray-100 p-8 rounded-[32px] shadow-sm hover:shadow-lg transition-all border-l-4 border-l-[#2DB224]">
                                                <div className="flex items-center justify-between mb-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-[#003B5C] text-white flex items-center justify-center text-lg font-black uppercase">
                                                            {review.user?.name?.[0] || <User size={20} />}
                                                        </div>
                                                        <div>
                                                            <div className="font-extrabold text-secondary">{review.user?.name || 'Anonymous User'}</div>
                                                            <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none mt-1">Verified Buyer</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex text-[#FFC107] bg-[#FFC107]/5 p-2 rounded-xl">
                                                        {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < review.rating ? 'currentColor' : 'none'} />)}
                                                    </div>
                                                </div>
                                                <p className="text-[#5F6368] text-sm leading-relaxed font-medium">"{review.review}"</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'shipping' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl space-y-12">
                                <div className="flex gap-8 group">
                                    <div className="w-16 h-16 bg-[#F8F9FA] rounded-[24px] flex items-center justify-center text-[#2DB224] flex-shrink-0 group-hover:bg-[#2DB224] group-hover:text-white transition-all duration-500 shadow-sm">
                                        <Truck size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-secondary mb-3">Global Fast Shipping</h3>
                                        <p className="text-[#5F6368] text-lg font-medium leading-relaxed">We provide fast and reliable shipping to all regions. All orders are processed within 24 hours. Standard shipping takes 2-4 business days.</p>
                                    </div>
                                </div>
                                <div className="flex gap-8 group">
                                    <div className="w-16 h-16 bg-[#F8F9FA] rounded-[24px] flex items-center justify-center text-[#2DB224] flex-shrink-0 group-hover:bg-[#2DB224] group-hover:text-white transition-all duration-500 shadow-sm">
                                        <Truck size={28} className="rotate-180" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-secondary mb-3">Easy Return Policy</h3>
                                        <p className="text-[#5F6368] text-lg font-medium leading-relaxed">If you are not satisfied with your purchase, you can return it within 14 days for a full refund or exchange. Items must be in their original condition and packaging.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                <div className="mt-10">
                    <FeaturedProducts
                        categoryId={data.category?._id}
                        title="You May Also Like"
                    />
                </div>
            </div>
        </div>
    );
}
