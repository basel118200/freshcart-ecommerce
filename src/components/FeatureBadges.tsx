import { Truck, ShieldCheck, RefreshCw, Headphones } from 'lucide-react';

const features = [
    {
        icon: Truck,
        color: 'text-blue-500 bg-blue-50',
        title: 'Free Shipping',
        subtitle: 'On orders over 500 EGP',
    },
    {
        icon: ShieldCheck,
        color: 'text-green-500 bg-green-50',
        title: 'Secure Payment',
        subtitle: '100% secure transactions',
    },
    {
        icon: RefreshCw,
        color: 'text-orange-500 bg-orange-50',
        title: 'Easy Returns',
        subtitle: '14-day return policy',
    },
    {
        icon: Headphones,
        color: 'text-purple-500 bg-purple-50',
        title: '24/7 Support',
        subtitle: 'Dedicated support team',
    },
];

export default function FeatureBadges() {
    return (
        <section className="border-y border-gray-100 bg-white py-5">
            <div className="container">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {features.map(({ icon: Icon, color, title, subtitle }) => (
                        <div key={title} className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                                <Icon size={20} />
                            </div>
                            <div>
                                <div className="font-bold text-secondary text-sm">{title}</div>
                                <div className="text-gray-400 text-xs">{subtitle}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
