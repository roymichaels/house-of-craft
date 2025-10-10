import { SceneMode } from '@/contexts/SceneContext';

export interface CameraPath {
  position: [number, number, number];
  lookAt: [number, number, number];
  fov: number;
  roll: number; // Camera tilt in degrees
}

export const chamberPaths: Record<SceneMode, CameraPath> = {
  hero: {
    position: [0, 0, 6],
    lookAt: [0, 1.2, 0],
    fov: 50,
    roll: 0
  },
  mindcraft: {
    position: [6, 1, 8],
    lookAt: [8, 0, -3],
    fov: 48,
    roll: -2
  },
  objects: {
    position: [-6, 0, 8],
    lookAt: [-8, 0, -3],
    fov: 46,
    roll: 2
  },
  doctrine: {
    position: [0, 6, 10],
    lookAt: [0, 4, -6],
    fov: 52,
    roll: 0
  },
  circle: {
    position: [0, 10, 12],
    lookAt: [0, 8, -4],
    fov: 55,
    roll: 0
  }
};
