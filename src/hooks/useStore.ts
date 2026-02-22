import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';

// ── Helpers ──
const getGuestCart = () => {
    if (typeof window === 'undefined') return [];
    try {
        const cart = localStorage.getItem('guestCart');
        return cart ? JSON.parse(cart) : [];
    } catch { return []; }
};

const setGuestCart = (cart: any[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('guestCart', JSON.stringify(cart));
};

const getGuestWishlist = () => {
    if (typeof window === 'undefined') return [];
    try {
        const list = localStorage.getItem('guestWishlist');
        return list ? JSON.parse(list) : [];
    } catch { return []; }
};

const setGuestWishlist = (list: any[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('guestWishlist', JSON.stringify(list));
};

const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;

// ── Cart Hook ──
export function useCart() {
    const qc = useQueryClient();
    const [guestCount, setGuestCount] = useState(0);

    // Sync guest count for UI updates
    useEffect(() => {
        setGuestCount(getGuestCart().reduce((acc: number, item: any) => acc + item.count, 0));
    }, []);

    const cartQuery = useQuery({
        queryKey: ['cart'],
        queryFn: async () => {
            const token = getToken();
            if (token) return (await api.get('/cart')).data;
            return { status: 'success', numOfCartItems: getGuestCart().length, data: { products: [] } };
        }
    });

    const updateSync = () => {
        qc.invalidateQueries({ queryKey: ['cart'] });
        setGuestCount(getGuestCart().reduce((acc: number, item: any) => acc + item.count, 0));
        // Force Navbar to update too
        window.dispatchEvent(new Event('storage'));
    };

    const addToCart = useMutation({
        mutationFn: async (productId: string) => {
            const token = getToken();
            if (token) return (await api.post('/cart', { productId })).data;

            const cart = getGuestCart();
            const item = cart.find((i: any) => i.id === productId);
            if (item) item.count += 1;
            else cart.push({ id: productId, count: 1 });
            setGuestCart(cart);
            return { status: 'success' };
        },
        onSuccess: () => {
            toast.success('Added to cart!');
            updateSync();
        },
        onError: () => toast.error('Check your connection')
    });

    const updateQuantity = useMutation({
        mutationFn: async ({ productId, count }: { productId: string; count: number }) => {
            const token = getToken();
            if (token) return (await api.put(`/cart/${productId}`, { count })).data;

            const cart = getGuestCart();
            const item = cart.find((i: any) => i.id === productId);
            if (item) {
                item.count = count;
                setGuestCart(cart);
            }
            return { status: 'success' };
        },
        onSuccess: () => updateSync()
    });

    const removeItem = useMutation({
        mutationFn: async (productId: string) => {
            const token = getToken();
            if (token) return (await api.delete(`/cart/${productId}`)).data;
            setGuestCart(getGuestCart().filter((i: any) => i.id !== productId));
            return { status: 'success' };
        },
        onSuccess: () => {
            toast.success('Removed');
            updateSync();
        }
    });

    const clearCart = useMutation({
        mutationFn: async () => {
            const token = getToken();
            if (token) return (await api.delete('/cart')).data;
            setGuestCart([]);
            return { status: 'success' };
        },
        onSuccess: () => {
            toast.success('Cart cleared');
            updateSync();
        }
    });

    return {
        cartData: cartQuery.data,
        isLoading: cartQuery.isLoading,
        addToCart: addToCart.mutate,
        updateQuantity: updateQuantity.mutate,
        removeItem: removeItem.mutate,
        clearCart: clearCart.mutate,
        guestCount,
        isGuest: !getToken()
    };
}

// ── Wishlist Hook ──
export function useWishlist() {
    const qc = useQueryClient();
    const [localWishlist, setLocalWishlist] = useState<string[]>([]);

    useEffect(() => {
        setLocalWishlist(getGuestWishlist());
    }, []);

    const wishlistQuery = useQuery({
        queryKey: ['wishlist'],
        queryFn: async () => {
            const token = getToken();
            if (token) return (await api.get('/wishlist')).data;
            return { data: getGuestWishlist().map((id: string) => ({ id })) };
        }
    });

    const addToWishlist = useMutation({
        mutationFn: async (productId: string) => {
            const token = getToken();
            if (token) return (await api.post('/wishlist', { productId })).data;

            const list = getGuestWishlist();
            if (!list.includes(productId)) {
                list.push(productId);
                setGuestWishlist(list);
            }
            return { status: 'success' };
        },
        onSuccess: () => {
            toast.success('Added to Wishlist ❤️');
            qc.invalidateQueries({ queryKey: ['wishlist'] });
            setLocalWishlist(getGuestWishlist());
            window.dispatchEvent(new Event('storage'));
        }
    });

    const removeFromWishlist = useMutation({
        mutationFn: async (productId: string) => {
            const token = getToken();
            if (token) return (await api.delete(`/wishlist/${productId}`)).data;

            const list = getGuestWishlist().filter((id: string) => id !== productId);
            setGuestWishlist(list);
            return { status: 'success' };
        },
        onSuccess: () => {
            toast.success('Removed');
            qc.invalidateQueries({ queryKey: ['wishlist'] });
            setLocalWishlist(getGuestWishlist());
            window.dispatchEvent(new Event('storage'));
        }
    });

    const isInWishlist = (id: string) => {
        if (getToken()) {
            return wishlistQuery.data?.data?.some((item: any) => item.id === id || item._id === id) || false;
        }
        return localWishlist.includes(id);
    };

    return {
        wishlistData: wishlistQuery.data,
        isLoading: wishlistQuery.isLoading,
        addToWishlist: addToWishlist.mutate,
        removeFromWishlist: removeFromWishlist.mutate,
        isInWishlist,
    };
}
