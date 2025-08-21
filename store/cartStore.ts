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
}

const useCartStore = create(
    persist(
        (set, get: () => CartState) => ({
            cart: [],
            addToCart: (item: Item) => set((state: CartState) => {
                const existingItem = state.cart.find((i: Item) => i.id === item.id);
                if (existingItem) {
                    return { cart: state.cart.map((i: Item) => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i) };
                } else {
                    return { cart: [...state.cart, item] };
                }
            }),
            updateQuantity: (item: Item, quantity: number) => set((state: CartState) => ({ cart: state.cart.map((i: Item) => i.id === item.id ? { ...i, quantity } : i) })),
            removeFromCart: (item: Item) => set((state: CartState) => ({ cart: state.cart.filter((i: Item) => i.id !== item.id) })),
            clearCart: () => set({ cart: [] }),
            getTotal: () => get().cart.reduce((acc: number, item: Item) => acc + item.selling_price * item.quantity, 0),
        }),
        {
            name: "cart",
        }
    )
)

export default useCartStore;