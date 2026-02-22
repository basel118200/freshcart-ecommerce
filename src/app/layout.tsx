'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 60 * 1000, retry: 1 } },
  }));

  return (
    <html lang="en">
      <head>
        <title>FreshCart - E-Commerce</title>
        <meta name="description" content="Shop the latest fresh products at FreshCart." />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <Navbar />
          <main className="min-h-[80vh]">{children}</main>
          <Footer />
          <Toaster position="top-center" reverseOrder={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}
