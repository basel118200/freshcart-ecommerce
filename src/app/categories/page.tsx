'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';

export default function Categories() {
    const { data, isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => (await api.get('/categories')).data.data,
    });

    if (isLoading) return <div className="loading-spinner">Loading Categories...</div>;

    return (
        <div className="section-padding">
            <div className="container">
                <h1 className="section-title">Shop By Category</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {data?.map((cat: any) => (
                        <Link href={`/categories/${cat._id}`} key={cat._id} className="bg-white group rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                            <div className="aspect-square overflow-hidden bg-gray-50 p-4">
                                <img src={cat.image} alt={cat.name} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" />
                            </div>
                            <div className="p-6 text-center">
                                <h3 className="text-xl font-bold text-secondary group-hover:text-primary transition-colors">{cat.name}</h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
