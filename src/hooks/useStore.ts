import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';

// ── Guest Cart Helpers ──
const getGuestCart = () => {
    if (typeof window === 'undefined') return [];
    const cart = localStorage.getItem('guestCart');
    return cart ? JSON.parse(cart) : [];
};

const setGuestCart = (cart: any[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('guestCart', JSON.stringify(cart));
};

// ── Cart ──
export function useCart() {
    const qc = useQueryClient();
    const [token, setToken] = useState<string | null>(null);
    const [guestCount, setGuestCount] = useState(0);

    useEffect(() => {
        setToken(localStorage.getItem('userToken'));
        setGuestCount(getGuestCart().length);
    }, []);

    const cartQuery = useQuery({
        queryKey: ['cart', !!token],
        queryFn: async () => {
            if (token) return (await api.get('/cart')).data;
            // Mock structure for guest
            return {
                status: 'success',
                numOfCartItems: getGuestCart().length,
                data: { products: [], totalCartPrice: 0 }
            };
        },
        enabled: typeof window !== 'undefined',
    });

    const addToCart = useMutation({
        mutationFn: async (productId: string) => {
            if (token) return (await api.post('/cart', { productId })).data;

            // Guest Logic
            const cart = getGuestCart();
            if (!cart.includes(productId)) {
                cart.push(productId);
                setGuestCart(cart);
            }
            return { status: 'success', message: 'Added to guest cart' };
        },
        onSuccess: (data) => {
            qc.invalidateQueries({ queryKey: ['cart'] });
            setGuestCount(getGuestCart().length);
            toast.success('Added to cart!');
        },
        onError: () => {
            toast.error('Failed to add to cart.');
        }
    });

    const updateQuantity = useMutation({
        mutationFn: async ({ productId, count }: { productId: string; count: number }) => {
            if (token) return (await api.put(`/cart/${productId}`, { count })).data;
            return { status: 'success' }; // Guest update quantity not fully implemented for simplicity
        },
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['cart'] }); }
    });

    const removeItem = useMutation({
        mutationFn: async (productId: string) => {
            if (token) return (await api.delete(`/cart/${productId}`)).data;

            const cart = getGuestCart().filter((id: string) => id !== productId);
            setGuestCart(cart);
            return { status: 'success' };
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['cart'] });
            setGuestCount(getGuestCart().length);
            toast.success('Item removed');
        }
    });

    const clearCart = useMutation({
        mutationFn: async () => {
            if (token) return (await api.delete('/cart')).data;
            setGuestCart([]);
            return { status: 'success' };
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['cart'] });
            setGuestCount(0);
            toast.success('Cart cleared');
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
        isGuest: !token
    };
}

// ── Wishlist ──
export function useWishlist() {
    const qc = useQueryClient();

    const wishlistQuery = useQuery({
        queryKey: ['wishlist'],
        queryFn: async () => (await api.get('/wishlist')).data,
        enabled: typeof window !== 'undefined' && !!localStorage.getItem('userToken'),
    });

    const addToWishlist = useMutation({
        mutationFn: async (productId: string) => (await api.post('/wishlist', { productId })).data,
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['wishlist'] }); toast.success('Added to wishlist ❤️'); }
    });

    const removeFromWishlist = useMutation({
        mutationFn: async (productId: string) => (await api.delete(`/wishlist/${productId}`)).data,
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['wishlist'] }); toast.success('Removed from wishlist'); }
    });

    return {
        wishlistData: wishlistQuery.data,
        isLoading: wishlistQuery.isLoading,
        addToWishlist: addToWishlist.mutate,
        removeFromWishlist: removeFromWishlist.mutate,
        isInWishlist: (id: string) => wishlistQuery.data?.data?.some((item: any) => item.id === id) || false,
    };
}
