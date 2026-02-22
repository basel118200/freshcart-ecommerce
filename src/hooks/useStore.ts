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

    const refresh = () => {
        const cart = getGuestCart();
        setGuestCount(cart.reduce((acc: number, item: any) => acc + item.count, 0));
        qc.invalidateQueries({ queryKey: ['cart'] });
    };

    useEffect(() => {
        refresh();
        window.addEventListener('storage', refresh);
        window.addEventListener('cart-update', refresh);
        return () => {
            window.removeEventListener('storage', refresh);
            window.removeEventListener('cart-update', refresh);
        };
    }, []);

    const cartQuery = useQuery({
        queryKey: ['cart', !!getToken()],
        queryFn: async () => {
            const token = getToken();
            if (token) return (await api.get('/cart')).data;
            const cart = getGuestCart();
            return {
                status: 'success',
                numOfCartItems: cart.reduce((acc: number, item: any) => acc + item.count, 0),
                data: { products: [] }
            };
        }
    });

    const triggerUpdate = () => {
        window.dispatchEvent(new Event('cart-update'));
        // Also trigger storage for other tabs
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
        onMutate: async () => {
            // Optimistic update for UI speed
            setGuestCount(prev => prev + 1);
        },
        onSuccess: () => {
            toast.success('Added to cart!');
            triggerUpdate();
        },
        onError: () => {
            refresh(); // Rollback on error
            toast.error('Failed to add');
        }
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
        onSuccess: () => triggerUpdate()
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
            triggerUpdate();
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
            triggerUpdate();
        }
    });

    return {
        cartData: cartQuery.data,
        isLoading: cartQuery.isLoading,
        addToCart: addToCart.mutate,
        addToCartLoading: addToCart.isPending,
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

    const refresh = () => {
        setLocalWishlist(getGuestWishlist());
        qc.invalidateQueries({ queryKey: ['wishlist'] });
    };

    useEffect(() => {
        refresh();
        window.addEventListener('storage', refresh);
        window.addEventListener('wishlist-update', refresh);
        return () => {
            window.removeEventListener('storage', refresh);
            window.removeEventListener('wishlist-update', refresh);
        };
    }, []);

    const wishlistQuery = useQuery({
        queryKey: ['wishlist', !!getToken()],
        queryFn: async () => {
            const token = getToken();
            if (token) return (await api.get('/wishlist')).data;
            return { data: getGuestWishlist().map((id: string) => ({ id, _id: id })) };
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
            toast.success('Added ❤️');
            window.dispatchEvent(new Event('wishlist-update'));
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
            window.dispatchEvent(new Event('wishlist-update'));
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
