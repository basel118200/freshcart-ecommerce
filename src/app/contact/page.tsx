'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, ChevronDown, ChevronUp, Send } from 'lucide-react';
import Link from 'next/link';

const faqs = [
    { q: 'How long does delivery take?', a: 'Standard delivery takes 3–5 business days. Express delivery is available for same-day or next-day arrival in select areas.' },
    { q: 'Can I return a product?', a: 'Yes! We offer a 14-day return policy. Items must be unused and in original packaging. Contact us to initiate a return.' },
    { q: 'How do I track my order?', a: 'Once your order ships, you\'ll receive an email with a tracking link. You can also view your orders from your account dashboard.' },
    { q: 'What payment methods do you accept?', a: 'We accept Visa, Mastercard, PayPal, and cash on delivery for select areas.' },
    { q: 'Is there a minimum order amount for free shipping?', a: 'Yes, orders over 500 EGP qualify for free standard shipping.' },
];

export default function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4000);
        setForm({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="section-padding">
            <div className="container">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-secondary mb-3">Contact Us</h1>
                    <p className="text-gray-500 max-w-xl mx-auto">Have a question or need help? We're here for you. Fill out the form and we'll get back to you within 24 hours.</p>
                </div>

                {/* Contact Info Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
                    {[
                        {
                            icon: Phone, label: 'Phone', color: 'bg-blue-50 text-blue-600',
                            sub: 'Mon-Fri from 8am to 6pm',
                            value: '+1 (800) 123-4567',
                            href: 'tel:+18001234567'
                        },
                        {
                            icon: Mail, label: 'Email', color: 'bg-green-50 text-green-600',
                            sub: "We'll respond within 24 hours",
                            value: 'support@freshcart.com',
                            href: 'mailto:support@freshcart.com'
                        },
                        {
                            icon: MapPin, label: 'Office', color: 'bg-orange-50 text-orange-600',
                            sub: '123 Commerce Street',
                            value: 'New York, NY 10001',
                            href: '#'
                        },
                        {
                            icon: Clock, label: 'Business Hours', color: 'bg-purple-50 text-purple-600',
                            sub: 'Mon - Fri: 8am - 6pm',
                            value: 'Sat: 9am - 4pm · Sun: Closed',
                            href: '#'
                        },
                    ].map(({ icon: Icon, label, color, sub, value, href }) => (
                        <a key={label} href={href} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all group">
                            <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <Icon size={22} />
                            </div>
                            <h3 className="font-bold text-secondary mb-1">{label}</h3>
                            <p className="text-gray-400 text-xs mb-1">{sub}</p>
                            <p className="text-primary text-sm font-semibold">{value}</p>
                        </a>
                    ))}
                </div>

                {/* Form + FAQ Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                    {/* Contact Form */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
                        <h2 className="text-2xl font-bold text-secondary mb-1">Send us a Message</h2>
                        <p className="text-gray-400 text-sm mb-6">Fill out the form and we'll get back to you</p>

                        {submitted && (
                            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm font-medium">
                                ✅ Message sent! We'll get back to you within 24 hours.
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-semibold text-secondary block mb-1.5">Your Name</label>
                                    <input
                                        type="text" required placeholder="John Doe"
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                        className="input-field"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-secondary block mb-1.5">Email Address</label>
                                    <input
                                        type="email" required placeholder="john@example.com"
                                        value={form.email}
                                        onChange={e => setForm({ ...form, email: e.target.value })}
                                        className="input-field"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-secondary block mb-1.5">Subject</label>
                                <input
                                    type="text" required placeholder="How can we help?"
                                    value={form.subject}
                                    onChange={e => setForm({ ...form, subject: e.target.value })}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-secondary block mb-1.5">Message</label>
                                <textarea
                                    required rows={5} placeholder="Tell us more about your issue..."
                                    value={form.message}
                                    onChange={e => setForm({ ...form, message: e.target.value })}
                                    className="input-field resize-none"
                                />
                            </div>
                            <button type="submit" className="btn-primary w-full py-3.5 flex items-center justify-center gap-2">
                                <Send size={18} /> Send Message
                            </button>
                        </form>
                    </div>

                    {/* FAQ */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <MessageSquare size={20} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-secondary">Quick Answers</h2>
                                <p className="text-gray-400 text-sm">Looking for quick answers?</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {faqs.map((faq, i) => (
                                <div key={i} className="border border-gray-100 rounded-xl overflow-hidden bg-white">
                                    <button
                                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                        className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-secondary hover:bg-gray-50 transition-colors text-sm"
                                    >
                                        {faq.q}
                                        {openFaq === i ? <ChevronUp size={18} className="text-primary flex-shrink-0" /> : <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />}
                                    </button>
                                    {openFaq === i && (
                                        <div className="px-5 pb-4 text-gray-500 text-sm leading-relaxed border-t border-gray-50">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 bg-primary/5 border border-primary/20 rounded-2xl p-5 text-center">
                            <p className="text-secondary font-semibold mb-1">Still have questions?</p>
                            <p className="text-gray-500 text-sm mb-3">Our support team is available 24/7</p>
                            <a href="mailto:support@freshcart.com" className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 text-sm">
                                <Mail size={16} /> Email Support
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
