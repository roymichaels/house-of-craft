import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  category: string;
  subcategory: string;
  addedAt: number;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: Omit<WishlistItem, 'addedAt'>) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleItem: (item: Omit<WishlistItem, 'addedAt'>) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        set((state) => {
          const exists = state.items.find(i => i.productId === item.productId);
          if (exists) return state;
          
          return {
            items: [...state.items, { ...item, addedAt: Date.now() }]
          };
        });
      },
      
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(item => item.productId !== productId)
        }));
      },
      
      isInWishlist: (productId) => {
        return get().items.some(item => item.productId === productId);
      },
      
      toggleItem: (item) => {
        const exists = get().items.find(i => i.productId === item.productId);
        if (exists) {
          get().removeItem(item.productId);
        } else {
          get().addItem(item);
        }
      },
      
      clearWishlist: () => set({ items: [] })
    }),
    {
      name: 'apollo-wishlist'
    }
  )
);
