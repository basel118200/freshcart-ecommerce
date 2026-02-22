'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';

export default function BrandsGrid() {
    const { data: brands, isLoading } = useQuery({
        queryKey: ['brands'],
        queryFn: async () => (await api.get('/brands')).data.data,
    });

    if (isLoading) return null;

    return (
        <section className="py-16 bg-gray-50/50">
            <div className="container">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-secondary mb-3">Shop by Brands</h2>
                    <p className="text-gray-500 max-w-lg mx-auto text-sm">
                        Find products from your favorite global and local brands at the best prices.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {brands?.slice(0, 12).map((brand: any) => (
                        <Link
                            key={brand._id}
                            href={`/brands/${brand._id}`}
                            className="bg-white border border-gray-100 rounded-2xl p-6 flex items-center justify-center grayscale hover:grayscale-0 hover:border-primary transition-all duration-500 hover:shadow-xl hover:-translate-y-1 group"
                        >
                            <img
                                src={brand.image}
                                alt={brand.name}
                                className="max-h-16 w-full object-contain transition-transform duration-500 group-hover:scale-110"
                            />
                        </Link>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link href="/brands" className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
                        View All Brands <span className="text-xl">→</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
