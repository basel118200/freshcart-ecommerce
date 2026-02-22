import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-secondary text-gray-300 pt-16 pb-6 mt-16">
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">

                    {/* Brand Column */}
                    <div className="lg:col-span-1 space-y-5">
                        <Link href="/" className="inline-flex items-center gap-2">
                            <span className="text-2xl font-extrabold text-white">
                                <span className="text-primary">Fresh</span>Cart
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            FreshCart is your one-stop destination for quality products. From fashion to electronics, we bring you the best brands at competitive prices with a seamless shopping experience.
                        </p>
                        <ul className="space-y-2.5 text-sm">
                            <li>
                                <a href="tel:+18001234567" className="flex items-center gap-2.5 text-gray-400 hover:text-primary transition-colors">
                                    <Phone size={15} className="text-primary flex-shrink-0" /> +1 (800) 123-4567
                                </a>
                            </li>
                            <li>
                                <a href="mailto:support@freshcart.com" className="flex items-center gap-2.5 text-gray-400 hover:text-primary transition-colors">
                                    <Mail size={15} className="text-primary flex-shrink-0" /> support@freshcart.com
                                </a>
                            </li>
                            <li className="flex items-start gap-2.5 text-gray-400">
                                <MapPin size={15} className="text-primary flex-shrink-0 mt-0.5" />
                                <span>123 Commerce Street, New York, NY 10001</span>
                            </li>
                        </ul>
                        {/* Social Icons */}
                        <div className="flex gap-3 pt-1">
                            {[
                                { Icon: Facebook, href: '#' },
                                { Icon: Twitter, href: '#' },
                                { Icon: Instagram, href: '#' },
                                { Icon: Youtube, href: '#' },
                            ].map(({ Icon, href }, i) => (
                                <a key={i} href={href} className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all">
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Shop Column */}
                    <div>
                        <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-widest">Shop</h3>
                        <ul className="space-y-3">
                            {[
                                { label: 'All Products', href: '/products' },
                                { label: 'Categories', href: '/categories' },
                                { label: 'Brands', href: '/brands' },
                                { label: 'Electronics', href: '/products?category=electronics' },
                                { label: "Men's Fashion", href: '/products?category=mens' },
                                { label: "Women's Fashion", href: '/products?category=womens' },
                            ].map(({ label, href }) => (
                                <li key={label}>
                                    <Link href={href} className="text-gray-400 hover:text-primary transition-colors text-sm">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Account Column */}
                    <div>
                        <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-widest">Account</h3>
                        <ul className="space-y-3">
                            {[
                                { label: 'My Account', href: '/profile' },
                                { label: 'Order History', href: '/orders' },
                                { label: 'Wishlist', href: '/wishlist' },
                                { label: 'Shopping Cart', href: '/cart' },
                                { label: 'Sign In', href: '/login' },
                                { label: 'Create Account', href: '/register' },
                            ].map(({ label, href }) => (
                                <li key={label}>
                                    <Link href={href} className="text-gray-400 hover:text-primary transition-colors text-sm">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Column */}
                    <div>
                        <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-widest">Support</h3>
                        <ul className="space-y-3">
                            {[
                                { label: 'Contact Us', href: '/contact' },
                                { label: 'Help Center', href: '/contact#faq' },
                                { label: 'Shipping Info', href: '/contact#shipping' },
                                { label: 'Returns & Refunds', href: '/contact#returns' },
                                { label: 'Track Order', href: '/orders' },
                            ].map(({ label, href }) => (
                                <li key={label}>
                                    <Link href={href} className="text-gray-400 hover:text-primary transition-colors text-sm">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Column */}
                    <div>
                        <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-widest">Legal</h3>
                        <ul className="space-y-3">
                            {[
                                { label: 'Privacy Policy', href: '/contact#privacy' },
                                { label: 'Terms of Service', href: '/contact#terms' },
                                { label: 'Cookie Policy', href: '/contact#cookies' },
                            ].map(({ label, href }) => (
                                <li key={label}>
                                    <Link href={href} className="text-gray-400 hover:text-primary transition-colors text-sm">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-xs">
                        © {new Date().getFullYear()} FreshCart. All rights reserved.
                    </p>
                    {/* Payment Icons */}
                    <div className="flex items-center gap-3">
                        {['Visa', 'Mastercard', 'PayPal'].map((pay) => (
                            <span key={pay} className="bg-white/10 text-gray-300 text-xs font-semibold px-3 py-1.5 rounded-md border border-white/10">
                                {pay}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
