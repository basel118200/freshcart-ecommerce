'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { ShoppingCart, Heart, Star, Search } from 'lucide-react';
import Link from 'next/link';
import { useCart, useWishlist } from '@/hooks/useStore';

export default function ProductsList({ initialSearch }: { initialSearch: string }) {
    const { addToCart } = useCart();
    const { addToWishlist, isInWishlist } = useWishlist();

    const [search, setSearch] = useState(initialSearch);
    const [activeSearch, setActiveSearch] = useState(initialSearch);

    const { data, isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: async () => (await api.get('/products?limit=100')).data.data,
    });

    const filtered = data?.filter((p: any) =>
        p.title.toLowerCase().includes(activeSearch.toLowerCase()) ||
        p.category?.name?.toLowerCase().includes(activeSearch.toLowerCase()) ||
        p.brand?.name?.toLowerCase().includes(activeSearch.toLowerCase())
    ) ?? [];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setActiveSearch(search);
    };

    return (
        <>
            <form onSubmit={handleSearch} className="flex items-center gap-3 mb-8 max-w-lg">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => {
                            setSearch(e.target.value);
                            setActiveSearch(e.target.value);
                        }}
                        placeholder="Search by name, category, brand..."
                        className="w-full border border-gray-200 rounded-xl py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                </div>
                <button type="submit" className="btn-primary px-5 py-2.5 text-sm">Search</button>
            </form>

            {isLoading && <div className="loading-spinner">Loading Products...</div>}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filtered.map((product: any) => (
                    <div key={product._id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
                        <div className="relative aspect-square bg-gray-50 overflow-hidden">
                            <Link href={`/product/${product._id}`} className="w-full h-full p-6 block">
                                <img src={product.imageCover} alt={product.title} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" />
                            </Link>
                            <span className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase">{product.category?.name}</span>
                            <button
                                onClick={() => addToWishlist(product._id)}
                                className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-all duration-300 opacity-0 group-hover:opacity-100 ${isInWishlist(product._id) ? 'bg-red-50 text-red-500' : 'bg-white/80 hover:bg-red-50 hover:text-red-500'}`}
                            >
                                <Heart size={16} fill={isInWishlist(product._id) ? 'currentColor' : 'none'} />
                            </button>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-lg font-bold text-primary">{product.price} EGP</span>
                                <div className="flex items-center gap-1 text-sm font-semibold bg-yellow-50 text-yellow-600 px-2 py-0.5 rounded-lg">
                                    <Star size={12} fill="currentColor" /> {product.ratingsAverage}
                                </div>
                            </div>
                            <Link href={`/product/${product._id}`}>
                                <h3 className="font-semibold text-secondary mb-4 h-11 overflow-hidden line-clamp-2 text-sm hover:text-primary transition-colors">{product.title}</h3>
                            </Link>
                            <button onClick={() => addToCart(product._id)} className="w-full bg-secondary text-white py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 text-sm transition-all hover:bg-primary">
                                <ShoppingCart size={16} /> Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
