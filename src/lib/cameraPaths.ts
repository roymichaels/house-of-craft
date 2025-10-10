import { SceneMode } from '@/contexts/SceneContext';

export interface CameraPath {
  position: [number, number, number];
  lookAt: [number, number, number];
  fov: number;
  roll: number; // Camera tilt in degrees
}

export const chamberPaths: Record<SceneMode, CameraPath> = {
  hero: {
    position: [0, 0, 10],
    lookAt: [0, 0, 0],
    fov: 50,
    roll: 0
  },
  mindcraft: {
    position: [12, 3, 10],
    lookAt: [15, 2, -5],
    fov: 45,
    roll: -3
  },
  objects: {
    position: [-8, 0, 12],
    lookAt: [-12, -1, -10],
    fov: 42,
    roll: 2
  },
  doctrine: {
    position: [-12, 4, 14],
    lookAt: [-15, 3, 5],
    fov: 48,
    roll: 0
  },
  circle: {
    position: [0, 8, 16],
    lookAt: [0, 10, -8],
    fov: 55,
    roll: 0
  }
};
