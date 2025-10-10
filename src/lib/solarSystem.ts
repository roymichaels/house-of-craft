import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// ============================================================================
// EXACT RECREATION OF ORIGINAL MAIN.JS SOLAR SYSTEM
// ============================================================================

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let controls: OrbitControls;
let animationId: number;
let isInitialized = false;

interface CelestialBody {
  mesh: THREE.Mesh;
  orbitRadius: number;
  orbitSpeed: number;
  angle: number;
  rotationSpeed: number;
  moons?: Moon[];
}

interface Moon {
  mesh: THREE.Mesh;
  orbitRadius: number;
  orbitSpeed: number;
  angle: number;
}

const celestialBodies: CelestialBody[] = [];

// Planet data matching original main.js exactly
const PLANETS_DATA = [
  { name: "Mercury", radius: 0.8, distance: 12, speed: 4.15, rotation: 0.02, color: 0x8C7853, angle: 0 },
  { name: "Venus", radius: 1.5, distance: 18, speed: 1.62, rotation: 0.004, color: 0xFFC649, angle: 0.3 },
  { 
    name: "Earth", 
    radius: 1.6, 
    distance: 25, 
    speed: 1.0, 
    rotation: 0.01, 
    color: 0x4169E1, 
    angle: 0.6,
    moon: { radius: 0.4, distance: 3, speed: 0.5, color: 0xAAAAAA }
  },
  { name: "Mars", radius: 1.2, distance: 32, speed: 0.53, rotation: 0.01, color: 0xCD5C5C, angle: 0.9 },
  { name: "Jupiter", radius: 4.0, distance: 52, speed: 0.084, rotation: 0.04, color: 0xDAA520, angle: 1.2 },
  { name: "Saturn", radius: 3.5, distance: 70, speed: 0.034, rotation: 0.038, color: 0xF4A460, angle: 1.5, hasRings: true },
  { name: "Uranus", radius: 2.5, distance: 85, speed: 0.012, rotation: 0.03, color: 0x4FD0E0, angle: 1.8 },
  { name: "Neptune", radius: 2.4, distance: 100, speed: 0.006, rotation: 0.032, color: 0x4169E1, angle: 2.1 },
];

export function initSolarSystem(container: HTMLElement) {
  if (isInitialized) {
    console.warn('⚠️ Solar System already initialized');
    return () => {};
  }
  
  console.log('🌌 Initializing Solar System (main.js recreation)...');
  isInitialized = true;
  
  cleanupSolarSystem();
  
  // ============================================================================
  // SCENE
  // ============================================================================
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000814);
  
  // ============================================================================
  // CAMERA
  // ============================================================================
  camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 50, 120);
  camera.lookAt(0, 0, 0);
  
  // ============================================================================
  // RENDERER
  // ============================================================================
  renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: false
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);
  
  // ============================================================================
  // ORBIT CONTROLS
  // ============================================================================
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 15;
  controls.maxDistance = 200;
  
  // ============================================================================
  // LIGHTING
  // ============================================================================
  const ambientLight = new THREE.AmbientLight(0x333333, 1.0);
  scene.add(ambientLight);
  
  const sunLight = new THREE.PointLight(0xFFFFFF, 3.0, 500);
  sunLight.position.set(0, 0, 0);
  scene.add(sunLight);
  
  // ============================================================================
  // STARFIELD
  // ============================================================================
  createStarfield();
  
  // ============================================================================
  // SUN
  // ============================================================================
  const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
  const sunMaterial = new THREE.MeshStandardMaterial({
    color: 0xFDB813,
    emissive: 0xFDB813,
    emissiveIntensity: 1.5,
    toneMapped: false
  });
  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  scene.add(sun);
  
  // Sun glow
  const glowGeometry = new THREE.SphereGeometry(6, 32, 32);
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0xFDB813,
    transparent: true,
    opacity: 0.3,
    side: THREE.BackSide
  });
  const sunGlow = new THREE.Mesh(glowGeometry, glowMaterial);
  scene.add(sunGlow);
  
  // ============================================================================
  // PLANETS
  // ============================================================================
  PLANETS_DATA.forEach(planetData => {
    // Create planet
    const geometry = new THREE.SphereGeometry(planetData.radius, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: planetData.color,
      roughness: 0.7,
      metalness: 0.3
    });
    const planet = new THREE.Mesh(geometry, material);
    
    // Set initial position
    planet.position.x = Math.cos(planetData.angle) * planetData.distance;
    planet.position.z = Math.sin(planetData.angle) * planetData.distance;
    scene.add(planet);
    
    const bodyData: CelestialBody = {
      mesh: planet,
      orbitRadius: planetData.distance,
      orbitSpeed: planetData.speed,
      angle: planetData.angle,
      rotationSpeed: planetData.rotation
    };
    
    // Add rings for Saturn
    if (planetData.hasRings) {
      const ringGeometry = new THREE.RingGeometry(
        planetData.radius * 1.5,
        planetData.radius * 2.5,
        64
      );
      const ringMaterial = new THREE.MeshStandardMaterial({
        color: 0xC4A35A,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
        roughness: 0.8
      });
      const rings = new THREE.Mesh(ringGeometry, ringMaterial);
      rings.rotation.x = Math.PI / 2;
      planet.add(rings);
    }
    
    // Add moon for Earth
    if (planetData.moon) {
      const moonGeometry = new THREE.SphereGeometry(planetData.moon.radius, 16, 16);
      const moonMaterial = new THREE.MeshStandardMaterial({
        color: planetData.moon.color,
        roughness: 0.9,
        metalness: 0.1
      });
      const moon = new THREE.Mesh(moonGeometry, moonMaterial);
      scene.add(moon);
      
      bodyData.moons = [{
        mesh: moon,
        orbitRadius: planetData.moon.distance,
        orbitSpeed: planetData.moon.speed,
        angle: 0
      }];
    }
    
    celestialBodies.push(bodyData);
    
    // Create orbit path
    createOrbitPath(planetData.distance);
  });
  
  // ============================================================================
  // ANIMATION LOOP
  // ============================================================================
  function animate() {
    animationId = requestAnimationFrame(animate);
    
    // Rotate sun
    sun.rotation.y += 0.001;
    sunGlow.rotation.y -= 0.0005;
    
    // Update planets
    celestialBodies.forEach(body => {
      // Orbit
      body.angle += body.orbitSpeed * 0.001;
      body.mesh.position.x = Math.cos(body.angle) * body.orbitRadius;
      body.mesh.position.z = Math.sin(body.angle) * body.orbitRadius;
      
      // Rotation
      body.mesh.rotation.y += body.rotationSpeed;
      
      // Update moons
      if (body.moons) {
        body.moons.forEach(moon => {
          moon.angle += moon.orbitSpeed * 0.01;
          moon.mesh.position.x = body.mesh.position.x + Math.cos(moon.angle) * moon.orbitRadius;
          moon.mesh.position.z = body.mesh.position.z + Math.sin(moon.angle) * moon.orbitRadius;
        });
      }
    });
    
    controls.update();
    renderer.render(scene, camera);
  }
  
  animate();
  
  // ============================================================================
  // RESIZE HANDLER
  // ============================================================================
  const handleResize = () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  };
  
  window.addEventListener('resize', handleResize);
  
  return () => {
    console.log('🔄 Cleanup');
    window.removeEventListener('resize', handleResize);
    cancelAnimationFrame(animationId);
    isInitialized = false;
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function createStarfield() {
  const starCount = 3000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(starCount * 3);
  
  for (let i = 0; i < starCount * 3; i += 3) {
    const radius = 200 + Math.random() * 200;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    positions[i] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i + 2] = radius * Math.cos(phi);
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
  const material = new THREE.PointsMaterial({
    color: 0xFFFFFF,
    size: 0.7,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true
  });
  
  const stars = new THREE.Points(geometry, material);
  scene.add(stars);
}

function createOrbitPath(radius: number) {
  const curve = new THREE.EllipseCurve(
    0, 0,           // center x, y
    radius, radius, // xRadius, yRadius
    0, 2 * Math.PI, // start angle, end angle
    false,          // clockwise
    0               // rotation
  );
  
  const points = curve.getPoints(128);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color: 0x444444,
    transparent: true,
    opacity: 0.3
  });
  
  const orbit = new THREE.Line(geometry, material);
  orbit.rotation.x = Math.PI / 2;
  scene.add(orbit);
}

export function cleanupSolarSystem() {
  if (!scene) return;
  
  console.log('🧹 Cleanup');
  
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  
  celestialBodies.length = 0;
  
  scene.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      object.geometry?.dispose();
      if (object.material instanceof THREE.Material) {
        object.material.dispose();
      }
    }
  });
  
  while(scene.children.length > 0) {
    scene.remove(scene.children[0]);
  }
  
  if (renderer) {
    renderer.dispose();
  }
  
  if (controls) {
    controls.dispose();
  }
  
  isInitialized = false;
}
