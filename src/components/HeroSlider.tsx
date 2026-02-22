'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
    {
        id: 1,
        title: 'Fresh Products Delivered to your Door',
        subtitle: 'Get 20% off your first order',
        btn1: { label: 'Shop Now', href: '/products' },
        btn2: { label: 'View Deals', href: '/products' },
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        overlay: 'from-primary/80 via-primary/50 to-transparent',
    },
    {
        id: 2,
        title: 'Premium Quality Guaranteed',
        subtitle: 'Fresh from farm to your table',
        btn1: { label: 'Shop Now', href: '/products' },
        btn2: { label: 'Learn More', href: '/categories' },
        image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        overlay: 'from-primary/80 via-primary/50 to-transparent',
    },
    {
        id: 3,
        title: 'Fast & Free Delivery',
        subtitle: 'Same day delivery available',
        btn1: { label: 'Order Now', href: '/products' },
        btn2: { label: 'Delivery Info', href: '/contact' },
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        overlay: 'from-primary/80 via-primary/50 to-transparent',
    },
];

export default function HeroSlider() {
    const [current, setCurrent] = useState(0);
    const [animating, setAnimating] = useState(false);

    const goTo = useCallback((index: number) => {
        if (animating) return;
        setAnimating(true);
        setCurrent(index);
        setTimeout(() => setAnimating(false), 500);
    }, [animating]);

    const prev = () => goTo((current - 1 + slides.length) % slides.length);
    const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo]);

    // Auto-advance every 4 seconds
    useEffect(() => {
        const timer = setInterval(next, 4000);
        return () => clearInterval(timer);
    }, [next]);

    const slide = slides[current];

    return (
        <div className="relative h-[55vh] min-h-[320px] overflow-hidden">
            {/* Slides */}
            {slides.map((s, i) => (
                <div
                    key={s.id}
                    className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                    <img
                        src={s.image}
                        alt={s.title}
                        className="w-full h-full object-cover"
                    />
                    {/* Green overlay matching reference */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${s.overlay}`} />
                </div>
            ))}

            {/* Content */}
            <div className="relative z-20 h-full container flex items-center">
                <div className={`max-w-lg text-white transition-all duration-500 ${animating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
                    <h1 className="text-3xl md:text-5xl font-extrabold mb-3 leading-tight drop-shadow-md">
                        {slide.title}
                    </h1>
                    <p className="text-base md:text-lg mb-7 opacity-90 font-light drop-shadow">
                        {slide.subtitle}
                    </p>
                    <div className="flex gap-3 flex-wrap">
                        <Link
                            href={slide.btn1.href}
                            className="bg-white text-primary font-bold px-6 py-2.5 rounded-lg hover:bg-gray-100 transition-all text-sm"
                        >
                            {slide.btn1.label}
                        </Link>
                        <Link
                            href={slide.btn2.href}
                            className="border-2 border-white text-white font-bold px-6 py-2.5 rounded-lg hover:bg-white hover:text-primary transition-all text-sm"
                        >
                            {slide.btn2.label}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Prev / Next Arrows */}
            <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm border border-white/30 text-white rounded-full flex items-center justify-center transition-all"
            >
                <ChevronLeft size={20} />
            </button>
            <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm border border-white/30 text-white rounded-full flex items-center justify-center transition-all"
            >
                <ChevronRight size={20} />
            </button>

            {/* Dot Indicators */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        className={`rounded-full transition-all duration-300 ${i === current
                            ? 'bg-white w-6 h-2.5'
                            : 'bg-white/50 w-2.5 h-2.5 hover:bg-white/80'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
