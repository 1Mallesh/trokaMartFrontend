import { create } from "zustand";

interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
  seller: string;
  location: string;
  currency: string;
}

interface CartStore {
  items: CartItem[];
  currency: string;
  location: string;
  addItem: (item: CartItem) => void;
  addToCart: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  setLocation: (location: string, currency: string) => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  currency: 'INR',
  location: 'India',

  addItem: (item) =>
    set((state) => {
      const existingItem = state.items.find((i) => i.id === item.id);
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
          ),
        };
      }
      return { items: [...state.items, item] };
    }),

  addToCart: (item) => get().addItem(item),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  updateQuantity: (id, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      ),
    })),

  clearCart: () => set({ items: [] }),

  getTotal: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),

  getItemCount: () => get().items.reduce((count, item) => count + item.quantity, 0),

  setLocation: (location, currency) => set({ location, currency }),
}));