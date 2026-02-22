'use client';

import Link from 'next/link';
import { ShoppingCart, Heart, User, LogOut, Menu, X, Search, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useCart, useWishlist } from '@/hooks/useStore';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export default function Navbar() {
    const [token, setToken] = useState<string | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [categoriesOpen, setCategoriesOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchOpen, setSearchOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const { cartData } = useCart();
    const { wishlistData } = useWishlist();

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => (await api.get('/categories')).data.data,
    });

    const cartCount = cartData?.numOfCartItems || 0;
    const wishlistCount = wishlistData?.data?.length || 0;

    useEffect(() => {
        setToken(localStorage.getItem('userToken'));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        setToken(null);
        router.push('/login');
    };

    const handleSearch = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchOpen(false);
        }
    };

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/products', label: 'Products' },
        { href: '/brands', label: 'Brands' },
    ];

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-[1000] py-3">
            <div className="container flex items-center justify-between gap-4">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold text-secondary flex-shrink-0">
                    <span className="text-primary">Fresh</span>Cart
                </Link>

                {/* Nav Links (desktop) */}
                <div className="hidden lg:flex items-center gap-6">
                    {navLinks.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`font-semibold transition-colors ${pathname === link.href ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}
                        >
                            {link.label}
                        </Link>
                    ))}

                    {/* Categories Dropdown */}
                    <div
                        className="relative group py-2"
                        onMouseEnter={() => setCategoriesOpen(true)}
                        onMouseLeave={() => setCategoriesOpen(false)}
                    >
                        <button
                            className={`flex items-center gap-1 font-semibold transition-colors ${pathname.startsWith('/categories') ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}
                        >
                            Categories <ChevronDown size={14} className={`transition-transform duration-300 ${categoriesOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        <div className={`absolute left-0 top-[100%] w-60 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 transition-all duration-300 transform origin-top ${categoriesOpen ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-2 invisible'}`}>
                            <Link
                                href="/categories"
                                className="block px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                                onClick={() => setCategoriesOpen(false)}
                            >
                                All Categories
                            </Link>
                            <div className="h-px bg-gray-100 mx-5 my-1" />
                            {categories?.slice(0, 8).map((cat: any) => (
                                <Link
                                    key={cat._id}
                                    href={`/categories/${cat._id}`}
                                    className="block px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors"
                                    onClick={() => setCategoriesOpen(false)}
                                >
                                    {cat.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Search Bar (desktop) */}
                <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-sm relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search products..."
                        className="w-full border border-gray-200 rounded-xl px-4 py-2 pr-10 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                    <button type="submit" className="absolute right-3 text-gray-400 hover:text-primary transition-colors">
                        <Search size={16} />
                    </button>
                </form>

                {/* Right Icons */}
                <div className="flex items-center gap-4">
                    {/* Mobile search toggle */}
                    <button className="md:hidden text-secondary hover:text-primary transition-colors" onClick={() => setSearchOpen(!searchOpen)}>
                        <Search size={22} />
                    </button>

                    {token && (
                        <>
                            <Link href="/wishlist" className="relative text-secondary hover:text-primary transition-colors">
                                <Heart size={22} />
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">{wishlistCount}</span>
                                )}
                            </Link>
                            <Link href="/cart" className="relative text-secondary hover:text-primary transition-colors">
                                <ShoppingCart size={22} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">{cartCount}</span>
                                )}
                            </Link>
                            <Link href="/orders" className="text-secondary hover:text-primary transition-colors">
                                <User size={22} />
                            </Link>
                            <button onClick={handleLogout} className="text-red-500 hover:scale-110 transition-transform" title="Logout">
                                <LogOut size={22} />
                            </button>
                        </>
                    )}
                    {!token && (
                        <div className="flex items-center gap-3">
                            <Link href="/login" className="font-semibold text-gray-600 hover:text-primary transition-colors">Login</Link>
                            <Link href="/register" className="btn-primary">Register</Link>
                        </div>
                    )}
                    <button className="lg:hidden text-secondary" onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Search Bar */}
            {searchOpen && (
                <div className="md:hidden border-t border-gray-100 px-4 py-3">
                    <form onSubmit={handleSearch} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search products..."
                            autoFocus
                            className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                        <button type="submit" className="btn-primary px-4 py-2 text-sm flex items-center gap-1">
                            <Search size={15} /> Search
                        </button>
                    </form>
                </div>
            )}

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="lg:hidden border-t border-gray-100 mt-3 py-4">
                    <div className="container flex flex-col gap-3">
                        {navLinks.map(link => (
                            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="font-medium text-gray-600 hover:text-primary py-2 transition-colors">
                                {link.label}
                            </Link>
                        ))}
                        {/* Mobile Categories - simplified */}
                        <Link href="/categories" onClick={() => setMenuOpen(false)} className="font-medium text-gray-600 hover:text-primary py-2 transition-colors">
                            Categories
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
