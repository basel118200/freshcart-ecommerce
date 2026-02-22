'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import FeaturedProducts from '@/components/FeaturedProducts';

export default function CategoryDetails() {
    const { id } = useParams();
    const { data: category } = useQuery({
        queryKey: ['category', id],
        queryFn: async () => (await api.get(`/categories/${id}`)).data.data,
    });

    return (
        <div className="section-padding min-h-screen">
            <div className="container mb-10 text-center">
                <h1 className="text-3xl font-bold text-secondary mb-2">
                    {category?.name} <span className="text-primary">Collection</span>
                </h1>
            </div>
            <FeaturedProducts categoryId={id as string} title={`${category?.name || ''} Products`} />
        </div>
    );
}
