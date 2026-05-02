import { create } from 'zustand';

interface CartState {
  cart: string[];
  toggleCart: (skillId: string) => void;
  clearCart: () => void;
}

/**
 * Global Store for managing the Custom Context Payload Cart.
 * Eliminates prop drilling for cart interactions.
 */
export const useCartStore = create<CartState>((set) => ({
  cart: [],
  toggleCart: (skillId) => set((state) => ({
    cart: state.cart.includes(skillId) 
      ? state.cart.filter(id => id !== skillId) 
      : [...state.cart, skillId]
  })),
  clearCart: () => set({ cart: [] }),
}));
