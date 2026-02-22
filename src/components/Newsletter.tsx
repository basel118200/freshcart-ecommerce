'use client';

import { useState } from 'react';
import { Mail, Check, Star, ArrowRight, Smartphone } from 'lucide-react';

export default function Newsletter() {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setSubscribed(true);
        setEmail('');
        setTimeout(() => setSubscribed(false), 4000);
    };

    return (
        <section className="py-16 bg-gradient-to-br from-green-50 via-white to-emerald-50">
            <div className="container">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

                    {/* ── Left: Newsletter ── */}
                    <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
                        {/* Badge */}
                        <div className="flex items-center gap-2.5 mb-5">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                                <Mail size={18} className="text-white" />
                            </div>
                            <div>
                                <div className="text-xs font-bold text-primary uppercase tracking-widest">Newsletter</div>
                                <div className="text-xs text-gray-400">50,000+ subscribers</div>
                            </div>
                        </div>

                        {/* Heading */}
                        <h2 className="text-3xl md:text-4xl font-extrabold text-secondary mb-3 leading-tight">
                            Get the Freshest Updates{' '}
                            <span className="text-primary">Delivered Free</span>
                        </h2>
                        <p className="text-gray-500 mb-6">
                            Weekly recipes, seasonal offers &amp; exclusive member perks.
                        </p>

                        {/* Feature pills */}
                        <div className="flex flex-wrap gap-2 mb-7">
                            {['Fresh Picks Weekly', 'Free Delivery Codes', 'Members-Only Deals'].map((item) => (
                                <span key={item} className="flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full">
                                    <Check size={12} strokeWidth={3} /> {item}
                                </span>
                            ))}
                        </div>

                        {/* Form */}
                        {subscribed ? (
                            <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-5 py-4">
                                <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                                    <Check size={18} className="text-white" strokeWidth={3} />
                                </div>
                                <div>
                                    <div className="font-bold text-secondary text-sm">You're subscribed! 🎉</div>
                                    <div className="text-gray-400 text-xs">Check your inbox for a welcome email.</div>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex gap-3">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                                <button type="submit" className="btn-primary px-5 py-3 flex items-center gap-2 text-sm whitespace-nowrap">
                                    Subscribe <ArrowRight size={16} />
                                </button>
                            </form>
                        )}

                        <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                            🔒 Unsubscribe anytime. No spam, ever.
                        </p>
                    </div>

                    {/* ── Right: Mobile App Card ── */}
                    <div className="bg-secondary rounded-3xl p-8 md:p-10 text-white relative overflow-hidden">
                        {/* Decorative circles */}
                        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full" />
                        <div className="absolute -bottom-16 -left-10 w-64 h-64 bg-white/5 rounded-full" />

                        {/* Badge */}
                        <div className="relative flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <Smartphone size={15} className="text-white" />
                            </div>
                            <span className="text-xs font-bold text-primary uppercase tracking-widest">Mobile App</span>
                        </div>

                        <h3 className="relative text-2xl md:text-3xl font-extrabold mb-2 leading-tight">
                            Shop Faster on Our App
                        </h3>
                        <p className="relative text-gray-400 text-sm mb-8">
                            Get app-exclusive deals &amp; 15% off your first order.
                        </p>

                        {/* App Store Buttons */}
                        <div className="relative flex flex-col gap-3 mb-7">
                            <a href="#" className="flex items-center gap-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl px-5 py-3.5 transition-all group">
                                <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white flex-shrink-0">
                                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                                </svg>
                                <div>
                                    <div className="text-[10px] text-gray-400 uppercase tracking-wider">Download on</div>
                                    <div className="text-white font-bold text-sm">App Store</div>
                                </div>
                            </a>
                            <a href="#" className="flex items-center gap-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl px-5 py-3.5 transition-all group">
                                <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white flex-shrink-0">
                                    <path d="M3.18 23.76c.3.17.64.22.99.14l12.24-6.89-2.79-2.79-10.44 9.54zM.5 1.56C.19 1.88 0 2.38 0 3.02v17.97c0 .64.19 1.14.5 1.46l.08.07 10.07-10.07v-.24L.58 1.49.5 1.56zm18.17 9.47l-2.56-1.44-3.22 3.22 3.22 3.22 2.59-1.46c.74-.42.74-1.1-.03-1.54zM4.17.24L16.41 7.13l-2.79 2.79L3.18.18c.35-.08.7-.03.99.06z" />
                                </svg>
                                <div>
                                    <div className="text-[10px] text-gray-400 uppercase tracking-wider">Get it on</div>
                                    <div className="text-white font-bold text-sm">Google Play</div>
                                </div>
                            </a>
                        </div>

                        {/* Rating */}
                        <div className="relative flex items-center gap-2">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={14} fill="#EAB308" color="#EAB308" />
                                ))}
                            </div>
                            <span className="text-sm text-gray-300 font-medium">4.9 · 100K+ downloads</span>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
