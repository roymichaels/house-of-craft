import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare.js';

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let controls: OrbitControls;
let composer: EffectComposer;
let animationId: number;
let isInitialized = false;

interface CelestialBody {
  mesh: THREE.Mesh;
  dist: number;
  speed: number;
  angle: number;
  rotationSpeed: number;
  moons?: MoonData[];
}

interface MoonData {
  mesh: THREE.Mesh;
  orbitRadius: number;
  orbitSpeed: number;
  angle: number;
}

interface AsteroidBelt {
  asteroids: THREE.Mesh[];
  orbitRadius: number;
  orbitSpeed: number;
}

const celestialBodies: CelestialBody[] = [];
const asteroidBelts: AsteroidBelt[] = [];

// Planet data matching the original main.js
const PLANETS_DATA = [
  { name: "Mercury", radius: 0.8, dist: 12, speed: 4.15, rotation: 0.02, color: 0x8C7853, initialAngle: 0 },
  { name: "Venus", radius: 1.5, dist: 18, speed: 1.62, rotation: 0.004, color: 0xFFC649, initialAngle: 0.3 },
  { name: "Earth", radius: 1.6, dist: 25, speed: 1.0, rotation: 0.01, color: 0x4169E1, initialAngle: 0.6, 
    moons: [{ name: "Moon", radius: 0.4, orbitRadius: 3, speed: 0.5, color: 0xAAAAAA }] },
  { name: "Mars", radius: 1.2, dist: 32, speed: 0.53, rotation: 0.01, color: 0xCD5C5C, initialAngle: 0.9 },
  { name: "Jupiter", radius: 4.0, dist: 52, speed: 0.084, rotation: 0.04, color: 0xDAA520, initialAngle: 1.2,
    moons: [
      { name: "Io", radius: 0.35, orbitRadius: 5.5, speed: 1.0, color: 0xFFD700 },
      { name: "Europa", radius: 0.3, orbitRadius: 6.5, speed: 0.7, color: 0xDEB887 },
      { name: "Ganymede", radius: 0.5, orbitRadius: 7.5, speed: 0.5, color: 0x8B7355 },
      { name: "Callisto", radius: 0.45, orbitRadius: 8.5, speed: 0.3, color: 0x696969 }
    ] },
  { name: "Saturn", radius: 3.5, dist: 70, speed: 0.034, rotation: 0.038, color: 0xF4A460, initialAngle: 1.5, hasRings: true },
  { name: "Uranus", radius: 2.5, dist: 85, speed: 0.012, rotation: 0.03, color: 0x4FD0E0, initialAngle: 1.8 },
  { name: "Neptune", radius: 2.4, dist: 100, speed: 0.006, rotation: 0.032, color: 0x4169E1, initialAngle: 2.1 },
];

const DWARF_PLANETS_DATA = [
  { name: "Ceres", radius: 0.45, dist: 38, speed: 0.23, rotation: 0.02, color: 0x8B7355, initialAngle: 2.4 },
  { name: "Pluto", radius: 0.35, dist: 79, speed: 0.004, rotation: 0.015, color: 0xDEB887, initialAngle: 2.7 },
  { name: "Eris", radius: 0.35, dist: 96, speed: 0.002, rotation: 0.012, color: 0xE0E0E0, initialAngle: 3.0 },
  { name: "Makemake", radius: 0.3, dist: 86, speed: 0.0032, rotation: 0.013, color: 0xD2691E, initialAngle: 3.3 },
  { name: "Haumea", radius: 0.32, dist: 75, speed: 0.0034, rotation: 0.014, color: 0xF5F5DC, initialAngle: 3.6 },
];

export function initSolarSystem(container: HTMLElement) {
  // Prevent double initialization
  if (isInitialized) {
    console.warn('⚠️ Solar System already initialized, skipping...');
    return () => {};
  }
  
  console.log('🌌 Initializing Solar System...');
  isInitialized = true;
  
  // Clean up any existing scene first
  if (renderer && container.contains(renderer.domElement)) {
    container.removeChild(renderer.domElement);
  }
  cleanupSolarSystem();
  
  // Scene Setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000814);
  // Remove fog for now to debug visibility
  // scene.fog = new THREE.Fog(0x000814, 300, 500);

  // Camera
  camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 20, 50);
  camera.lookAt(0, 0, 0);
  console.log('📷 Camera position:', camera.position);

  // Renderer
  renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: false // Opaque background - we want the scene background color to show
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.8;
  container.appendChild(renderer.domElement);
  console.log('🎨 Renderer initialized and appended to container');

  // Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 10;
  controls.maxDistance = 300;
  controls.maxPolarAngle = Math.PI / 1.5;

  // Lighting - Much brighter
  const ambientLight = new THREE.AmbientLight(new THREE.Color(0.4, 0.4, 0.4), 1.5);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(new THREE.Color(1.0, 1.0, 1.0), 50.0, 1000, 2);
  pointLight.position.set(0, 0, 0);
  scene.add(pointLight);
  console.log('💡 Lighting added');

  // Starfield - Two layered spheres
  createStarfieldSpheres();
  
  // Distant point stars
  createDistantStars();

  // Sun - Bigger and brighter (use MeshStandardMaterial for emissive)
  const sunMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(1.5, 1.2, 0.8),
    emissive: new THREE.Color(1.5, 1.2, 0.8),
    emissiveIntensity: 2.0,
    toneMapped: false,
  });
  const sun = new THREE.Mesh(new THREE.SphereGeometry(8, 64, 64), sunMaterial);
  scene.add(sun);
  console.log('☀️ Sun created');

  // Lens flare
  const lensflare = new Lensflare();
  const textureFlare = createLensFlareTexture(512, new THREE.Color(1.0, 0.95, 0.8));
  lensflare.addElement(new LensflareElement(textureFlare, 200, 0));
  lensflare.addElement(new LensflareElement(textureFlare, 60, 0.6));
  lensflare.addElement(new LensflareElement(textureFlare, 70, 0.7));
  lensflare.addElement(new LensflareElement(textureFlare, 120, 0.9));
  lensflare.addElement(new LensflareElement(textureFlare, 70, 1.0));
  sun.add(lensflare);

  // Create planets
  createPlanets();
  
  // Create dwarf planets
  createDwarfPlanets();

  // Create asteroid belts
  createMainAsteroidBelt();
  createJupiterTrojans();
  createKuiperBelt();
  createScatteredDisk();
  createOortCloud();

  // Post-processing
  composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(container.clientWidth, container.clientHeight),
    1.0,  // strength - increased
    0.6,  // radius
    0.01  // threshold - lowered for more glow
  );
  composer.addPass(bloomPass);

  const outputPass = new OutputPass();
  composer.addPass(outputPass);

  // Animation loop
  let frameCount = 0;
  let lastFpsLog = Date.now();
  
  function animate() {
    animationId = requestAnimationFrame(animate);
    
    // FPS logging every second
    frameCount++;
    const now = Date.now();
    if (now - lastFpsLog > 1000) {
      console.log(`🎬 Animation running - FPS: ${frameCount}, Objects in scene: ${scene.children.length}`);
      frameCount = 0;
      lastFpsLog = now;
    }
    
    // Rotate sun
    sun.rotation.y += 0.001;
    
    // Update celestial bodies
    celestialBodies.forEach(body => {
      // Orbital motion
      body.angle += body.speed * 0.001;
      body.mesh.position.x = Math.cos(body.angle) * body.dist;
      body.mesh.position.z = Math.sin(body.angle) * body.dist;
      
      // Rotation
      body.mesh.rotation.y += body.rotationSpeed;
      
      // Update moons
      if (body.moons) {
        body.moons.forEach(moon => {
          moon.angle += moon.orbitSpeed * 0.01;
          moon.mesh.position.x = body.mesh.position.x + Math.cos(moon.angle) * moon.orbitRadius;
          moon.mesh.position.z = body.mesh.position.z + Math.sin(moon.angle) * moon.orbitRadius;
          moon.mesh.rotation.y += 0.005;
        });
      }
    });
    
    // Update asteroid belts
    asteroidBelts.forEach(belt => {
      belt.asteroids.forEach((asteroid, i) => {
        // Individual rotation
        asteroid.rotation.x += 0.001 + (i % 10) * 0.0001;
        asteroid.rotation.y += 0.002 + (i % 10) * 0.0002;
        asteroid.rotation.z += 0.0015 + (i % 10) * 0.00015;
      });
    });
    
    controls.update();
    
    // Use direct renderer as fallback if composer fails
    try {
      composer.render();
    } catch (error) {
      console.error('Composer error, using fallback:', error);
      renderer.render(scene, camera);
    }
  }
  
  animate();

  // Handle resize
  const handleResize = () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    composer.setSize(container.clientWidth, container.clientHeight);
  };
  
  window.addEventListener('resize', handleResize);

  return () => {
    console.log('🔄 Cleanup function called');
    window.removeEventListener('resize', handleResize);
    cancelAnimationFrame(animationId);
    isInitialized = false;
  };
}

function createStarfieldSpheres() {
  // Outer starfield sphere - much larger so camera is inside
  const outerStarfieldGeometry = new THREE.SphereGeometry(400, 64, 64);
  const outerStarfieldMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(1.2, 1.2, 1.2),
    side: THREE.BackSide,
    transparent: true,
    opacity: 0.8,
  });
  const outerStarfield = new THREE.Mesh(outerStarfieldGeometry, outerStarfieldMaterial);
  scene.add(outerStarfield);
  
  // Inner atmospheric sphere - also larger
  const innerStarfieldGeometry = new THREE.SphereGeometry(390, 64, 64);
  const innerStarfieldMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0.8, 0.9, 1.0),
    side: THREE.BackSide,
    transparent: true,
    opacity: 0.3,
  });
  const innerStarfield = new THREE.Mesh(innerStarfieldGeometry, innerStarfieldMaterial);
  scene.add(innerStarfield);
  console.log('⭐ Starfield spheres created');
}

function createDistantStars() {
  const starCount = 1500;
  const starsGeometry = new THREE.BufferGeometry();
  const starPositions = new Float32Array(starCount * 3);
  
  for (let i = 0; i < starCount * 3; i += 3) {
    const radius = 150 + Math.random() * 100;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    starPositions[i] = radius * Math.sin(phi) * Math.cos(theta);
    starPositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
    starPositions[i + 2] = radius * Math.cos(phi);
  }
  
  starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.7,
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: true
  });
  const stars = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(stars);
}

function createPlanets() {
  PLANETS_DATA.forEach(data => {
    const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: data.color,
      roughness: 0.8,
      metalness: 0.2,
    });
    const planet = new THREE.Mesh(geometry, material);
    
    const angle = data.initialAngle;
    planet.position.x = Math.cos(angle) * data.dist;
    planet.position.z = Math.sin(angle) * data.dist;
    scene.add(planet);
    
    const bodyData: CelestialBody = {
      mesh: planet,
      dist: data.dist,
      speed: data.speed,
      angle: angle,
      rotationSpeed: data.rotation,
    };
    
    // Add Saturn's rings
    if (data.hasRings) {
      const ringGeometry = new THREE.RingGeometry(data.radius * 1.5, data.radius * 2.5, 64);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0xC4A35A,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2;
      planet.add(ring);
    }
    
    // Add moons
    if (data.moons) {
      bodyData.moons = [];
      data.moons.forEach(moonData => {
        const moonGeometry = new THREE.SphereGeometry(moonData.radius, 16, 16);
        const moonMaterial = new THREE.MeshStandardMaterial({
          color: moonData.color,
          roughness: 0.9,
          metalness: 0.1,
        });
        const moon = new THREE.Mesh(moonGeometry, moonMaterial);
        scene.add(moon);
        
        bodyData.moons!.push({
          mesh: moon,
          orbitRadius: moonData.orbitRadius,
          orbitSpeed: moonData.speed,
          angle: Math.random() * Math.PI * 2,
        });
      });
    }
    
    celestialBodies.push(bodyData);
    
    // Add orbital path
    createOrbitPath(data.dist, 0x444444, 0.2);
  });
}

function createDwarfPlanets() {
  DWARF_PLANETS_DATA.forEach(data => {
    const geometry = new THREE.SphereGeometry(data.radius, 16, 16);
    const material = new THREE.MeshStandardMaterial({
      color: data.color,
      roughness: 0.9,
      metalness: 0.1,
    });
    const planet = new THREE.Mesh(geometry, material);
    
    const angle = data.initialAngle;
    planet.position.x = Math.cos(angle) * data.dist;
    planet.position.z = Math.sin(angle) * data.dist;
    scene.add(planet);
    
    celestialBodies.push({
      mesh: planet,
      dist: data.dist,
      speed: data.speed,
      angle: angle,
      rotationSpeed: data.rotation,
    });
    
    // Pulsing orbit for distant objects
    if (data.dist > 40) {
      createOrbitPath(data.dist, 0x666666, 0.15);
    } else {
      createOrbitPath(data.dist, 0x444444, 0.2);
    }
  });
}

function createOrbitPath(radius: number, color: number, opacity: number) {
  const geometry = new THREE.RingGeometry(radius - 0.05, radius + 0.05, 128);
  const material = new THREE.MeshBasicMaterial({
    color: color,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: opacity,
  });
  const ring = new THREE.Mesh(geometry, material);
  ring.rotation.x = Math.PI / 2;
  scene.add(ring);
}

function createMainAsteroidBelt() {
  // Inner Main Belt
  createAsteroidRegion(19.5, 21.5, 150, [0x8C7853, 0x696969, 0xA0A0A0]);
  // Middle Main Belt
  createAsteroidRegion(21.5, 23.5, 200, [0x8C7853, 0x696969, 0xA0A0A0]);
  // Outer Main Belt
  createAsteroidRegion(23.5, 25.5, 250, [0x8C7853, 0x696969, 0xA0A0A0]);
}

function createJupiterTrojans() {
  const jupiterDist = 52;
  const trojansAngle = Math.PI / 3; // 60 degrees for L4 and L5
  
  // L4 Trojans (leading)
  createTrojanGroup(jupiterDist, trojansAngle, 100);
  // L5 Trojans (trailing)
  createTrojanGroup(jupiterDist, -trojansAngle, 100);
}

function createTrojanGroup(orbitRadius: number, angleOffset: number, count: number) {
  const asteroids: THREE.Mesh[] = [];
  const colors = [0x8C7853, 0x696969];
  
  for (let i = 0; i < count; i++) {
    const size = 0.1 + Math.random() * 0.2;
    const geometry = new THREE.SphereGeometry(size, 6, 6);
    const material = new THREE.MeshStandardMaterial({
      color: colors[Math.floor(Math.random() * colors.length)],
      roughness: 0.9,
      metalness: 0.3,
    });
    const asteroid = new THREE.Mesh(geometry, material);
    
    const spread = 5;
    const angle = angleOffset + (Math.random() - 0.5) * 0.3;
    const radius = orbitRadius + (Math.random() - 0.5) * spread;
    
    asteroid.position.x = Math.cos(angle) * radius;
    asteroid.position.y = (Math.random() - 0.5) * 2;
    asteroid.position.z = Math.sin(angle) * radius;
    
    scene.add(asteroid);
    asteroids.push(asteroid);
  }
  
  asteroidBelts.push({
    asteroids,
    orbitRadius,
    orbitSpeed: 0.084, // Jupiter's speed
  });
}

function createKuiperBelt() {
  createAsteroidRegion(48, 62, 300, [0x9090A0, 0xB0B0C0, 0xC0C0D0], 3);
}

function createScatteredDisk() {
  createAsteroidRegion(62, 85, 150, [0xA0A0B0, 0xC0C0D0], 8);
}

function createOortCloud() {
  createAsteroidRegion(150, 200, 200, [0xD0D0E0, 0xE0E0F0], 15);
}

function createAsteroidRegion(
  innerRadius: number,
  outerRadius: number,
  count: number,
  colors: number[],
  verticalSpread: number = 1
) {
  const asteroids: THREE.Mesh[] = [];
  
  for (let i = 0; i < count; i++) {
    const size = 0.1 + Math.random() * 0.3;
    const geometry = new THREE.SphereGeometry(size, 6, 6);
    const material = new THREE.MeshStandardMaterial({
      color: colors[Math.floor(Math.random() * colors.length)],
      roughness: 0.9,
      metalness: 0.3,
    });
    const asteroid = new THREE.Mesh(geometry, material);
    
    const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
    const angle = Math.random() * Math.PI * 2;
    
    asteroid.position.x = Math.cos(angle) * radius;
    asteroid.position.y = (Math.random() - 0.5) * verticalSpread;
    asteroid.position.z = Math.sin(angle) * radius;
    
    scene.add(asteroid);
    asteroids.push(asteroid);
  }
  
  asteroidBelts.push({
    asteroids,
    orbitRadius: (innerRadius + outerRadius) / 2,
    orbitSpeed: 0.1 / ((innerRadius + outerRadius) / 2),
  });
}

function createLensFlareTexture(size: number, color: THREE.Color) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size / 2
  );
  
  gradient.addColorStop(0, `rgba(${color.r * 255}, ${color.g * 255}, ${color.b * 255}, 1)`);
  gradient.addColorStop(0.2, `rgba(${color.r * 255}, ${color.g * 255}, ${color.b * 255}, 0.8)`);
  gradient.addColorStop(0.5, `rgba(${color.r * 255}, ${color.g * 255}, ${color.b * 255}, 0.3)`);
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export function cleanupSolarSystem() {
  console.log('🧹 Cleaning up Solar System...');
  
  // Cancel animation
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = 0;
  }
  
  // Clear arrays
  celestialBodies.length = 0;
  asteroidBelts.length = 0;
  
  // Dispose of renderer and composer
  if (composer) {
    composer.dispose();
  }
  if (renderer) {
    renderer.dispose();
    renderer.forceContextLoss();
  }
  
  // Clear scene
  if (scene) {
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry?.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      }
    });
    scene.clear();
  }
  
  // Reset initialization flag
  isInitialized = false;
  
  console.log('✅ Cleanup complete');
}
