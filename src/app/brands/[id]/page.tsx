'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import FeaturedProducts from '@/components/FeaturedProducts';

export default function BrandDetails() {
    const { id } = useParams();
    const { data: brand } = useQuery({
        queryKey: ['brand', id],
        queryFn: async () => (await api.get(`/brands/${id}`)).data.data,
    });

    return (
        <div className="section-padding min-h-screen">
            <div className="container mb-10 text-center">
                <h1 className="text-3xl font-bold text-secondary mb-2">
                    {brand?.name} <span className="text-primary">Products</span>
                </h1>
            </div>
            <FeaturedProducts brandId={id as string} title={`${brand?.name || ''} Products`} />
        </div>
    );
}
