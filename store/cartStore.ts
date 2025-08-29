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
    migrateCart: (fromKey: string, toKey: string) => void;
}

// Create a factory function to generate cart stores with different persistence keys
const createCartStore = (storageKey: string) => create(
    persist(
        (set, get: () => CartState) => ({
            cart: [],
            addToCart: (item: Item) => set((state: CartState) => {
                const existingItem = state.cart.find((i: Item) => i.id === item.id);
                if (existingItem) {
                    return {
                        cart: state.cart.map((i: Item) =>
                            i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
                        )
                    };
                } else {
                    return { cart: [...state.cart, item] };
                }
            }),
            updateQuantity: (item: Item, quantity: number) => set((state: CartState) => ({
                cart: state.cart.map((i: Item) => i.id === item.id ? { ...i, quantity } : i)
            })),
            removeFromCart: (item: Item) => set((state: CartState) => ({
                cart: state.cart.filter((i: Item) => i.id !== item.id)
            })),
            clearCart: () => set({ cart: [] }),
            getTotal: () => get().cart.reduce((acc: number, item: Item) => acc + item.selling_price * item.quantity, 0),
            getCartCount: () => get().cart.length,
            migrateCart: (fromKey: string, toKey: string) => {
                // Get cart data from old storage key
                const oldCartData = localStorage.getItem(fromKey);
                if (oldCartData) {
                    try {
                        const parsedData = JSON.parse(oldCartData);
                        const oldCart = parsedData.state?.cart || [];

                        // Merge with current cart
                        const currentCart = get().cart;
                        const mergedCart = [...currentCart];

                        oldCart.forEach((oldItem: Item) => {
                            const existingIndex = mergedCart.findIndex(item => item.id === oldItem.id);
                            if (existingIndex >= 0) {
                                // Add quantities if item exists
                                mergedCart[existingIndex].quantity += oldItem.quantity;
                            } else {
                                // Add new item
                                mergedCart.push(oldItem);
                            }
                        });

                        // Update current cart
                        set({ cart: mergedCart });

                        // Remove old cart data
                        localStorage.removeItem(fromKey);
                    } catch (error) {
                        console.error('Error migrating cart:', error);
                    }
                }
            }
        }),
        {
            name: storageKey,
        }
    )
);

// Create stores for different scenarios
const guestCartStore = createCartStore("guest-cart");
const createUserCartStore = (userId: string) => createCartStore(`user-cart-${userId}`);

// Main hook that manages which store to use
let currentStore: ReturnType<typeof createCartStore> | null = null;
let currentUserId: string | null = null;

const useCartStore = (userId?: string | null): CartState => {
    const isLoggedIn = Boolean(userId);
    const userIdString = userId?.toString();

    // Determine if we need to switch stores
    const shouldSwitchStore = currentUserId !== userIdString;

    if (shouldSwitchStore) {
        const oldStore = currentStore;
        const oldUserId = currentUserId;

        // Create new store based on login status
        if (isLoggedIn && userIdString) {
            currentStore = createUserCartStore(userIdString);
            currentUserId = userIdString;
        } else {
            currentStore = guestCartStore;
            currentUserId = null;
        }

        // Migrate cart from guest to user or vice versa
        if (oldStore && currentStore) {
            const oldStorageKey = isLoggedIn
                ? "guest-cart"  // Moving from guest to user
                : `user-cart-${oldUserId}`; // Moving from user to guest

            const newStorageKey = isLoggedIn
                ? `user-cart-${userIdString}`
                : "guest-cart";

            // Only migrate if moving from guest to user (not the reverse)
            if (isLoggedIn && !oldUserId) {
                currentStore.getState().migrateCart(oldStorageKey, newStorageKey);
            }
        }
    }

    // Initialize store if it doesn't exist
    if (!currentStore) {
        if (isLoggedIn && userIdString) {
            currentStore = createUserCartStore(userIdString);
            currentUserId = userIdString;
        } else {
            currentStore = guestCartStore;
            currentUserId = null;
        }
    }

    return currentStore();
};

export default useCartStore;