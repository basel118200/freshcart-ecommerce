'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// This is the magic part: It tells Next.js to load the products only in the browser
const ProductsContent = dynamic(() => import('./ProductsContent'), {
    ssr: false,
    fallback: <div className="loading-spinner">Initializing products...</div>
});

export default function ProductsPage() {
    return (
        <div className="section-padding">
            <div className="container">
                <h1 className="section-title">All Products</h1>
                <Suspense fallback={<div className="loading-spinner">Loading search...</div>}>
                    <ProductsContent />
                </Suspense>
            </div>
        </div>
    );
}
