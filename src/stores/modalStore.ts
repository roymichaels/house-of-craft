import { create } from 'zustand';

interface ObjectData {
  title: string;
  category: string;
  description: string;
  image: string;
  story?: string;
  price?: string;
}

interface ModalState {
  isOpen: boolean;
  objectData: ObjectData | null;
  openModal: (data: ObjectData) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  objectData: null,
  openModal: (data) => set({ isOpen: true, objectData: data }),
  closeModal: () => set({ isOpen: false, objectData: null }),
}));
