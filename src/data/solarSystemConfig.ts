export interface MoonData {
  name: string;
  radius: number;
  orbitRadius: number;
  orbitSpeed: number;
  color: string;
}

export interface PlanetData {
  name: string;
  radius: number;
  orbitRadius: number;
  orbitSpeed: number;
  rotationSpeed: number;
  color: string;
  emissive?: string;
  rings?: boolean;
  moons?: MoonData[];
}

export const SUN_CONFIG = {
  radius: 5,
  glowIntensity: 2.5,
};

export const PLANETS: PlanetData[] = [
  {
    name: "Mercury",
    radius: 0.8,
    orbitRadius: 12,
    orbitSpeed: 4.15,
    rotationSpeed: 0.02,
    color: "#8C7853",
  },
  {
    name: "Venus",
    radius: 1.5,
    orbitRadius: 18,
    orbitSpeed: 1.62,
    rotationSpeed: 0.004,
    color: "#FFC649",
  },
  {
    name: "Earth",
    radius: 1.6,
    orbitRadius: 25,
    orbitSpeed: 1.0,
    rotationSpeed: 0.01,
    color: "#4169E1",
    moons: [
      { 
        name: "Moon", 
        radius: 0.4, 
        orbitRadius: 3, 
        orbitSpeed: 0.5,
        color: "#AAAAAA"
      }
    ],
  },
  {
    name: "Mars",
    radius: 1.2,
    orbitRadius: 32,
    orbitSpeed: 0.53,
    rotationSpeed: 0.01,
    color: "#CD5C5C",
  },
  {
    name: "Jupiter",
    radius: 4.0,
    orbitRadius: 52,
    orbitSpeed: 0.084,
    rotationSpeed: 0.04,
    color: "#DAA520",
    emissive: "#3D2817",
  },
  {
    name: "Saturn",
    radius: 3.5,
    orbitRadius: 70,
    orbitSpeed: 0.034,
    rotationSpeed: 0.038,
    color: "#F4A460",
    rings: true,
  },
  {
    name: "Uranus",
    radius: 2.5,
    orbitRadius: 85,
    orbitSpeed: 0.012,
    rotationSpeed: 0.03,
    color: "#4FD0E0",
    emissive: "#1A4D54",
  },
  {
    name: "Neptune",
    radius: 2.4,
    orbitRadius: 100,
    orbitSpeed: 0.006,
    rotationSpeed: 0.032,
    color: "#4169E1",
    emissive: "#1A2554",
  },
];

export const ASTEROID_BELT_CONFIG = {
  innerRadius: 38,
  outerRadius: 46,
  count: 2000,
  countMobile: 500,
};
