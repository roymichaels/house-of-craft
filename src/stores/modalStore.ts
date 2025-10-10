import { create } from 'zustand';

export type ModalType = 'none' | 'object' | 'collections' | 'stories' | 'concierge';

interface ObjectData {
  title: string;
  category: string;
  description: string;
  image: string;
  story?: string;
  price?: string;
}

interface ModalState {
  activeModal: ModalType;
  objectData: ObjectData | null;
  openModal: (type: ModalType, data?: ObjectData) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  activeModal: 'none',
  objectData: null,
  openModal: (type, data) => set({ activeModal: type, objectData: data || null }),
  closeModal: () => set({ activeModal: 'none', objectData: null }),
}));
