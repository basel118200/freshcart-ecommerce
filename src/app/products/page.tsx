import { Suspense } from 'react';
import ProductsList from './ProductsList';

// This is a Server Component - it receives the search query directly from Next.js
// This PREVENTS the Vercel Prerender error 100%
export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ search?: string }>;
}) {
    const params = await searchParams;
    const initialSearch = params.search || '';

    return (
        <div className="section-padding">
            <div className="container">
                <h1 className="section-title">All Products</h1>
                <Suspense fallback={<div className="loading-spinner">Loading Products...</div>}>
                    <ProductsList initialSearch={initialSearch} />
                </Suspense>
            </div>
        </div>
    );
}
