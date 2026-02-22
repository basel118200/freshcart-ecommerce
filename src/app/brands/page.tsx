'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';

export default function Brands() {
    const { data, isLoading } = useQuery({
        queryKey: ['brands'],
        queryFn: async () => (await api.get('/brands')).data.data,
    });

    if (isLoading) return <div className="loading-spinner">Loading Brands...</div>;

    return (
        <div className="section-padding">
            <div className="container">
                <h1 className="section-title">Our Brands</h1>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {data?.map((brand: any) => (
                        <Link href={`/brands/${brand._id}`} key={brand._id} className="bg-white group rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-primary/20 transition-all duration-300 flex flex-col items-center">
                            <div className="aspect-[3/2] w-full mb-4">
                                <img src={brand.image} alt={brand.name} className="h-full w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500" />
                            </div>
                            <h3 className="text-sm font-bold text-gray-400 group-hover:text-primary transition-colors uppercase tracking-wider">{brand.name}</h3>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
