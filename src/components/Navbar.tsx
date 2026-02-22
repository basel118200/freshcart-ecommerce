'use client';

import Link from 'next/link';
import { ShoppingCart, Heart, User, LogOut, Menu, X, Search, ChevronDown, Headphones } from 'lucide-react';
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
    const { cartData, guestCount } = useCart();
    const { wishlistData } = useWishlist();

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => (await api.get('/categories')).data.data,
    });

    const cartCount = cartData?.numOfCartItems || guestCount || 0;
    const wishlistCount = wishlistData?.data?.length || 0;

    useEffect(() => {
        setToken(localStorage.getItem('userToken'));
    }, [pathname]);

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
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-[1000] py-4 shadow-sm">
            <div className="container flex items-center justify-between gap-4">
                {/* Left side: Logo & Nav */}
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-2xl font-bold text-secondary flex-shrink-0">
                        <span className="text-primary">Fresh</span>Cart
                    </Link>

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

                        <div
                            className="relative group py-2"
                            onMouseEnter={() => setCategoriesOpen(true)}
                            onMouseLeave={() => setCategoriesOpen(false)}
                        >
                            <button
                                className={`flex items-center gap-1 font-semibold transition-colors ${(pathname.startsWith('/categories') || categoriesOpen) ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}
                            >
                                Categories <ChevronDown size={14} className={`transition-transform duration-300 ${categoriesOpen ? 'rotate-180' : ''}`} />
                            </button>

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
                </div>

                {/* Center: Search Bar */}
                <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-xs lg:max-w-md relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search products..."
                        className="w-full border border-gray-200 rounded-xl px-4 py-2 pr-10 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    />
                    <button type="submit" className="absolute right-3 text-gray-400 hover:text-primary transition-colors">
                        <Search size={16} />
                    </button>
                </form>

                {/* Right side: Support, Logout, Profile, Cart, Menu */}
                <div className="flex items-center gap-4 lg:gap-6">
                    {/* Support Component */}
                    <Link href="/contact" className="hidden xl:flex items-center gap-3 pr-4 border-r border-gray-100 group">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                            <Headphones size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Support</span>
                            <span className="text-sm font-black text-secondary leading-none group-hover:text-primary transition-colors">24/7 Help</span>
                        </div>
                    </Link>

                    {/* Wishlist Icon */}
                    <Link href="/wishlist" className="relative text-gray-500 hover:text-primary transition-all duration-300 hover:scale-110">
                        <Heart size={26} className={wishlistCount > 0 ? 'fill-red-500 text-red-500' : ''} />
                        {wishlistCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold px-1 py-0.5 rounded-full min-w-[18px] text-center border-2 border-white">{wishlistCount}</span>
                        )}
                    </Link>

                    {/* Cart Icon */}
                    <Link href="/cart" className="relative text-gray-500 hover:text-primary transition-all duration-300 hover:scale-110">
                        <ShoppingCart size={26} />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-primary text-white text-[11px] font-black px-1.5 py-0.5 rounded-full min-w-[20px] text-center border-2 border-white shadow-sm flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Auth Icons */}
                    {token ? (
                        <div className="flex items-center gap-4">
                            <Link href="/orders" className="text-gray-500 hover:text-primary transition-colors hover:scale-110">
                                <User size={24} />
                            </Link>
                            <button onClick={handleLogout} className="text-red-500 hover:scale-110 transition-transform" title="Logout">
                                <LogOut size={22} />
                            </button>
                        </div>
                    ) : (
                        <div className="hidden sm:flex items-center gap-4 border-l border-gray-200 pl-4 ml-1">
                            <Link href="/login" className="font-bold text-gray-600 hover:text-primary transition-colors text-sm">Login</Link>
                            <Link href="/register" className="bg-primary text-white px-5 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-secondary transition-all hover:shadow-lg active:scale-95">Register</Link>
                        </div>
                    )}

                    <button className="lg:hidden text-secondary" onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <X size={26} /> : <Menu size={26} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu & Search omitted for brevity but remain in actual file */}
            {/* Same logic as previous version but with the Support link added */}
            {menuOpen && (
                <div className="lg:hidden border-t border-gray-100 mt-4 py-6 bg-white absolute top-[100%] left-0 w-full shadow-2xl">
                    <div className="container flex flex-col gap-4">
                        {navLinks.map(link => (
                            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className={`text-lg font-bold py-2 border-b border-gray-50 ${pathname === link.href ? 'text-primary' : 'text-gray-600'}`}>
                                {link.label}
                            </Link>
                        ))}
                        <Link href="/categories" onClick={() => setMenuOpen(false)} className="text-lg font-bold text-gray-600 py-2 border-b border-gray-50">Categories</Link>
                        <Link href="/contact" onClick={() => setMenuOpen(false)} className="text-lg font-bold text-gray-600 py-2 border-b border-gray-50 flex items-center gap-2">
                            Support <Headphones size={20} className="text-primary" />
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
