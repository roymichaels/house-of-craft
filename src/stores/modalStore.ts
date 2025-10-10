import { create } from 'zustand';

export type ModalType = 'none' | 'object' | 'collections' | 'stories' | 'concierge' | 'email-capture' | 'cart' | 'doctrine' | 'sanctum' | 'mission' | 'philosophy' | 'wishlist';

export interface MediaItem {
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
}

interface ObjectData {
  title: string;
  category: string;
  description: string;
  image?: string; // Kept for backward compatibility
  media?: MediaItem[];
  story?: string;
  price?: string | number;
  productId?: string;
  subcategory?: string;
  inStock?: boolean;
  specs?: Record<string, string>;
}

interface ModalState {
  activeModal: ModalType;
  objectData: ObjectData | null;
  selectedCategory: string | null;
  isTransitioning: boolean;
  openModal: (type: ModalType, data?: ObjectData) => void;
  openModalWithCategory: (categoryId: string) => void;
  closeModal: () => void;
  setTransitioning: (transitioning: boolean) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  activeModal: 'none',
  objectData: null,
  selectedCategory: null,
  isTransitioning: false,
  openModal: (type, data) => {
    set({ isTransitioning: true });
    setTimeout(() => {
      set({ activeModal: type, objectData: data || null, selectedCategory: null, isTransitioning: false });
    }, 50);
  },
  openModalWithCategory: (categoryId) => {
    set({ isTransitioning: true });
    setTimeout(() => {
      set({ activeModal: 'collections', selectedCategory: categoryId, objectData: null, isTransitioning: false });
    }, 50);
  },
  closeModal: () => {
    set({ isTransitioning: true });
    setTimeout(() => {
      set({ activeModal: 'none', objectData: null, selectedCategory: null, isTransitioning: false });
    }, 300);
  },
  setTransitioning: (transitioning) => set({ isTransitioning: transitioning }),
}));
