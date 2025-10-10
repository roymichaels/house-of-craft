import { SceneMode } from '@/contexts/SceneContext';

export interface CameraPath {
  position: [number, number, number];
  lookAt: [number, number, number];
  fov: number;
}

export const chamberPaths: Record<SceneMode, CameraPath> = {
  hero: {
    position: [0, 0, 10],
    lookAt: [0, 0, 0],
    fov: 50
  },
  mindcraft: {
    position: [5, 2, 8],
    lookAt: [0, 0, 0],
    fov: 45
  },
  objects: {
    position: [0, -1, 12],
    lookAt: [0, 0, -3],
    fov: 42
  },
  doctrine: {
    position: [-4, 2, 10],
    lookAt: [0, 1, 0],
    fov: 48
  },
  circle: {
    position: [0, 5, 12],
    lookAt: [0, -1, -5],
    fov: 52
  }
};
