import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Item {
    id: number;
    name: string;
    description: string;
    stock: number;
    image: string;
    selling_price: number;
    quantity: number;
}

interface CartState {
    cart: Item[];
    addToCart: (item: Item) => void;
    updateQuantity: (item: Item, quantity: number) => void;
    removeFromCart: (item: Item) => void;
    clearCart: () => void;
    getTotal: () => number;
    getCartCount: () => number;
    getItemCount: () => number;
}

const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            cart: [],

            addToCart: (item: Item) => set((state) => {
                const existingItem = state.cart.find((i) => i.id === item.id);
                if (existingItem) {
                    const newQuantity = existingItem.quantity + item.quantity;
                    if (newQuantity > item.stock) {
                        // Don't exceed stock limit
                        return state;
                    }
                    return {
                        cart: state.cart.map((i) =>
                            i.id === item.id ? { ...i, quantity: newQuantity } : i
                        )
                    };
                } else {
                    return { cart: [...state.cart, item] };
                }
            }),

            updateQuantity: (item: Item, quantity: number) => set((state) => {
                if (quantity <= 0) {
                    return {
                        cart: state.cart.filter((i) => i.id !== item.id)
                    };
                }
                if (quantity > item.stock) {
                    return state; // Don't exceed stock
                }
                return {
                    cart: state.cart.map((i) => i.id === item.id ? { ...i, quantity } : i)
                };
            }),

            removeFromCart: (item: Item) => set((state) => ({
                cart: state.cart.filter((i) => i.id !== item.id)
            })),

            clearCart: () => set({ cart: [] }),

            getTotal: () => {
                const state = get();
                return state.cart.reduce((acc, item) => acc + item.selling_price * item.quantity, 0);
            },

            getCartCount: () => {
                const state = get();
                return state.cart.length;
            },

            getItemCount: () => {
                const state = get();
                return state.cart.reduce((acc, item) => acc + item.quantity, 0);
            },
        }),
        {
            name: 'cart-storage', // Storage key for persistence
            partialize: (state) => ({ cart: state.cart }), // Only persist cart data
        }
    )
);

export default useCartStore;