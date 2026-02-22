'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';
import FeaturedProducts from '@/components/FeaturedProducts';
import BrandsGrid from '@/components/BrandsGrid';
import Newsletter from '@/components/Newsletter';
import HeroSlider from '@/components/HeroSlider';
import FeatureBadges from '@/components/FeatureBadges';

export default function Home() {
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await api.get('/categories')).data.data,
  });

  return (
    <div>
      {/* Hero Slider */}
      <HeroSlider />

      {/* Feature Badges */}
      <FeatureBadges />

      {/* Categories Grid */}
      <section className="section-padding bg-white">
        <div className="container">
          <h2 className="section-title">Shop by Categories</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-10 justify-items-center">
            {categories?.map((cat: any) => (
              <Link
                href={`/categories/${cat._id}`}
                key={cat._id}
                className="flex flex-col items-center text-center group w-full"
              >
                {/* Circle image */}
                <div className="relative w-[120px] h-[120px] mb-4">
                  {/* Outer ring on hover */}
                  <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-primary transition-all duration-300 group-hover:scale-110 z-10" />
                  <div className="w-full h-full rounded-full overflow-hidden shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-1">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </div>
                {/* Name */}
                <h3 className="font-semibold text-sm text-secondary group-hover:text-primary transition-colors leading-tight">
                  {cat.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FeaturedProducts />
      <BrandsGrid />
      <Newsletter />
    </div>
  );
}
