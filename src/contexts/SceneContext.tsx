import { create } from 'zustand';

export type SceneMode = 'hero' | 'mindcraft' | 'objects' | 'doctrine' | 'circle';

interface SceneState {
  mode: SceneMode;
  scrollProgress: number;
  setMode: (mode: SceneMode) => void;
  setScrollProgress: (progress: number) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  mode: 'hero',
  scrollProgress: 0,
  setMode: (mode) => set({ mode }),
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
}));
