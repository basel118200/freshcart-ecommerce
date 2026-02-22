import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import toast from 'react-hot-toast';

// ── Cart ──
export function useCart() {
    const qc = useQueryClient();

    const cartQuery = useQuery({
        queryKey: ['cart'],
        queryFn: async () => (await api.get('/cart')).data,
        enabled: typeof window !== 'undefined' && !!localStorage.getItem('userToken'),
    });

    const addToCart = useMutation({
        mutationFn: async (productId: string) => (await api.post('/cart', { productId })).data,
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['cart'] }); toast.success('Added to cart!'); },
        onError: () => { toast.error('Failed to add to cart. Please login.'); }
    });

    const updateQuantity = useMutation({
        mutationFn: async ({ productId, count }: { productId: string; count: number }) => (await api.put(`/cart/${productId}`, { count })).data,
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['cart'] }); }
    });

    const removeItem = useMutation({
        mutationFn: async (productId: string) => (await api.delete(`/cart/${productId}`)).data,
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['cart'] }); toast.success('Item removed'); }
    });

    const clearCart = useMutation({
        mutationFn: async () => (await api.delete('/cart')).data,
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['cart'] }); toast.success('Cart cleared'); }
    });

    return {
        cartData: cartQuery.data,
        isLoading: cartQuery.isLoading,
        addToCart: addToCart.mutate,
        updateQuantity: updateQuantity.mutate,
        removeItem: removeItem.mutate,
        clearCart: clearCart.mutate,
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
